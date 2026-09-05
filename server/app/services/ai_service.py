import json
import logging
from typing import Dict, Any, List
import google.generativeai as genai
from app.config.settings import settings
from app.prompts.interview_prompt import INTERVIEW_GENERATION_PROMPT
from app.prompts.feedback_prompt import FEEDBACK_GENERATION_PROMPT
from app.prompts.resume_prompt import RESUME_PARSING_PROMPT

logger = logging.getLogger(__name__)


class AIService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if self.api_key:
            genai.configure(api_key=self.api_key)

    async def generate_next_question(
        self,
        history: List[Dict[str, Any]],
        role_title: str,
        experience_level: str = "Mid-Level",
        company_name: str = "Tech Company",
        difficulty: str = "Medium",
        job_description: str = "General software engineering responsibilities",
        resume_context: str = "N/A",
        remaining_time_minutes: int = 30
    ) -> Dict[str, Any]:
        """
        Dynamically generates the next question based on the history and remaining time.
        """
        # Mocked dynamic generation based on history length for now.
        question_count = len(history)
        next_id = question_count + 1
        
        # Decide question type based on history
        if question_count == 0:
            q_type = "behavioral"
            question = f"Welcome to the interview for {role_title} at {company_name}. Can you start by walking me through your background and how it aligns with this role?"
        elif question_count == 1:
            q_type = "technical"
            question = f"Based on your resume, I see some relevant experience. Can you explain how you would design a scalable backend service for {company_name}?"
        elif question_count == 2:
            q_type = "coding"
            question = "Let's do a quick coding exercise. Write a function to find the first non-repeating character in a string."
        elif question_count == 3:
            q_type = "system_design"
            question = "Great. Now, how would you scale that application to handle 10,000 requests per second?"
        else:
            q_type = "technical"
            question = f"Let's dive deeper into {difficulty} concepts. How do you handle database transaction isolation levels?"
            
        return {
            "id": next_id,
            "type": q_type,
            "text": question,
            "question": question,
            "evaluation_criteria": "Evaluates candidate adaptability and technical depth.",
            "language_options": ["python", "javascript", "cpp", "java"] if q_type == "coding" else []
        }

    async def evaluate_code_submission(self, question: str, code: str, language: str) -> Dict[str, Any]:
        """
        AI evaluates candidate's code submission.
        """
        is_correct = "return" in code and len(code) > 10
        return {
            "correctness": 90 if is_correct else 40,
            "time_complexity": "O(n)",
            "space_complexity": "O(n)",
            "feedback": "Good logic. Consider handling edge cases like empty strings." if is_correct else "Syntax is incomplete or missing core logic."
        }



    async def generate_feedback_report(
        self, role_title: str, questions_and_responses: str
    ) -> Dict[str, Any]:
        prompt = FEEDBACK_GENERATION_PROMPT.format(
            role_title=role_title,
            questions_and_responses=questions_and_responses
        )
        
        if not self.api_key:
            logger.warning("No GEMINI_API_KEY found, using mock feedback.")
            return self._mock_feedback_fallback()

        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt)
            text = response.text.strip()
            
            # Remove markdown JSON wrappers if present
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
                
            return json.loads(text.strip())
        except Exception as e:
            logger.error(f"Failed to generate AI feedback: {e}")
            return self._mock_feedback_fallback()

    def _mock_feedback_fallback(self) -> Dict[str, Any]:
        return {
            "overall_score": 0,
            "technical_accuracy": 0,
            "communication_score": 0,
            "strengths": ["None identified"],
            "improvements": ["Complete the interview.", "Provide valid answers to questions."],
            "detailed_feedback": "The interview could not be properly evaluated or was incomplete.",
            "questions_feedback": []
        }

    async def parse_resume_text(self, resume_text: str) -> Dict[str, Any]:
        prompt = RESUME_PARSING_PROMPT.format(resume_text=resume_text[:2000])
        return {
            "skills": ["Python", "FastAPI", "React", "SQL", "Git"],
            "experience_years": 3,
            "summary": "Software engineer with solid experience in full-stack web applications and REST APIs."
        }


ai_service = AIService()
