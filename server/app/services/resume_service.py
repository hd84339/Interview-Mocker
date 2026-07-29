import os
from sqlalchemy.orm import Session
from app.models.resume import Resume
from app.services.ai_service import ai_service


class ResumeService:
    async def process_resume_file(
        self, db: Session, user_id: int, file_name: str, file_path: str
    ) -> Resume:
        parsed_data = await ai_service.parse_resume_text(f"Sample parsed content for {file_name}")
        db_resume = Resume(
            user_id=user_id,
            file_name=file_name,
            file_path=file_path,
            parsed_skills=parsed_data.get("skills", []),
            parsed_summary=parsed_data.get("summary", "")
        )
        db.add(db_resume)
        db.commit()
        db.refresh(db_resume)
        return db_resume


resume_service = ResumeService()
