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
      return await apiClient.post("/interviews", {
        ...data,
        resume_id: data.resume_id || data.resumeId,
        skills: data.skills || []
      });
    } catch (err) {
      console.warn("Backend API unavailable, creating local demo interview session:", err.message);
      
      const skills = data.skills && data.skills.length > 0 
        ? data.skills 
        : (data.role?.toLowerCase().includes("react") || data.role?.toLowerCase().includes("frontend")
            ? ["React", "TypeScript", "State Management", "Next.js", "Tailwind CSS"]
            : ["Full Stack Architecture", "REST APIs", "PostgreSQL", "Docker", "System Design"]);
      
      const s1 = skills[0] || "Software Engineering";
      const s2 = skills[1] || s1;
      const s3 = skills[2] || s1;
      const s4 = skills[3] || s2;

      return {
        id: "int_" + Math.random().toString(36).substr(2, 9),
        role: data.role || "Software Engineer",
        level: data.level || "Mid",
        type: data.type || "Technical",
        duration: data.duration || 30,
        skills: skills,
        questions: [
          {
            id: 1,
            type: "technical",
            category: `${s1} Architecture`,
            text: `Welcome! Let's start with your technical background. Can you describe a production system you engineered using ${s1}, the key architectural patterns you selected, and how you evaluated the trade-offs?`,
            question: `Welcome! Let's start with your technical background. Can you describe a production system you engineered using ${s1}, the key architectural patterns you selected, and how you evaluated the trade-offs?`,
          },
          {
            id: 2,
            type: "technical",
            category: `${s2} Optimization & Mechanics`,
            text: `Focusing on ${s2}, how do you diagnose and resolve performance degradation, memory leaks, or concurrency race conditions under heavy production traffic?`,
            question: `Focusing on ${s2}, how do you diagnose and resolve performance degradation, memory leaks, or concurrency race conditions under heavy production traffic?`,
          },
          {
            id: 3,
            type: "coding",
            category: `${s1} Live Implementation`,
            text: `Let's work through a practical implementation challenge in ${s1}. How would you implement an asynchronous job processor or rate limiter with retry logic and backoff?`,
            question: `Let's work through a practical implementation challenge in ${s1}. How would you implement an asynchronous job processor or rate limiter with retry logic and backoff?`,
          },
          {
            id: 4,
            type: "system_design",
            category: `${s3} Scalability & Design`,
            text: `For system design: How would you architect a distributed, fault-tolerant service using ${s2} and ${s3} to handle high throughput with strict data consistency?`,
            question: `For system design: How would you architect a distributed, fault-tolerant service using ${s2} and ${s3} to handle high throughput with strict data consistency?`,
          },
          {
            id: 5,
            type: "technical",
            category: `${s4} Resilience & Security`,
            text: `In a mission-critical deployment leveraging ${s1} and ${s4}, what are the top security vulnerabilities and failure modes you protect against, and how do you ensure zero-downtime releases?`,
            question: `In a mission-critical deployment leveraging ${s1} and ${s4}, what are the top security vulnerabilities and failure modes you protect against, and how do you ensure zero-downtime releases?`,
          },
        ],
        created_at: new Date().toISOString(),
      };
    }
  },

  async startInterview(interviewId) {
    try {
      const res = await apiClient.post(`/interviews/${interviewId}/start`);
      if (res && res.question) return res;
    } catch (e) {
      console.warn("Backend start interview unavailable, using session questions:", e.message);
    }
    
    // Fallback: Read session stored from createInterview
    try {
      const stored = sessionStorage.getItem("active_interview_session");
      if (stored) {
        const s = JSON.parse(stored);
        if (s.questions && s.questions.length > 0) {
          const firstQ = s.questions[0];
          return {
            started_at: new Date().toISOString(),
            question: {
              id: 1,
              type: firstQ.type || "technical",
              category: firstQ.category || "Role & Skills Overview",
              text: firstQ.text || firstQ.question,
              question: firstQ.text || firstQ.question
            }
          };
        }
      }
    } catch {}

    return {
      started_at: new Date().toISOString(),
      question: {
        id: 1,
        type: "technical",
        category: "Technical Overview",
        text: "Welcome! To begin, can you walk me through a complex technical project you engineered and the core architectural decisions you made?",
        question: "Welcome! To begin, can you walk me through a complex technical project you engineered and the core architectural decisions you made?"
      }
    };
  },

  async submitAnswer(interviewId, questionId, answerText, isCode = false, language = null, forceFinish = false) {
    let apiRes = null;
    let apiSuccess = false;
    try {
      apiRes = await apiClient.post(`/interviews/${interviewId}/answers`, {
        question_id: questionId,
        answer: answerText,
        is_code: isCode,
        language: language,
        force_finish: forceFinish
      });
      if (apiRes && (apiRes.question || apiRes.finished)) {
        apiSuccess = true;
      }
    } catch (err) {
      console.warn("Backend submit answer unavailable or errored:", err.message);
    }

    if (apiSuccess) {
      return apiRes;
    }

    if (forceFinish) {
      return { finished: true, question: null };
    }

    // Fallback: Never repeat, dynamically progress through skill-tailored questions
    let session = null;
    try {
      const stored = sessionStorage.getItem("active_interview_session");
      session = stored ? JSON.parse(stored) : null;
    } catch {}

    const skills = session?.skills && session.skills.length > 0 
      ? session.skills 
      : ["JavaScript", "React", "Node.js", "PostgreSQL", "Docker"];
    
    const currId = typeof questionId === "number" ? questionId : parseInt(questionId, 10) || 1;
    const nextIndex = currId; // e.g. question 1 completed -> index 1 is question 2

    if (session?.questions && session.questions[nextIndex]) {
      const qObj = session.questions[nextIndex];
      return {
        finished: false,
        question: {
          id: currId + 1,
          type: qObj.type || "technical",
          category: qObj.category || `${skills[nextIndex % skills.length]} Focus`,
          text: qObj.text || qObj.question,
          question: qObj.text || qObj.question
        }
      };
    }

    // If past predefined list, generate a fresh unique question for remaining skills
    const nextSkill = skills[nextIndex % skills.length];
    const qType = nextIndex % 3 === 2 ? "coding" : nextIndex % 3 === 0 ? "system_design" : "technical";
    const freshQuestionText = `In your experience with ${nextSkill}, how do you architect distributed error boundaries, data consistency, and observability under peak concurrency? (Question ${currId + 1})`;

    return {
      finished: false,
      question: {
        id: currId + 1,
        type: qType,
        category: `${nextSkill} Deep Dive`,
        text: freshQuestionText,
        question: freshQuestionText
      }
    };
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
