import { apiClient } from "./apiClient";

export const adminService = {
  async getAllUsers() {
    return await apiClient.get("/admin/users");
  }
};
