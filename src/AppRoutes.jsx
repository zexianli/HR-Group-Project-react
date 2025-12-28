import { Routes, Route } from 'react-router';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import Fail from './pages/auth/Fail';
import Onboarding from './pages/onboard/Onboarding';
import Login from './pages/auth/Login';
import PersonalInformation from './pages/info/PersonalInformation';
import VisaStatusManagement from './pages/info/VisaStatusManagement';
import HousingPage from './pages/info/HousingPage';
import OnboardPending from './pages/onboard/status/OnboardPending';
import OnboardFailed from './pages/onboard/status/OnboardFailed';
import OnboardFinish from './pages/onboard/status/OnboardFinish';

function AppRoutes() {
  return (
    <Routes>
      <Route path="" element={<Home />} />
      <Route path="register" element={<Register />} />
      <Route path="register/expired" element={<Fail />} />
      <Route path="onboarding" element={<Onboarding />} />
      <Route path="onboarding/finish" element={<OnboardFinish />} />
      <Route path="onboarding/pending" element={<OnboardPending />} />
      <Route path="onboarding/rejected" element={<OnboardFailed />} />
      <Route path="login" element={<Login />} />
      <Route path="personal" element={<PersonalInformation />} />
      <Route path="visa" element={<VisaStatusManagement />} />
      <Route path="housing" element={<HousingPage />} />
    </Routes>
  );
}

export default AppRoutes;
