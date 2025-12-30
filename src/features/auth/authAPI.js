import axios from 'axios';
import { getAuthHeader } from '../../api/getToken';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const loginAPI = (data) => api.post('/auth/login', data);

export const registerAPI = (data) => api.post('/auth/register', data);

export const validateTokenAPI = () =>
  api.get('/auth/me', {
    headers: {
      Authorization: getAuthHeader(),
    },
  });

export const validateRegistrationTokenAPI = (token) =>
  api.get('/auth/validate-token', {
    params: {
      token,
    },
  });
