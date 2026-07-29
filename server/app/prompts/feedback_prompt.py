FEEDBACK_GENERATION_PROMPT = """
You are a senior tech hiring manager evaluating a candidate's mock interview performance for the role of '{role_title}'.

Questions & Candidate Responses:
{questions_and_responses}

Analyze the responses and return a valid JSON object with the following schema:
{{
  "overall_score": 85.0,
  "technical_accuracy": 88.0,
  "communication_score": 82.0,
  "strengths": [
    "Clear explanation of core concepts",
    "Good use of STAR framework in behavioral question"
  ],
  "improvements": [
    "Elaborate more on trade-offs and edge cases",
    "Reduce filler words during technical explanations"
  ],
  "detailed_feedback": "Detailed paragraph providing actionable coaching feedback..."
}}
"""
