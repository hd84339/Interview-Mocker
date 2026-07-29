from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from app.database.base import Base


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role_title = Column(String, nullable=False)
    job_description = Column(Text, nullable=True)
    company_name = Column(String, default="Tech Company")
    experience_level = Column(String, default="Mid-Level")
    difficulty = Column(String, default="Medium")
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=True)
    status = Column(String, default="pending")  # pending, in_progress, completed
    questions = Column(JSON, nullable=True)  # Store generated questions list
    responses = Column(JSON, nullable=True)  # Store candidate answers
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

