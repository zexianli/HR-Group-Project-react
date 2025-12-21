import authReducer, { setCredentials, logout } from '../authSlice';

describe('authSlice', () => {
  const initialState = {
    user: null,
    token: null,
    role: null,
    status: 'idle',
    error: null,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('should return the initial state', () => {
    const state = authReducer(undefined, { type: 'unknown' });
    expect(state.user).toBe(null);
    expect(state.token).toBe(null);
    expect(state.role).toBe(null);
  });

  it('should handle setCredentials', () => {
    const action = setCredentials({
      user: { id: 1, name: 'Leo' },
      token: 'fake-jwt-token',
      role: 'EMPLOYEE',
    });

    const state = authReducer(initialState, action);

    expect(state.user).toEqual({ id: 1, name: 'Leo' });
    expect(state.token).toBe('fake-jwt-token');
    expect(state.role).toBe('EMPLOYEE');
    expect(localStorage.getItem('token')).toBe('fake-jwt-token');
  });

  it('should handle logout', () => {
    localStorage.setItem('token', 'existing-token');

    const loggedInState = {
      ...initialState,
      user: { id: 1 },
      token: 'existing-token',
      role: 'EMPLOYEE',
    };

    const state = authReducer(loggedInState, logout());

    expect(state.user).toBe(null);
    expect(state.token).toBe(null);
    expect(state.role).toBe(null);
    expect(localStorage.getItem('token')).toBe(null);
  });
});
