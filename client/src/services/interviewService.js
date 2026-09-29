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
    } catch (err) {
      console.error("Failed to fetch report:", err);
      throw err;
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
