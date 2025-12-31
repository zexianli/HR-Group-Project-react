import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import TextInput from '../../components/auth/TextInput';
import PrimaryButton from '../../components/auth/PrimaryButton';
import FormLayout from '../../components/auth/layout/FormLayout';
import { loginAPI } from '../../features/auth/authAPI';
import { setCredentials } from '../../features/auth/authSlice';
import { encodeString } from '../../utilities/encode';
import { useEffect } from 'react';

const loginSchema = z.object({
  username: z.string().min(1, 'Enter username'),
  password: z.string().min(1, 'Enter password'),
});

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user) {
      // NOT_STARTED -> /onboarding/rejected
      if (user.onboardingStatus === 'NOT_STARTED') {
        navigate('/onboarding', { replace: true });
      }
      // REJECTED -> /onboarding/rejected
      else if (user.onboardingStatus === 'REJECTED') {
        navigate('/onboarding/rejected', { replace: true });
      }
      // PENDING -> /onboarding/pending
      else if (user.onboardingStatus === 'PENDING') {
        navigate('/onboarding/pending', { replace: true });
      }
      // APPROVED -> /personal
      else if (user.onboardingStatus === 'APPROVED') {
        navigate('/personal', { replace: true });
      }
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await loginAPI(data);
      console.log(response);

      // Store credentials in Redux
      const { user, token } = response.data.data;
      dispatch(setCredentials({ user, token, role: user.role }));

      if (user.onboardingStatus === 'NOT_STARTED') {
        const encodedEmail = encodeString(user.email);

        navigate(`/onboarding?email=${encodedEmail}`, { replace: true });
      } else if (user.onboardingStatus === 'PENDING') {
        // go to onboard pending page
        navigate('/onboarding/pending', { replace: true });
      } else if (user.onboardingStatus === 'REJECTED') {
        // go to onboard rejected page
        navigate('/onboarding/rejected', { replace: true });
      } else if (user.onboardingStatus === 'APPROVED') {
        navigate('/personal', { replace: true });
      }
    } catch (error) {
      console.error('Login failed:', error);

      // Handle backend validation errors
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => {
          setError(err.path, { message: err.message });
        });
      } else {
        setError('username', {
          message: error.response?.data?.message || 'Invalid username or password',
        });
      }
    }
  };

  return (
    <FormLayout
      header={'Welcome Back'}
      additionalMessage={'Log in to access your account and continue the onboarding process.'}
    >
      <form
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInput
          {...register('username')}
          label="Username"
          placeholder="e.g., alice1234"
          error={!!errors.username}
          helperText={errors.username?.message}
        />
        <TextInput
          {...register('password')}
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <PrimaryButton
          buttonDesc={isSubmitting ? 'Logging in...' : 'Login'}
          type="submit"
          disabled={isSubmitting}
        />
      </form>
    </FormLayout>
  );
}

export default Login;
