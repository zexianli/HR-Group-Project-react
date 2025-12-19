import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const fetchVisaStatus = () =>
  api.get('/visa');

export const uploadVisaDoc = (formData) =>
  api.post('/visa/upload', formData);
