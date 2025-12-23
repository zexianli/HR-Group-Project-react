import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import TextInput from '../../components/auth/TextInput';
import PrimaryButton from '../../components/auth/PrimaryButton';
import FormLayout from '../../components/auth/layout/FormLayout';
import { loginAPI } from '../../features/auth/authAPI';
import { setCredentials } from '../../features/auth/authSlice';

const loginSchema = z.object({
  username: z.string().min(1, 'Enter username'),
  password: z.string().min(1, 'Enter password'),
});

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await loginAPI(data);

      // Store credentials in Redux
      const { user, token } = response.data.data;
      dispatch(setCredentials({ user, token, role: user.role }));

      navigate('/personal', { replace: true });
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
