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
      const { personalInfoData, workAuthData, addressContactData } = action.payload;
      console.log(personalInfoData); // error when serializing file (profile picture)
      console.log(workAuthData);
      console.log(addressContactData);
      state.application = {
        personalInfoData,
        workAuthData,
        addressContactData,
      };
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
});

export const { setApplication, setStatus } = onboardingSlice.actions;
export default onboardingSlice.reducer;
