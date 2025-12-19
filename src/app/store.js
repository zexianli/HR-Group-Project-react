// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import onboardingReducer from '../features/onboarding/onboardingSlice';
import profileReducer from '../features/profile/profileSlice';
import visaReducer from '../features/visa/visaSlice';
import housingReducer from '../features/housing/housingSlice';
import documentsReducer from '../features/documents/documentsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    onboarding: onboardingReducer,
    profile: profileReducer,
    visa: visaReducer,
    housing: housingReducer,
    documents: documentsReducer,
  },
});
