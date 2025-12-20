import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const uploadDocumentAPI = (formData) =>
  api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const fetchDocumentsAPI = () => api.get('/documents');

export const downloadDocumentAPI = (id) =>
  api.get(`/documents/${id}/download`, {
    responseType: 'blob',
  });
