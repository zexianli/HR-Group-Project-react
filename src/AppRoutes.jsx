import { Routes, Route } from 'react-router';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import Fail from './pages/auth/Fail';
import Login from './pages/auth/Login';

function AppRoutes() {
  return (
    <Routes>
      <Route path="" element={<Home />} />
      <Route path="register" element={<Register />} />
      <Route path="register/expired" element={<Fail />} />
      <Route path="Login" element={<Login />} />
    </Routes>
  );
}

export default AppRoutes;
