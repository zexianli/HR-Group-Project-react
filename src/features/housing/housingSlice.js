import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  house: null,
  reports: [],
  loading: false,
  error: null,
};

const housingSlice = createSlice({
  name: 'housing',
  initialState,
  reducers: {
    setHousing(state, action) {
      state.house = action.payload;
    },
    setReports(state, action) {
      state.reports = action.payload;
    },
  },
});

export const { setHousing, setReports } = housingSlice.actions;
export default housingSlice.reducer;
