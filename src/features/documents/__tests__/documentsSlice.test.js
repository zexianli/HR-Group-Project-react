import documentsReducer, {
  setDocument,
  removeDocument,
  clearDocuments,
} from '../documentsSlice';

describe('documentsSlice reducer', () => {
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

  it('should return the initial state', () => {
    const state = documentsReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('should handle setDocument', () => {
    const payload = {
      type: 'optReceipt',
      data: {
        id: 'doc1',
        filename: 'opt.pdf',
        status: 'pending',
      },
    };

    const state = documentsReducer(
      initialState,
      setDocument(payload)
    );

    expect(state.files.optReceipt).toEqual(payload.data);
  });

  it('should handle removeDocument', () => {
    const populatedState = {
      ...initialState,
      files: {
        ...initialState.files,
        optReceipt: { id: 'doc1' },
      },
    };

    const state = documentsReducer(
      populatedState,
      removeDocument('optReceipt')
    );

    expect(state.files.optReceipt).toBe(null);
  });

  it('should handle clearDocuments', () => {
    const populatedState = {
      ...initialState,
      files: {
        ...initialState.files,
        optReceipt: { id: 'doc1' },
        optEad: { id: 'doc2' },
      },
    };

    const state = documentsReducer(populatedState, clearDocuments());

    expect(state).toEqual(initialState);
  });
});
