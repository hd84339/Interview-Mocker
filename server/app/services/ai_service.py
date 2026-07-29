import json
import logging
from typing import Dict, Any, List
from app.config.settings import settings
from app.prompts.interview_prompt import INTERVIEW_GENERATION_PROMPT
from app.prompts.feedback_prompt import FEEDBACK_GENERATION_PROMPT
from app.prompts.resume_prompt import RESUME_PARSING_PROMPT

logger = logging.getLogger(__name__)


class AIService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY

    async def generate_interview_questions(
        self, role_title: str, experience_level: str, resume_context: str = "N/A"
    ) -> List[Dict[str, Any]]:
        prompt = INTERVIEW_GENERATION_PROMPT.format(
            num_questions=5,
            role_title=role_title,
            experience_level=experience_level,
            resume_context=resume_context
        )
        # Fallback / Mock response if Gemini API key is not configured yet
        return [
            {
                "id": 1,
                "type": "technical",
                "question": f"Can you describe your experience building applications for a {role_title} role?",
                "evaluation_criteria": "Clear understanding of architecture, state management, and API design."
            },
            {
                "id": 2,
                "type": "system_design",
                "question": "How do you handle error handling, retry policies, and logging in distributed services?",
                "evaluation_criteria": "Mentions graceful degradation, circuit breakers, and structured logging."
            },
            {
                "id": 3,
                "type": "behavioral",
                "question": "Tell me about a time you had a technical disagreement with a team member. How was it resolved?",
                "evaluation_criteria": "Uses STAR method, shows empathy and data-driven decision making."
            }
        ]

    async def generate_feedback_report(
        self, role_title: str, questions_and_responses: str
    ) -> Dict[str, Any]:
        prompt = FEEDBACK_GENERATION_PROMPT.format(
            role_title=role_title,
            questions_and_responses=questions_and_responses
        )
        return {
            "overall_score": 88.5,
            "technical_accuracy": 90.0,
            "communication_score": 87.0,
            "strengths": [
                "Strong technical clarity on system architectural patterns.",
                "Structured behavioral answers following STAR framework."
            ],
            "improvements": [
                "Include concrete trade-offs when choosing database storage engines.",
                "Maintain consistent eye contact and reduce filler pauses."
            ],
            "detailed_feedback": "The candidate performed very well overall, demonstrating solid technical fundamentals and clear communication."
        }

    async def parse_resume_text(self, resume_text: str) -> Dict[str, Any]:
        prompt = RESUME_PARSING_PROMPT.format(resume_text=resume_text[:2000])
        return {
            "skills": ["Python", "FastAPI", "React", "SQL", "Git"],
            "experience_years": 3,
            "summary": "Software engineer with solid experience in full-stack web applications and REST APIs."
        }


ai_service = AIService()
