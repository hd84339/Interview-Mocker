from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.schemas.interview import InterviewCreate, InterviewResponse, AnswerSubmit
from app.services.interview_service import interview_service
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.models.interview import Interview

router = APIRouter(prefix="/interviews", tags=["Interviews"])


@router.post("/", response_model=InterviewResponse)
async def create_interview(
    interview_in: InterviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await interview_service.create_interview(db, user_id=current_user.id, interview_in=interview_in)


@router.get("/{interview_id}", response_model=InterviewResponse)
def get_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    interview = interview_service.get_interview(db, interview_id=interview_id)
    if not interview or interview.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Interview not found")
    return interview


@router.post("/{interview_id}/answer")
def submit_answer(
    interview_id: int,
    answer_in: AnswerSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    interview = interview_service.get_interview(db, interview_id=interview_id)
    if not interview or interview.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Interview not found")

    responses = list(interview.responses or [])
    responses.append({"question_id": answer_in.question_id, "answer": answer_in.answer})
    interview.responses = responses
    db.commit()
    return {"message": "Answer recorded successfully"}
