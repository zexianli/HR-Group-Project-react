import { Routes, Route } from 'react-router';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import Fail from './pages/auth/Fail';
import Onboarding from './pages/onboard/Onboarding';
import Login from './pages/auth/Login';
import PersonalInformation from './pages/info/PersonalInformation';
import VisaStatusManagementPage from './pages/info/VisaStatusManagement';
import HousingPage from './pages/info/HousingPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="" element={<Home />} />
      <Route path="register" element={<Register />} />
      <Route path="register/expired" element={<Fail />} />
      <Route path="onboarding" element={<Onboarding />} />
      <Route path="login" element={<Login />} />
      <Route path="personal" element={<PersonalInformation />} />
      <Route path="visa" element={<VisaStatusManagementPage />} />
      <Route path="housing" element={<HousingPage />} />
    </Routes>
  );
}

export default AppRoutes;
