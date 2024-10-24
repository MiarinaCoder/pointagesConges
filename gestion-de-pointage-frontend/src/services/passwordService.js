import axios from 'axios';

const passwordService = {
  requestPasswordReset: async (email) => {
    try {
      const response = await axios.post('http://192.168.88.85:5000/api/auth/mot-de-passe-oublie', { email });
      return response.data;
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  }
};

export default passwordService;