from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ResumeResponse(BaseModel):
    id: int
    user_id: int
    file_name: str
    parsed_skills: Optional[List[str]] = None
    parsed_summary: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
