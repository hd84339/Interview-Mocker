from .auth import router as auth_router
from .interview import router as interview_router
from .resume import router as resume_router
from .report import router as report_router
from .camera import router as camera_router
from .admin import router as admin_router

__all__ = ["auth_router", "interview_router", "resume_router", "report_router", "camera_router", "admin_router"]

