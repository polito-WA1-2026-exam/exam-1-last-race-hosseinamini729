import { apiClient } from "../services/client";

export const networkAPI = {
  getNetwork: async () => {
    const response = await apiClient.get("/network");
    return response.data;
  },
};
