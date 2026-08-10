import os
from sqlalchemy.orm import Session
from app.models.resume import Resume
from app.services.ai_service import ai_service
from app.services.rag_service import rag_service


class ResumeService:
    async def process_resume_file(
        self, db: Session, user_id: int, file_name: str, file_path: str
    ) -> Resume:
        existing_resumes = db.query(Resume).filter(
            Resume.user_id == user_id,
            Resume.is_active == True
        ).all()
        for resume in existing_resumes:
            resume.is_active = False

        parsed_data = await ai_service.parse_resume_text(f"Sample parsed content for {file_name}")
        db_resume = Resume(
            user_id=user_id,
            file_name=file_name,
            file_path=file_path,
            file_path=file_path,
            parsed_skills=parsed_data.get("skills", []),
            parsed_summary=parsed_data.get("summary", ""),
            is_active=True
        )
        db.add(db_resume)
        db.commit()
        db.refresh(db_resume)

        # Index raw resume text into RAG Vector Store (ChromaDB)
        resume_text_content = f"Skills: {', '.join(db_resume.parsed_skills)}. Summary: {db_resume.parsed_summary}"
        await rag_service.index_resume(user_id=user_id, resume_id=db_resume.id, text=resume_text_content)

        return db_resume

    def activate_resume(self, db: Session, user_id: int, resume_id: int) -> Resume:
        resume_to_activate = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == user_id).first()
        if not resume_to_activate:
            return None

        existing_resumes = db.query(Resume).filter(
            Resume.user_id == user_id,
            Resume.is_active == True
        ).all()
        for r in existing_resumes:
            r.is_active = False

        resume_to_activate.is_active = True
        db.commit()
        db.refresh(resume_to_activate)
        return resume_to_activate


resume_service = ResumeService()

