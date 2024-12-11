import api from './api';

export const retardService = {
  checkRetard: async (sessionId) => {
    const response = await api.get(`/retards/check/${sessionId}`);
    return response.data;
  },

  updateJustification: async (retardId) => {
    const response = await api.put(`/retards/${retardId}/justification`);
    return response.data;
  },

  updateDescription: async (retardId, description) => {
    const response = await api.put(`/retards/${retardId}/description`, { description });
    return response.data;
  },

  submitJustification: async (retardId, formData) => {
    const token = localStorage.getItem('token');
    const response = await api.post(`/retards/${retardId}/justification`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
  }
};
