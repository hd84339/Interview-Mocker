import { apiClient } from "./apiClient";

export const mockInterviewsList = [
  {
    id: "int_101",
    role: "Senior Full Stack Engineer",
    type: "Technical & Architecture",
    level: "Senior",
    date: "2026-07-28",
    score: 88,
    status: "Completed",
    questions_count: 5,
  },
  {
    id: "int_102",
    role: "Frontend Engineer",
    type: "React & UI Architecture",
    level: "Mid",
    date: "2026-07-25",
    score: 92,
    status: "Completed",
    questions_count: 4,
  },
  {
    id: "int_103",
    role: "Backend Python Developer",
    type: "FastAPI & Microservices",
    level: "Senior",
    date: "2026-07-20",
    score: 79,
    status: "Completed",
    questions_count: 5,
  },
];

export const interviewService = {
  async getRecentInterviews() {
    try {
      return await apiClient.get("/interviews");
    } catch {
      return mockInterviewsList;
    }
  },

  async createInterview(data) {
    try {
      return await apiClient.post("/interviews", data);
    } catch (err) {
      console.warn("Backend API unavailable, creating local demo interview session:", err.message);
      return {
        id: "int_" + Math.random().toString(36).substr(2, 9),
        role: data.role || "Software Engineer",
        level: data.level || "Mid",
        type: data.type || "Technical",
        questions: [
          {
            id: "q1",
            text: `Welcome! Let's start with your background. Can you describe a challenging technical project you built as a ${data.role || "Software Engineer"} and the key architectural decisions you made?`,
            category: "Background & Technical",
          },
          {
            id: "q2",
            text: "How do you optimize a web application when performance degrades due to heavy data loading or rendering bottlenecks?",
            category: "Performance & Scaling",
          },
          {
            id: "q3",
            text: "Can you explain how you handle state management, asynchronous data flow, and error boundaries in modern applications?",
            category: "Architecture & Resilience",
          },
          {
            id: "q4",
            text: "Tell me about a situation where you had a strong technical disagreement with a team member. How did you resolve it?",
            category: "Behavioral & Collaboration",
          },
          {
            id: "q5",
            text: "Where do you see system design trade-offs most commonly occurring, e.g., consistency vs. availability or latency vs. throughput?",
            category: "System Design",
          },
        ],
        created_at: new Date().toISOString(),
      };
    }
  },

  async submitAnswer(interviewId, questionId, answerText) {
    try {
      return await apiClient.post(`/interviews/${interviewId}/answers`, {
        question_id: questionId,
        answer_text: answerText,
      });
    } catch {
      return {
        success: true,
        feedback: "Great structure and clarity in your response!",
        score: Math.floor(Math.random() * 20) + 80,
      };
    }
  },

  async getReport(interviewId) {
    try {
      return await apiClient.get(`/reports/${interviewId}`);
    } catch {
      return {
        interview_id: interviewId || "int_demo",
        role: "Senior Full Stack Engineer",
        overall_score: 88,
        hire_recommendation: "Strong Hire",
        completed_at: new Date().toLocaleDateString(),
        scores: {
          technical_accuracy: 90,
          structural_clarity: 85,
          communication_delivery: 88,
          eye_contact_confidence: 86,
        },
        strengths: [
          "Clear explanation of technical trade-offs and architecture choices.",
          "Good structural response format (STAR method).",
          "Maintained strong eye contact and confident delivery throughout.",
        ],
        improvements: [
          "Reduce minor filler words (e.g., 'um', 'you know') during initial response thought process.",
          "Elaborate more on specific quantitative metrics achieved in past projects.",
        ],
        questions_feedback: [
          {
            question: "Can you describe a challenging technical project you built and the key architectural decisions you made?",
            answer: "In my recent role, I led the migration of a monolithic API to microservices using FastAPI and Docker. We reduced p99 latency by 45%.",
            score: 92,
            feedback: "Excellent concise overview with concrete metrics and clear technology rationale.",
            ideal_answer: "Focus on problem context, technical constraints, choice of architecture, and measurable outcomes (performance, scale, team velocity).",
          },
          {
            question: "How do you optimize a web application when performance degrades due to heavy data loading?",
            answer: "I utilize virtualization for large lists, code splitting with React lazy loading, and implement browser HTTP caching with stale-while-revalidate strategy.",
            score: 87,
            feedback: "Strong technical strategies covering both frontend UI rendering and network layer optimizations.",
            ideal_answer: "Combine frontend strategies (lazy loading, virtual scroll) with backend improvements (database indexing, pagination, CDN edge caching).",
          },
          {
            question: "Tell me about a situation where you had a technical disagreement with a team member.",
            answer: "We disagreed on REST vs GraphQL for our mobile client. I set up a quick benchmark proof-of-concept to evaluate payload sizes and developer velocity objectively.",
            score: 85,
            feedback: "Great data-driven approach to resolving team technical debates without conflict.",
            ideal_answer: "Highlight active listening, objective benchmarking, aligning with project goals, and fostering a collaborative team culture.",
          },
        ],
      };
    }
  },
};
