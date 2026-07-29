import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)


class CameraService:
    """
    Service responsible for analyzing candidate video frames,
    eye gaze orientation, head pose, and attention score during AI interviews.
    """

    def analyze_frame(
        self,
        gaze_x: float,
        gaze_y: float,
        pitch: float = 0.0,
        yaw: float = 0.0,
        roll: float = 0.0,
        blink_rate: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Evaluate real-time gaze coordinates and head pose values.
        - gaze_x, gaze_y: normalized screen relative coordinates (-1.0 to 1.0)
        - pitch, yaw, roll: head orientation angles in degrees
        """
        # Threshold bounds for eye contact with the camera/screen center
        is_looking_at_camera = abs(gaze_x) <= 0.35 and abs(gaze_y) <= 0.35 and abs(yaw) <= 20.0 and abs(pitch) <= 20.0

        # Calculate dynamic attention score (0 - 100%)
        gaze_distance = (gaze_x ** 2 + gaze_y ** 2) ** 0.5
        attention_score = max(0.0, min(100.0, round(100.0 - (gaze_distance * 70.0) - (abs(yaw) * 0.8), 2)))

        feedback = []
        if not is_looking_at_camera:
            if yaw > 20.0 or yaw < -20.0:
                feedback.append("Head turned away from camera center.")
            if gaze_y > 0.35:
                feedback.append("Looking downwards (reading off screen/notes).")
            elif gaze_y < -0.35:
                feedback.append("Looking upwards away from interviewer.")
        else:
            feedback.append("Direct eye contact maintained.")

        return {
            "is_looking_at_camera": is_looking_at_camera,
            "attention_score": attention_score,
            "gaze_coordinates": {"x": gaze_x, "y": gaze_y},
            "head_pose": {"pitch": pitch, "yaw": yaw, "roll": roll},
            "feedback": feedback
        }

    def summarize_session_attention(self, frame_evaluations: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Summarizes attention metrics over an entire interview session.
        """
        if not frame_evaluations:
            return {
                "overall_attention_score": 100.0,
                "eye_contact_percentage": 100.0,
                "summary": "No video telemetry frames recorded."
            }

        total_frames = len(frame_evaluations)
        camera_looking_count = sum(1 for f in frame_evaluations if f.get("is_looking_at_camera", True))
        avg_score = sum(f.get("attention_score", 100.0) for f in frame_evaluations) / total_frames

        eye_contact_pct = round((camera_looking_count / total_frames) * 100.0, 2)
        overall_score = round(avg_score, 2)

        return {
            "overall_attention_score": overall_score,
            "eye_contact_percentage": eye_contact_pct,
            "total_frames_analyzed": total_frames,
            "summary": (
                "Excellent candidate engagement with consistent eye contact."
                if eye_contact_pct >= 80.0
                else "Moderate eye contact observed. Encourage looking directly into the camera."
            )
        }


camera_service = CameraService()
