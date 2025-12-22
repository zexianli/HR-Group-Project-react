import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

function ProtectedRoute({ children, redirectTo = '/login' }) {
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

export default ProtectedRoute;
