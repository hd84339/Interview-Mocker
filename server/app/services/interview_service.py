from sqlalchemy.orm import Session
from app.models.interview import Interview
from app.schemas.interview import InterviewCreate
from app.services.ai_service import ai_service
from app.services.rag_service import rag_service


class InterviewService:
    async def create_interview(self, db: Session, user_id: int, interview_in: InterviewCreate) -> Interview:
        db_interview = Interview(
            user_id=user_id,
            role_title=interview_in.role_title,
            job_description=interview_in.job_description,
            company_name=interview_in.company_name,
            experience_level=interview_in.experience_level,
            difficulty=interview_in.difficulty,
            resume_id=interview_in.resume_id,
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
        from datetime import datetime, timezone
        interview = self.get_interview(db, interview_id)
        if not interview:
            return None
        
        if not interview.started_at:
            interview.started_at = datetime.now(timezone.utc)
            interview.status = "in_progress"
            
            # Generate first question
            resume_context = "N/A"
            if interview.resume_id:
                query_str = f"{interview.role_title} {interview.job_description or ''}"
                resume_context = await rag_service.query_resume_context(
                    resume_id=interview.resume_id,
                    query_text=query_str
                )
                
            first_q = await ai_service.generate_next_question(
                history=[],
                role_title=interview.role_title,
                experience_level=interview.experience_level,
                company_name=interview.company_name,
                difficulty=interview.difficulty,
                job_description=interview.job_description,
                resume_context=resume_context,
                remaining_time_minutes=interview.duration
            )
            
            questions = list(interview.questions or [])
            questions.append(first_q)
            interview.questions = questions
            db.commit()
            
        return {"started_at": interview.started_at.isoformat(), "question": interview.questions[-1] if interview.questions else None}

    async def process_answer(self, db: Session, interview_id: int, answer_data: dict) -> dict:
        from datetime import datetime, timezone
        interview = self.get_interview(db, interview_id)
        if not interview:
            return None
            
        now = datetime.now(timezone.utc)
        elapsed_seconds = (now - interview.started_at).total_seconds() if interview.started_at else 0
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
        
        if remaining_minutes <= 0 or answer_data.get("force_finish"):
            interview.status = "completed"
            interview.completed_at = now
            db.commit()
            return {"finished": True}
            
        # Generate next question
        history = [{"q": q, "a": a} for q, a in zip(interview.questions, responses)]
        next_q = await ai_service.generate_next_question(
            history=history,
            role_title=interview.role_title,
            experience_level=interview.experience_level,
            company_name=interview.company_name,
            difficulty=interview.difficulty,
            job_description=interview.job_description,
            resume_context="N/A",  # could refetch if needed
            remaining_time_minutes=remaining_minutes
        )
        
        questions = list(interview.questions or [])
        questions.append(next_q)
        interview.questions = questions
        db.commit()
        
        return {"finished": False, "question": next_q}



    def get_interview(self, db: Session, interview_id: int) -> Interview:
        return db.query(Interview).filter(Interview.id == interview_id).first()


interview_service = InterviewService()
