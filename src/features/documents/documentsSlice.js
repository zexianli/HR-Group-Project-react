//src/features/documents/documentSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchDocuments, uploadDocument } from './documentsThunks'; 

const initialState = {
  files: {
    profilePhoto: null,
    driverLicense: null,
    workAuthorization: null,
    optReceipt: null,
    optEad: null,
    i983: null,
    i20: null,
  },
  loading: false,
  error: null,
};

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setDocument(state, action) {
      const { type, data } = action.payload;
      state.files[type] = data;
    },
    removeDocument(state, action) {
      state.files[action.payload] = null;
    },
    clearDocuments() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        })
        .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
        })
        .addCase(uploadDocument.fulfilled, (state, action) => {
        const { type, data } = action.payload;
        state.files[type] = data;
        state.loading = false;
        })
        .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        });
    }
});

export const {
  setDocument,
  removeDocument,
  clearDocuments,
} = documentsSlice.actions;

export default documentsSlice.reducer;
