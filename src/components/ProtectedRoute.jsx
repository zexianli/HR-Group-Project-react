import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router';
import { jwtDecode } from 'jwt-decode';
import { validateTokenAPI } from '../features/auth/authAPI';
import { logout, setCredentials } from '../features/auth/authSlice';

function isTokenExpired(decoded) {
  if (!decoded?.exp) return true;

  const now = Date.now() / 1000; // seconds
  return decoded.exp < now;
}

function ProtectedRoute({
  children,
  redirectTo = '/login',
  allowedStatuses = null,
  allowedRoles = ['EMPLOYEE'],
}) {
  const { token, user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    async function validate() {
      if (!token) {
        setIsValidating(false);
        setIsValid(false);
        return;
      }

      // Frontend validation
      try {
        const payload = jwtDecode(token);
        if (isTokenExpired(payload)) {
          dispatch(logout());
          setIsValid(false);
          setIsValidating(false);
          return;
        }
      } catch (e) {
        console.log('Token decode failed:', e);
        dispatch(logout());
        setIsValid(false);
        setIsValidating(false);
        return;
      }

      // Check with backend
      try {
        const response = await validateTokenAPI();
        const updatedUser = response.data.data.user;

        dispatch(setCredentials({ user: updatedUser, token, role }));
        setIsValid(true);
      } catch (error) {
        console.error('Backend validation failed:', error);
        dispatch(logout());
        setIsValid(false);
      } finally {
        setIsValidating(false);
      }
    }

    validate();
  }, [token, dispatch, role]);

  if (isValidating) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  if (!token || !isValid || !user?.onboardingStatus) {
    return <Navigate to={redirectTo} replace />;
  }

  if (role && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Helper function to get redirect path based on status
  const getRedirectPath = (status) => {
    switch (status) {
      case 'NOT_STARTED':
        return '/onboarding';
      case 'PENDING':
        return '/onboarding/pending';
      case 'REJECTED':
        return '/onboarding/rejected';
      case 'APPROVED':
        return '/personal';
      default:
        return redirectTo;
    }
  };

  // If allowedStatuses is specified, check if user has required status
  if (allowedStatuses) {
    if (allowedStatuses.includes(user.onboardingStatus)) {
      return children;
    }
    // User doesn't have required status, redirect to appropriate page
    return <Navigate to={getRedirectPath(user.onboardingStatus)} replace />;
  }

  // Default behavior: redirect based on status (for routes without allowedStatuses)
  if (user.onboardingStatus === 'APPROVED') {
    return children;
  }

  return <Navigate to={getRedirectPath(user.onboardingStatus)} replace />;
}

export default ProtectedRoute;
