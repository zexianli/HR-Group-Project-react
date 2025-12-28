import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import TextInput from '../../components/auth/TextInput';
import PrimaryButton from '../../components/auth/PrimaryButton';
import FormLayout from '../../components/auth/layout/FormLayout';
import { validateTokenAPI, registerAPI } from '../../features/auth/authAPI';
import { setCredentials } from '../../features/auth/authSlice';
import { encodeString } from '../../utilities/encode';

// Zod validation schema matching backend requirements
const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters long')
      .max(12, 'Username can be at most 12 characters long')
      .regex(/^[A-Za-z0-9]+$/, 'Only letters and digits allowed'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(16, 'Password can be at most 16 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords did not match',
    path: ['confirmPassword'],
  });

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const registrationToken = queryParams.get('token') || null;

  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [email, setEmail] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Validate registration token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!registrationToken) {
        navigate('/register/expired', { replace: true });
        return;
      }

      // what if the link is already used?

      try {
        const response = await validateTokenAPI(registrationToken);
        const emailFromToken = response.data.data.email;

        // Store email in state for display
        setEmail(emailFromToken);
        setIsValidatingToken(false);
      } catch (error) {
        console.error('Token validation failed:', error);
        navigate('/register/expired', { replace: true });
      }
    };

    validateToken();
  }, [registrationToken, navigate]);

  const onSubmit = async (data) => {
    try {
      const response = await registerAPI({
        token: registrationToken,
        username: data.username.toLowerCase().trim(),
        password: data.password,
      });

      const { user, token } = response.data.data;
      dispatch(setCredentials({ user, token, role: user.role }));
      const encodedEmail = encodeString(email);

      navigate(`/onboarding?email=${encodedEmail}`, { replace: true });
    } catch (error) {
      console.error('Registration failed:', error);

      // Handle backend validation errors
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => {
          setError(err.path, { message: err.message });
        });
      } else {
        setError('username', {
          message: error.response?.data?.message || 'Registration failed. Please try again.',
        });
      }
    }
  };

  if (isValidatingToken) {
    return (
      <FormLayout
        header={'Create Your Account'}
        additionalMessage={'Validating your registration token...'}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <p>Loading...</p>
        </div>
      </FormLayout>
    );
  }

  return (
    <FormLayout
      header={'Create Your Account'}
      additionalMessage={
        'To get you started with the onboarding process. Use this account to upload necessary documents and access your onboarding information'
      }
    >
      <form
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInput
          name="email"
          label="Email"
          value={email}
          placeholder="e.g., alice1234@gmail.com"
          disabled
          readOnly
        />
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
        <TextInput
          {...register('confirmPassword')}
          label="Confirm Password"
          type="password"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />
        <PrimaryButton
          buttonDesc={isSubmitting ? 'Submitting...' : 'Submit'}
          type="submit"
          disabled={isSubmitting}
        />
      </form>
    </FormLayout>
  );
}

export default Register;
