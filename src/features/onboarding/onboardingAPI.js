import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const fetchOnboarding = (token) =>
  api.get('/onboarding', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const submitOnboarding = (data, token) =>
  api.post('/onboarding', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const uploadFile = (data, token) =>
  api.post('/upload', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const uploadOPTFile = (data, token) =>
  api.post('/visa/upload', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
