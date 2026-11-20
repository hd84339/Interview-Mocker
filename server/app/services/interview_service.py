from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified
from datetime import datetime, timezone
import re
from app.models.interview import Interview
from app.models.resume import Resume
from app.schemas.interview import InterviewCreate
from app.services.ai_service import ai_service
from app.services.rag_service import rag_service


class InterviewService:
    def _get_candidate_skills_and_context(self, db: Session, interview: Interview) -> tuple[list, str]:
        candidate_skills = []
        resume_context = "N/A"
        
        # 1. Check job_description for embedded skills (explicitly selected for this interview)
        if interview.job_description and "Key Candidate Skills:" in interview.job_description:
            m = re.search(r"Key Candidate Skills:\s*([^.\n]+)", interview.job_description)
            if m:
                candidate_skills = [s.strip() for s in m.group(1).split(",") if s.strip()]

        # 2. Try from interview.resume_id
        if not candidate_skills and interview.resume_id:
            res_obj = db.query(Resume).filter(Resume.id == interview.resume_id).first()
            if res_obj and res_obj.parsed_skills:
                candidate_skills = list(res_obj.parsed_skills)
        
        # 3. Fallback to user's latest resume if not attached
        if not candidate_skills and interview.user_id:
            latest = db.query(Resume).filter(Resume.user_id == interview.user_id).order_by(Resume.created_at.desc()).first()
            if latest and latest.parsed_skills:
                candidate_skills = list(latest.parsed_skills)
                if not interview.resume_id:
                    interview.resume_id = latest.id
                    db.commit()

        # 4. RAG context query
        if interview.resume_id:
            query_str = f"{interview.role_title} {' '.join(candidate_skills)} {interview.job_description or ''}"
            # synchronous-safe or called in async
            # we will call rag_service in async methods
        return candidate_skills, resume_context

    async def create_interview(self, db: Session, user_id: int, interview_in: InterviewCreate) -> Interview:
        # Check if resume_id is provided, otherwise lookup user's latest resume
        resume_id = interview_in.resume_id
        if not resume_id:
            latest = db.query(Resume).filter(Resume.user_id == user_id).order_by(Resume.created_at.desc()).first()
            if latest:
                resume_id = latest.id

        # Compile skills text into job description
        skills_list = interview_in.skills or []
        if not skills_list and resume_id:
            res_rec = db.query(Resume).filter(Resume.id == resume_id).first()
            if res_rec and res_rec.parsed_skills:
                skills_list = list(res_rec.parsed_skills)

        skills_prefix = f"Key Candidate Skills: {', '.join(skills_list)}.\n" if skills_list else ""
        job_desc = (skills_prefix + (interview_in.job_description or "")).strip() or None

        db_interview = Interview(
            user_id=user_id,
            role_title=interview_in.role_title,
            job_description=job_desc,
            company_name=interview_in.company_name or "Tech Company",
            experience_level=interview_in.experience_level,
            difficulty=interview_in.difficulty,
            resume_id=resume_id,
            duration=interview_in.duration,
            status="pending",
            questions=[],
            responses=[]
        )
        db.add(db_interview)
        db.commit()
        db.refresh(db_interview)
        return db_interview

    async def start_interview(self, db: Session, interview_id: int) -> dict:
        interview = self.get_interview(db, interview_id)
        if not interview:
            return None
        
        candidate_skills, _ = self._get_candidate_skills_and_context(db, interview)
        resume_context = "N/A"
        if interview.resume_id:
            query_str = f"{interview.role_title} {' '.join(candidate_skills)} {interview.job_description or ''}"
            resume_context = await rag_service.query_resume_context(
                resume_id=interview.resume_id,
                query_text=query_str
            )
        
        if not interview.started_at or not interview.questions:
            interview.started_at = datetime.now(timezone.utc)
            interview.status = "in_progress"
            
            first_q = await ai_service.generate_next_question(
                history=[],
                role_title=interview.role_title,
                experience_level=interview.experience_level,
                company_name=interview.company_name,
                difficulty=interview.difficulty,
                job_description=interview.job_description,
                resume_context=resume_context,
                candidate_skills=candidate_skills,
                remaining_time_minutes=interview.duration,
                already_asked_questions=[]
            )
            
            questions = list(interview.questions or [])
            questions.append(first_q)
            interview.questions = questions
            flag_modified(interview, "questions")
            db.commit()
            
        return {"started_at": interview.started_at.isoformat(), "question": interview.questions[-1] if interview.questions else None}

    async def process_answer(self, db: Session, interview_id: int, answer_data: dict) -> dict:
        interview = self.get_interview(db, interview_id)
        if not interview:
            return None
            
        now = datetime.now(timezone.utc)
        started_at = interview.started_at
        if started_at:
            if started_at.tzinfo is None:
                started_at = started_at.replace(tzinfo=timezone.utc)
            elapsed_seconds = (now - started_at).total_seconds()
        else:
            elapsed_seconds = 0
        remaining_minutes = int(interview.duration - (elapsed_seconds / 60))
        
        # Save answer
        responses = list(interview.responses or [])
        # Simple evaluation if code
        if answer_data.get("is_code"):
            eval_result = await ai_service.evaluate_code_submission(
                question="code task", 
                code=answer_data.get("answer", ""), 
                language=answer_data.get("language", "javascript")
            )
            responses.append({
                "question_id": answer_data.get("question_id"),
                "answer": answer_data.get("answer"),
                "is_code": True,
                "evaluation": eval_result
            })
        else:
            responses.append({
                "question_id": answer_data.get("question_id"),
                "answer": answer_data.get("answer")
            })
            
        interview.responses = responses
        flag_modified(interview, "responses")
        
        if remaining_minutes <= 0 or answer_data.get("force_finish"):
            interview.status = "completed"
            interview.completed_at = now
            db.commit()
            return {"finished": True}
            
        # Candidate skills & resume context
        candidate_skills, _ = self._get_candidate_skills_and_context(db, interview)
        resume_context = "N/A"
        if interview.resume_id:
            query_str = f"{interview.role_title} {' '.join(candidate_skills)} {interview.job_description or ''}"
            resume_context = await rag_service.query_resume_context(
                resume_id=interview.resume_id,
                query_text=query_str
            )

        # Collect all questions asked so far to strictly avoid repeating any
        already_asked = [
            (q.get("question") or q.get("text") or "").strip()
            for q in (interview.questions or [])
            if isinstance(q, dict) and (q.get("question") or q.get("text"))
        ]

        history = [{"q": q, "a": a} for q, a in zip(interview.questions, responses)]
        next_q = await ai_service.generate_next_question(
            history=history,
            role_title=interview.role_title,
            experience_level=interview.experience_level,
            company_name=interview.company_name,
            difficulty=interview.difficulty,
            job_description=interview.job_description,
            resume_context=resume_context,
            candidate_skills=candidate_skills,
            remaining_time_minutes=remaining_minutes,
            already_asked_questions=already_asked
        )
        
        questions = list(interview.questions or [])
        questions.append(next_q)
        interview.questions = questions
        flag_modified(interview, "questions")
        db.commit()
        
        return {"finished": False, "question": next_q}

    def get_interview(self, db: Session, interview_id: int) -> Interview:
        return db.query(Interview).filter(Interview.id == interview_id).first()


interview_service = InterviewService()
