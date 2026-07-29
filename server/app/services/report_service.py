from sqlalchemy.orm import Session
from app.models.report import Report
from app.models.interview import Interview
from app.services.ai_service import ai_service


class ReportService:
    async def generate_report_for_interview(
        self, db: Session, user_id: int, interview_id: int
    ) -> Report:
        interview = db.query(Interview).filter(Interview.id == interview_id).first()
        if not interview:
            raise ValueError("Interview session not found.")

        ai_report = await ai_service.generate_feedback_report(
            role_title=interview.role_title,
            questions_and_responses=str(interview.responses)
        )

        report = Report(
            interview_id=interview.id,
            user_id=user_id,
            overall_score=ai_report.get("overall_score", 85.0),
            technical_accuracy=ai_report.get("technical_accuracy", 85.0),
            communication_score=ai_report.get("communication_score", 85.0),
            strengths=ai_report.get("strengths", []),
            improvements=ai_report.get("improvements", []),
            detailed_feedback=ai_report.get("detailed_feedback", "")
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        return report


report_service = ReportService()
