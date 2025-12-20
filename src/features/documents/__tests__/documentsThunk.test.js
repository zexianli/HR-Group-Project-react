import { configureStore } from '@reduxjs/toolkit';
import documentsReducer from '../documentsSlice';
import { fetchDocuments, uploadDocument } from '../documentsThunks';
import * as api from '../documentsAPI';

vi.mock('../documentsAPI');

describe('documents async thunks', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        documents: documentsReducer,
      },
    });
  });

  it('fetchDocuments success', async () => {
    api.fetchDocumentsAPI.mockResolvedValueOnce({
      data: {
        optReceipt: { id: '1', status: 'approved' },
        optEad: null,
      },
    });

    await store.dispatch(fetchDocuments());

    const state = store.getState().documents;

    expect(state.loading).toBe(false);
    expect(state.files.optReceipt.status).toBe('approved');
  });

  it('uploadDocument success', async () => {
    api.uploadDocumentAPI.mockResolvedValueOnce({
      data: {
        id: '2',
        filename: 'ead.pdf',
        status: 'pending',
      },
    });

    const formData = new FormData();

    await store.dispatch(
      uploadDocument({
        type: 'optEad',
        formData,
      })
    );

    const state = store.getState().documents;

    expect(state.files.optEad.filename).toBe('ead.pdf');
    expect(state.files.optEad.status).toBe('pending');
  });
});
