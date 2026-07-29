RESUME_PARSING_PROMPT = """
Analyze the following resume text and extract key technical skills, experience highlights, and a concise candidate summary.

Resume Text:
{resume_text}

Return a valid JSON object with the following schema:
{{
  "skills": ["Python", "FastAPI", "React", "Docker", "AWS"],
  "experience_years": 4,
  "summary": "Brief 2-3 sentence overview of candidate background and strengths..."
}}
"""
