import { Routes, Route } from 'react-router';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import Fail from './pages/auth/Fail';
import Unauthorized from './pages/auth/Unauthorized';
import Onboarding from './pages/onboard/Onboarding';
import Login from './pages/auth/Login';
import PersonalInformation from './pages/info/PersonalInformation';
import VisaStatusManagement from './pages/info/VisaStatusManagement';
import HousingPage from './pages/info/HousingPage';
import OnboardPending from './pages/onboard/status/OnboardPending';
import OnboardFailed from './pages/onboard/status/OnboardFailed';
import OnboardFinish from './pages/onboard/status/OnboardFinish';
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route path="register" element={<Register />} />
      <Route path="register/expired" element={<Fail />} />
      <Route path="login" element={<Login />} />
      <Route path="unauthorized" element={<Unauthorized />} />

      <Route
        path=""
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="onboarding"
        element={
          <ProtectedRoute allowedStatuses={['NOT_STARTED']}>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="onboarding/finish"
        element={
          <ProtectedRoute allowedStatuses={['APPROVED']}>
            <OnboardFinish />
          </ProtectedRoute>
        }
      />
      <Route
        path="onboarding/pending"
        element={
          <ProtectedRoute allowedStatuses={['PENDING']}>
            <OnboardPending />
          </ProtectedRoute>
        }
      />
      <Route
        path="onboarding/rejected"
        element={
          <ProtectedRoute allowedStatuses={['REJECTED']}>
            <OnboardFailed />
          </ProtectedRoute>
        }
      />

      <Route
        path="personal"
        element={
          <ProtectedRoute allowedStatuses={['APPROVED']}>
            <PersonalInformation />
          </ProtectedRoute>
        }
      />
      <Route
        path="visa"
        element={
          <ProtectedRoute allowedStatuses={['APPROVED']}>
            <VisaStatusManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="housing"
        element={
          <ProtectedRoute allowedStatuses={['APPROVED']}>
            <HousingPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
