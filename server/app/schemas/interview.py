from pydantic import BaseModel
from typing import Optional, List, Any, Dict
from datetime import datetime


class InterviewCreate(BaseModel):
    role_title: str
    job_description: Optional[str] = None
    company_name: Optional[str] = "Tech Company"
    experience_level: str = "Mid-Level"
    difficulty: str = "Medium"  # Easy, Medium, Hard, FAANG
    resume_id: Optional[int] = None
    duration: int = 30  # Duration in minutes


class InterviewResponse(BaseModel):
    id: int
    user_id: int
    role_title: str
    job_description: Optional[str] = None
    company_name: Optional[str] = None
    experience_level: str
    difficulty: Optional[str] = None
    resume_id: Optional[int] = None
    duration: int
    status: str
    questions: Optional[List[Dict[str, Any]]] = None
    started_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True




class AnswerSubmit(BaseModel):
    question_id: int
    answer: str
