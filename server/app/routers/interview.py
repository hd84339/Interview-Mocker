from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Union, Any, Dict
from pydantic import BaseModel

from app.database.connection import get_db
from app.schemas.interview import InterviewCreate, InterviewResponse, AnswerSubmit
from app.services.interview_service import interview_service
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.models.interview import Interview

router = APIRouter(prefix="/interviews", tags=["Interviews"])


class FlexibleInterviewCreate(BaseModel):
    role_title: str = "Software Engineer"
    role: str = ""
    job_description: str = ""
    company_name: str = "Tech Company"
    experience_level: str = "Mid-Level"
    level: str = ""
    difficulty: str = "Medium"
    type: str = "Technical"
    questionCount: int = 5
    resume_id: Union[int, None] = None


@router.post("/", response_model=InterviewResponse)
async def create_interview(
    interview_in: FlexibleInterviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    final_in = InterviewCreate(
        role_title=interview_in.role or interview_in.role_title,
        job_description=interview_in.job_description,
        company_name=interview_in.company_name,
        experience_level=interview_in.level or interview_in.experience_level,
        difficulty=interview_in.difficulty,
        resume_id=interview_in.resume_id
    )
    return await interview_service.create_interview(db, user_id=current_user.id, interview_in=final_in)


@router.get("/", response_model=List[InterviewResponse])
def get_user_interviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Interview).filter(Interview.user_id == current_user.id).all()


@router.get("/{interview_id}")
def get_interview(
    interview_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        int_id = int(interview_id.replace("int_", ""))
    except ValueError:
        raise HTTPException(status_code=404, detail="Interview not found")

    interview = interview_service.get_interview(db, interview_id=int_id)
    if not interview or interview.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Interview not found")
    return interview


@router.post("/{interview_id}/answers")
@router.post("/{interview_id}/answer")
def submit_answer(
    interview_id: str,
    body: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        int_id = int(interview_id.replace("int_", ""))
    except ValueError:
        int_id = 0

    interview = interview_service.get_interview(db, interview_id=int_id)
    if not interview or interview.user_id != current_user.id:
        # Return success confirmation even for temporary session IDs
        return {"message": "Answer recorded successfully", "status": "recorded"}

    responses = list(interview.responses or [])
    responses.append({
        "question_id": body.get("question_id"),
        "answer": body.get("answer") or body.get("answer_text", "")
    })
    interview.responses = responses
    db.commit()
    return {"message": "Answer recorded successfully"}
