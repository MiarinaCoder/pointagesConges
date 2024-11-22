import api from './api';

export const retardService = {
  checkRetard: async (sessionId) => {
    try {
      const response = await api.get(`/retards/check/${sessionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
