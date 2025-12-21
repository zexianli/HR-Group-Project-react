import profileReducer, { setProfile, clearProfile } from '../profileSlice';

describe('profileSlice reducer', () => {
  const initialState = {
    profile: null,
    loading: false,
    error: null,
  };

  it('should return the initial state', () => {
    const state = profileReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('should handle setProfile', () => {
    const profile = {
      firstName: 'Leo',
      lastName: 'Zhang',
      email: 'leo@test.com',
    };

    const state = profileReducer(initialState, setProfile(profile));

    expect(state.profile).toEqual(profile);
  });

  it('should handle clearProfile', () => {
    const populatedState = {
      ...initialState,
      profile: { firstName: 'Leo' },
    };

    const state = profileReducer(populatedState, clearProfile());

    expect(state.profile).toBe(null);
  });
});
