import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.database.connection import engine
from app.database.base import Base
from app.routers import auth_router, interview_router, resume_router, report_router, camera_router, admin_router

# Create database tables automatically on startup
Base.metadata.create_all(bind=engine)

# Ensure upload directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Mockhora AI Interview Platform API",
    debug=settings.DEBUG
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers under /api/v1
api_prefix = settings.API_V1_STR
app.include_router(auth_router, prefix=api_prefix)
app.include_router(interview_router, prefix=api_prefix)
app.include_router(resume_router, prefix=api_prefix)
app.include_router(report_router, prefix=api_prefix)
app.include_router(camera_router, prefix=api_prefix)
app.include_router(admin_router, prefix=api_prefix)



@app.get("/")
def home():
    return {
        "message": f"Welcome to {settings.APP_NAME} API 🚀",
        "docs": "/docs",
        "status": "online"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy", "app": settings.APP_NAME}