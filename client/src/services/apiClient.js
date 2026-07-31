// API Client wrapper for communicating with FastAPI backend (http://localhost:8000/api/v1)

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

class ApiClient {
  constructor() {
    this.baseUrl = BASE_URL;
  }

  getToken() {
    return localStorage.getItem("token") || "";
  }

  getHeaders(isMultipart = false) {
    const headers = {};
    if (!isMultipart) {
      headers["Content-Type"] = "application/json";
    }
    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const isMultipart = options.body instanceof FormData;

    const config = {
      ...options,
      headers: {
        ...this.getHeaders(isMultipart),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage = `HTTP Error ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {
          // fallback if response isn't JSON
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.warn(`[ApiClient] Request to ${endpoint} failed:`, error.message);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  post(endpoint, body) {
    const isFormData = body instanceof FormData;
    return this.request(endpoint, {
      method: "POST",
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  put(endpoint, body) {
    const isFormData = body instanceof FormData;
    return this.request(endpoint, {
      method: "PUT",
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
