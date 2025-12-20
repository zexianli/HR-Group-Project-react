import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const fetchProfile = () =>
  api.get('/profile');

export const updateProfile = (data) =>
  api.put('/profile', data);
