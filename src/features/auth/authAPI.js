import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const loginAPI = (data) => api.post('/api/auth/login', data);

export const registerAPI = (data) => api.post('/api/auth/register', data);

export const validateTokenAPI = (token) => api.get(`/api/auth/validate-token?token=${token}`);
