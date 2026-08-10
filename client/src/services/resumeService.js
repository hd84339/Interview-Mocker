import { apiClient } from "./apiClient";

export const resumeService = {
  async uploadResume(file) {
    // Client-side file size check (10 MB limit)
    const MAX_MB = 10;
    if (file.size > MAX_MB * 1024 * 1024) {
      throw new Error(`File size exceeds maximum limit of ${MAX_MB}MB.`);
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      return await apiClient.post("/resumes/upload", formData);
    } catch (err) {
      console.warn("Backend API unavailable, using simulated resume extraction:", err.message);
      // Fallback mock response for smooth demo experience
      const mockResume = {
        id: "res_" + Math.random().toString(36).substr(2, 9),
        filename: file.name,
        parsed_summary: "Experienced Engineer proficient in React, Node.js, Python, and System Design.",
        skills: ["React", "JavaScript", "Python", "FastAPI", "REST APIs", "SQL", "Git"],
        status: "parsed",
      };
      localStorage.setItem("mockhora_demo_resume", JSON.stringify(mockResume));
      return mockResume;
    }
  },

  async getLatestResume() {
    try {
      return await apiClient.get("/resumes/latest");
    } catch (err) {
      if (err.message === "Demo token, skipping API call") {
        const stored = localStorage.getItem("mockhora_demo_resume");
        if (stored) {
          return JSON.parse(stored);
        }
      }
      return null;
    }
  },
};
