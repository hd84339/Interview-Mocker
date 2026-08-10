import os
from sqlalchemy.orm import Session
from app.models.resume import Resume
from app.services.ai_service import ai_service
from app.services.rag_service import rag_service


class ResumeService:
    async def process_resume_file(
        self, db: Session, user_id: int, file_name: str, file_path: str
    ) -> Resume:
        # Delete old resumes for this user
        old_resumes = db.query(Resume).filter(Resume.user_id == user_id).all()
        for r in old_resumes:
            if os.path.exists(r.file_path):
                try:
                    os.remove(r.file_path)
                except Exception:
                    pass
            db.delete(r)
        db.commit()

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

        # Index raw resume text into RAG Vector Store (ChromaDB)
        resume_text_content = f"Skills: {', '.join(db_resume.parsed_skills)}. Summary: {db_resume.parsed_summary}"
        await rag_service.index_resume(user_id=user_id, resume_id=db_resume.id, text=resume_text_content)

        return db_resume

    def get_latest_resume(self, db: Session, user_id: int) -> Resume | None:
        return db.query(Resume).filter(Resume.user_id == user_id).order_by(Resume.created_at.desc()).first()

resume_service = ResumeService()

