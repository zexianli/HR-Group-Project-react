import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const fetchOnboarding = () =>
  api.get('/onboarding');

export const submitOnboarding = (data) =>
  api.post('/onboarding', data);
