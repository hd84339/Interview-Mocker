from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Union
from app.database.connection import get_db
from app.schemas.report import ReportResponse
from app.services.report_service import report_service
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.models.report import Report

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.post("/generate/{interview_id}")
async def generate_report(
    interview_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        int_id = int(interview_id.replace("int_", ""))
    except ValueError:
        int_id = 1

    try:
        return await report_service.generate_report_for_interview(
            db, user_id=current_user.id, interview_id=int_id
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/{report_id}")
def get_report(
    report_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        r_id = int(report_id.replace("int_", "").replace("rep_", ""))
    except ValueError:
        r_id = 0

    report = db.query(Report).filter(Report.id == r_id, Report.user_id == current_user.id).first()
    if not report:
        # Fallback to returning recent user report if available
        report = db.query(Report).filter(Report.user_id == current_user.id).order_by(Report.created_at.desc()).first()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report
