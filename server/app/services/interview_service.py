from sqlalchemy.orm import Session
from app.models.interview import Interview
from app.schemas.interview import InterviewCreate
from app.services.ai_service import ai_service
from app.services.rag_service import rag_service


class InterviewService:
    async def create_interview(self, db: Session, user_id: int, interview_in: InterviewCreate) -> Interview:
        resume_context = "N/A"
        if interview_in.resume_id:
            query_str = f"{interview_in.role_title} {interview_in.job_description or ''}"
            resume_context = await rag_service.query_resume_context(
                resume_id=interview_in.resume_id,
                query_text=query_str
            )

        questions = await ai_service.generate_interview_questions(
            role_title=interview_in.role_title,
            job_description=interview_in.job_description or "General responsibilities",
            company_name=interview_in.company_name or "Tech Company",
            experience_level=interview_in.experience_level,
            difficulty=interview_in.difficulty,
            resume_context=resume_context
        )

        db_interview = Interview(
            user_id=user_id,
            role_title=interview_in.role_title,
            job_description=interview_in.job_description,
            company_name=interview_in.company_name,
            experience_level=interview_in.experience_level,
            difficulty=interview_in.difficulty,
            resume_id=interview_in.resume_id,
            status="pending",
            questions=questions,
            responses=[]
        )
        db.add(db_interview)
        db.commit()
        db.refresh(db_interview)
        return db_interview


    def get_interview(self, db: Session, interview_id: int) -> Interview:
        return db.query(Interview).filter(Interview.id == interview_id).first()


interview_service = InterviewService()
