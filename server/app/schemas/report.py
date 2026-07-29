from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ReportResponse(BaseModel):
    id: int
    interview_id: int
    user_id: int
    overall_score: float
    technical_accuracy: Optional[float] = None
    communication_score: Optional[float] = None
    strengths: Optional[List[str]] = None
    improvements: Optional[List[str]] = None
    detailed_feedback: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
