import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const loginAPI = (data) => api.post('/auth/login', data);

export const registerAPI = (data) => api.post('/auth/register', data);
