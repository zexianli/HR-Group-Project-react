import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  documents: {},
  nextStep: null,
  loading: false,
  error: null,
};

const visaSlice = createSlice({
  name: 'visa',
  initialState,
  reducers: {
    setVisaData(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { setVisaData } = visaSlice.actions;
export default visaSlice.reducer;
