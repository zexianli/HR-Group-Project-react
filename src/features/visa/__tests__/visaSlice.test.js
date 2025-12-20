import visaReducer, { setVisaData } from '../visaSlice';

describe('visaSlice reducer', () => {
  const initialState = {
    documents: {},
    nextStep: null,
    loading: false,
    error: null,
  };

  it('should return the initial state', () => {
    const state = visaReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('should handle setVisaData', () => {
    const visaData = {
      documents: {
        optReceipt: { status: 'approved' },
      },
      nextStep: 'Upload OPT EAD',
    };

    const state = visaReducer(initialState, setVisaData(visaData));

    expect(state.documents.optReceipt.status).toBe('approved');
    expect(state.nextStep).toBe('Upload OPT EAD');
  });

  it('should merge visa data correctly', () => {
    const prevState = {
      ...initialState,
      documents: {
        optReceipt: { status: 'approved' },
      },
    };

    const state = visaReducer(
      prevState,
      setVisaData({
        nextStep: 'Upload OPT EAD',
      })
    );

    expect(state.documents.optReceipt.status).toBe('approved');
    expect(state.nextStep).toBe('Upload OPT EAD');
  });
});
