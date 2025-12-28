import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import { jwtDecode } from 'jwt-decode';

function isTokenExpired(decoded) {
  if (!decoded?.exp) return true;

  const now = Date.now() / 1000; // seconds
  return decoded.exp < now;
}

function ProtectedRoute({ children, redirectTo = '/login' }) {
  const { token, user } = useSelector((state) => state.auth);

  if (!token || !user.onboardingStatus) {
    return <Navigate to={redirectTo} replace />;
  }

  let redirect = false;

  try {
    const payload = jwtDecode(token);
    if (isTokenExpired(payload)) {
      redirect = true;
    }
  } catch (e) {
    // token malformed
    console.log(e);
    redirect = true;
  }

  if (redirect) {
    return <Navigate to={redirectTo} replace />;
  }

  if (user.onboardingStatus === 'NOT_STARTED') {
    return <Navigate to={'/onboarding'} replace />;
  }

  if (user.onboardingStatus === 'PENDING') {
    return <Navigate to={'/onboarding/pending'} replace />;
  }
  if (user.onboardingStatus === 'REJECTED') {
    return <Navigate to={'/onboarding/rejected'} replace />;
  }
  if (user.onboardingStatus === 'APPROVED') {
    return <Navigate to={'/personal'} replace />;
  }

  return children;
}

export default ProtectedRoute;
