import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const fetchHousing = () =>
  api.get('/housing');

export const createReport = (data) =>
  api.post('/housing/report', data);
