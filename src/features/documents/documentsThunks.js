import { createAsyncThunk } from '@reduxjs/toolkit';
import { uploadDocumentAPI, fetchDocumentsAPI } from './documentsAPI';

export const fetchDocuments = createAsyncThunk('documents/fetch', async () => {
  const res = await fetchDocumentsAPI();
  return res.data;
});

export const uploadDocument = createAsyncThunk('documents/upload', async ({ type, formData }) => {
  const res = await uploadDocumentAPI(formData);
  return { type, data: res.data };
});
