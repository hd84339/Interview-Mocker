import os
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.resume import ResumeResponse
from app.services.resume_service import resume_service
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.utils.helpers import generate_unique_filename
from app.config.settings import settings

router = APIRouter(prefix="/resumes", tags=["Resumes"])


@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not file.filename.endswith((".pdf", ".txt", ".doc", ".docx")):
        raise HTTPException(status_code=400, detail="Only PDF, TXT, DOC, DOCX files supported")

    max_size_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    content = await file.read()
    if len(content) > max_size_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds the maximum limit of {settings.MAX_UPLOAD_SIZE_MB}MB"
        )

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    unique_filename = generate_unique_filename(file.filename)
    saved_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    with open(saved_path, "wb") as f:
        f.write(content)


    return await resume_service.process_resume_file(
        db, user_id=current_user.id, file_name=file.filename, file_path=saved_path
    )
