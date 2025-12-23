import { Routes, Route } from 'react-router';
import Register from './components/Register';
import Home from './components/Home';
import Login from './components/Login';

function AppRoutes() {
  return (
    <Routes>
      <Route path="" element={<Home />}>
        <Route path=":something?" element={<Home />} />
      </Route>
      <Route path="register?" element={<Register />} />
      <Route path="login?" element={<Login />} />
    </Routes>
  );
}

export default AppRoutes;
