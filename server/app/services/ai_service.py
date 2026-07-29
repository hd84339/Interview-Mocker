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
        self,
        role_title: str,
        experience_level: str = "Mid-Level",
        company_name: str = "Tech Company",
        difficulty: str = "Medium",
        job_description: str = "General software engineering responsibilities",
        resume_context: str = "N/A"
    ) -> List[Dict[str, Any]]:
        prompt = INTERVIEW_GENERATION_PROMPT.format(
            num_questions=5,
            role_title=role_title,
            company_name=company_name,
            experience_level=experience_level,
            difficulty=difficulty,
            job_description=job_description or "General software engineering requirements.",
            resume_context=resume_context or "N/A"
        )
        # Fallback / Default generated response structure
        return [
            {
                "id": 1,
                "type": "technical",
                "question": f"At {company_name}, how would you approach building scalable endpoints for a {role_title} role at {difficulty} difficulty?",
                "evaluation_criteria": "Clear understanding of architecture, API optimization, and error handling."
            },
            {
                "id": 2,
                "type": "system_design",
                "question": f"Given the requirements in '{role_title}', design a high-throughput caching and database strategy.",
                "evaluation_criteria": "Evaluates data partitioning, latency trade-offs, and cache invalidation policies."
            },
            {
                "id": 3,
                "type": "behavioral",
                "question": f"Tell me about a complex project from your experience that aligns with this {company_name} position.",
                "evaluation_criteria": "Demonstrates leadership, structured problem solving, and impactful delivery."
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
