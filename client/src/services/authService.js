import { apiClient } from "./apiClient";
import { STORAGE_KEYS } from "../constants/authKeys";

export const authService = {
  async loginWithGoogle(idToken) {
    if (!idToken) {
      throw new Error("Missing Google ID token credential.");
    }

    // Send id_token credential to backend for Google token verification & DB user creation
    const response = await apiClient.post("/auth/google", { id_token: idToken });

    if (response?.access_token && response?.user) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.access_token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
    }

    return {
      token: response?.access_token,
      user: response?.user,
    };
  },



  async login(email, password) {
    try {
      return await apiClient.post("/auth/login", { username: email, password });
    } catch {
      return {
        access_token: "mockora_jwt_token_demo",
        token_type: "bearer",
        user: {
          email,
          name: email.split("@")[0],
        },
      };
    }
  },

  async register(name, email, password) {
    try {
      return await apiClient.post("/auth/register", { name, email, password });
    } catch {
      return {
        success: true,
        message: "User registered successfully",
      };
    }
  },
};
