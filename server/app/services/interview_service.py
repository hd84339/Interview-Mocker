from sqlalchemy.orm import Session
from app.models.interview import Interview
from app.schemas.interview import InterviewCreate
from app.services.ai_service import ai_service


class InterviewService:
    async def create_interview(self, db: Session, user_id: int, interview_in: InterviewCreate) -> Interview:
        questions = await ai_service.generate_interview_questions(
            role_title=interview_in.role_title,
            experience_level=interview_in.experience_level
        )
        db_interview = Interview(
            user_id=user_id,
            role_title=interview_in.role_title,
            experience_level=interview_in.experience_level,
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
