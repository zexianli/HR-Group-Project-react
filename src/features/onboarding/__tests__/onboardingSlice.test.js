import onboardingReducer, {
  setApplication,
  setStatus,
} from '../onboardingSlice';

describe('onboardingSlice reducer', () => {
  const initialState = {
    application: null,
    status: 'idle',
    loading: false,
    error: null,
  };

  it('should return the initial state', () => {
    const state = onboardingReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('should handle setApplication', () => {
    const application = {
      firstName: 'Leo',
      lastName: 'Zhang',
      visa: 'OPT',
    };

    const state = onboardingReducer(
      initialState,
      setApplication(application)
    );

    expect(state.application).toEqual(application);
  });

  it('should handle setStatus', () => {
    const state = onboardingReducer(
      initialState,
      setStatus('pending')
    );

    expect(state.status).toBe('pending');
  });
});
