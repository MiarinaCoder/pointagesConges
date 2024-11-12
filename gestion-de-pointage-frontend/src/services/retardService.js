import api from './api';

export const retardService = {
  checkRetard: async () => {
    try {
      const response = await api.get('/retard/check');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
