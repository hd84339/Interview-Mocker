from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from app.services.camera_service import camera_service
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/camera", tags=["Camera Attention Telemetry"])


class FrameAnalysisRequest(BaseModel):
    gaze_x: float = Field(..., description="Normalized screen X offset (-1.0 to 1.0)")
    gaze_y: float = Field(..., description="Normalized screen Y offset (-1.0 to 1.0)")
    pitch: float = Field(0.0, description="Head pitch angle in degrees")
    yaw: float = Field(0.0, description="Head yaw angle in degrees")
    roll: float = Field(0.0, description="Head roll angle in degrees")


class FrameAnalysisResponse(BaseModel):
    is_looking_at_camera: bool
    attention_score: float
    gaze_coordinates: Dict[str, float]
    head_pose: Dict[str, float]
    feedback: List[str]


class SessionSummaryRequest(BaseModel):
    frames: List[FrameAnalysisRequest]


@router.post("/analyze-frame", response_model=FrameAnalysisResponse)
def analyze_frame(
    request: FrameAnalysisRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Evaluates real-time camera gaze telemetry for interview attention tracking.
    """
    return camera_service.analyze_frame(
        gaze_x=request.gaze_x,
        gaze_y=request.gaze_y,
        pitch=request.pitch,
        yaw=request.yaw,
        roll=request.roll
    )


@router.post("/summarize-session")
def summarize_session(
    request: SessionSummaryRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Provides aggregated engagement and eye-contact percentage metrics for an interview session.
    """
    evaluations = [
        camera_service.analyze_frame(
            gaze_x=f.gaze_x,
            gaze_y=f.gaze_y,
            pitch=f.pitch,
            yaw=f.yaw,
            roll=f.roll
        )
        for f in request.frames
    ]
    return camera_service.summarize_session_attention(evaluations)
