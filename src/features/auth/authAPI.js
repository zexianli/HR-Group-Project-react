import axios from 'axios';
import { getAuthHeader } from '../../api/getToken';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const loginAPI = (data) => api.post('/api/auth/login', data);

export const registerAPI = (data) => api.post('/api/auth/register', data);

export const validateTokenAPI = () =>
  api.get('/api/auth/me', {
    headers: {
      Authorization: getAuthHeader(),
    },
  });
