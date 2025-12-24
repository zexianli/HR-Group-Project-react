import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  application: null,
  status: 'idle', // notStarted | pending | approved | rejected
  loading: false,
  error: null,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setApplication(state, action) {
      state.application = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
});

export const { setApplication, setStatus } = onboardingSlice.actions;
export default onboardingSlice.reducer;
