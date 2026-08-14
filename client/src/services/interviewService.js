import { apiClient } from "./apiClient";

const defaultMockInterviews = [
  {
    id: "int_101",
    role: "Senior Full Stack Engineer",
    type: "Technical & Architecture",
    level: "Senior",
    date: "2026-07-28",
    time: "14:30",
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
    time: "10:15",
    score: 92,
    status: "Completed",
    questions_count: 4,
  },
  {
    id: "int_104",
    role: "DevOps Engineer",
    type: "Infrastructure & CI/CD",
    level: "Senior",
    date: "2026-07-22",
    time: "09:00",
    score: 0,
    status: "Aborted",
    questions_count: 2,
  },
  {
    id: "int_103",
    role: "Backend Python Developer",
    type: "FastAPI & Microservices",
    level: "Senior",
    date: "2026-07-20",
    time: "16:45",
    score: 79,
    status: "Completed",
    questions_count: 5,
  },
];

const loadMockInterviews = () => {
  try {
    const stored = localStorage.getItem("mock_interviews_list");
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Error reading localStorage", e);
  }
  localStorage.setItem("mock_interviews_list", JSON.stringify(defaultMockInterviews));
  return defaultMockInterviews;
};

export let mockInterviewsList = loadMockInterviews();

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

  async startInterview(interviewId) {
    try {
      return await apiClient.post(`/interviews/${interviewId}/start`);
    } catch {
      return {
        started_at: new Date().toISOString(),
        question: {
          id: 1,
          type: "behavioral",
          text: "Welcome! Can you describe a challenging technical project you built recently?",
        }
      };
    }
  },

  async submitAnswer(interviewId, questionId, answerText, isCode = false, language = null, forceFinish = false) {
    try {
      return await apiClient.post(`/interviews/${interviewId}/answers`, {
        question_id: questionId,
        answer: answerText,
        is_code: isCode,
        language: language,
        force_finish: forceFinish
      });
    } catch {
      return {
        finished: forceFinish,
        question: forceFinish ? null : {
          id: questionId + 1,
          type: "technical",
          text: "How do you optimize a web application when performance degrades due to heavy data loading?",
        }
      };
    }
  },

  async getReport(interviewId) {
    try {
      if (!interviewId || interviewId === "int_demo") {
        throw new Error("Demo interview, skipping API call");
      }
      return await apiClient.get(`/reports/${interviewId}`);
    } catch {
      if (interviewId === "int_104") {
        return {
          interview_id: interviewId,
          role: "DevOps Engineer",
          overall_score: 0,
          hire_recommendation: "Not Evaluated",
          completed_at: "2026-07-22 09:00",
          status: "Aborted",
          scores: {
            technical_accuracy: 0,
            structural_clarity: 0,
            communication_delivery: 0,
            eye_contact_confidence: 0,
          },
          strengths: [],
          improvements: ["Interview was aborted before completion."],
          questions_feedback: [
            {
              question: "Can you explain your approach to setting up a CI/CD pipeline from scratch?",
              answer: "I usually start by identifying the critical paths...",
              score: 0,
              feedback: "Response incomplete due to aborted session.",
              ideal_answer: "Focus on version control, automated testing, security scanning, and deployment strategies.",
            }
          ],
        };
      }
      return {
        interview_id: interviewId || "int_demo",
        role: "Senior Full Stack Engineer",
        overall_score: 89,
        hire_recommendation: "Strong Hire",
        completed_at: new Date().toLocaleDateString(),
        status: "Completed",
        scores: {
          technical_accuracy: 90,
          structural_clarity: 85,
          communication_delivery: 87,
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
            score: 93,
            metrics: { technical_accuracy: 95, communication_delivery: 90 },
            feedback: "Excellent concise overview with concrete metrics and clear technology rationale.",
            ideal_answer: "A perfect answer highlights problem context, technical constraints, specific architecture choices (like FastAPI/Docker), and quantifiable outcomes (e.g., 45% latency reduction).",
          },
          {
            question: "How do you optimize a web application when performance degrades due to heavy data loading?",
            answer: "I utilize virtualization for large lists, code splitting with React lazy loading, and implement browser HTTP caching with stale-while-revalidate strategy.",
            score: 87,
            metrics: { technical_accuracy: 90, communication_delivery: 82 },
            feedback: "Strong technical strategies covering both frontend UI rendering and network layer optimizations.",
            ideal_answer: "Combine frontend strategies (lazy loading, virtual scroll) with backend improvements (database indexing, pagination, CDN edge caching) for a holistic optimization approach.",
          },
          {
            question: "Tell me about a situation where you had a technical disagreement with a team member.",
            answer: "We disagreed on REST vs GraphQL for our mobile client. I set up a quick benchmark proof-of-concept to evaluate payload sizes and developer velocity objectively.",
            score: 87,
            metrics: { technical_accuracy: 85, communication_delivery: 90 },
            feedback: "Great data-driven approach to resolving team technical debates without conflict.",
            ideal_answer: "Highlight active listening, objective benchmarking, aligning with project goals, and fostering a collaborative team culture rather than just technical correctness.",
          },
        ],
      };
    }
  },

  async deleteReport(interviewId) {
    try {
      if (interviewId && interviewId !== "int_demo") {
        await apiClient.delete(`/reports/${interviewId}`);
      }
      return true;
    } catch {
      // Mock delete
      mockInterviewsList = mockInterviewsList.filter(r => r.id !== interviewId);
      localStorage.setItem("mock_interviews_list", JSON.stringify(mockInterviewsList));
      return true;
    }
  },
};
