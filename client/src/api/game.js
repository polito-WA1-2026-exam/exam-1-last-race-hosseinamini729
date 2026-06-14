import { apiClient } from "../services/client";

export const gameAPI = {
  startGame: async () => {
    const response = await apiClient.get("/game/start");
    return response.data;
  },

  // payload: { startStationId, endStationId, segments }
  playGame: async (payload) => {
    const response = await apiClient.post("/game/play", payload);
    return response.data;
  },

  getRanking: async () => {
    const response = await apiClient.get("/game/ranking");
    return response.data;
  },
};
