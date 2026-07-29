INTERVIEW_GENERATION_PROMPT = """
You are an expert technical and behavioral interviewer at a top tech company.
Generate {num_questions} interview questions for a candidate applying for the role of '{role_title}' at experience level '{experience_level}'.

Candidate Resume Details:
{resume_context}

Return a valid JSON array of objects with the following schema:
[
  {{
    "id": 1,
    "type": "technical" | "behavioral" | "system_design",
    "question": "The question string",
    "evaluation_criteria": "Key points expected in a strong answer"
  }}
]
"""
