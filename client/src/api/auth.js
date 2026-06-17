import { apiClient } from "../services/client";

export const authAPI = {
  login: async (username, password) => {
    const response = await apiClient.post("/auth/login", {
      username,
      password,
    });
    return response.data;
  },

  logout: async () => {
    await apiClient.delete("/auth/current");
  },

  getCurrentSession: async () => {
    const response = await apiClient.get("/auth/current");
    return response.data;
  },
};
