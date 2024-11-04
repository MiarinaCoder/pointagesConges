import api from './api';

export const login = async (email, password,latitude,longitude) => {
  const response = await api.post('/auth/login', { email, password, latitude, longitude });
  return response.data;
};
