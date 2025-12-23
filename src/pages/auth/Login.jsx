import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import TextInput from '../../components/auth/TextInput';
import PrimaryButton from '../../components/auth/PrimaryButton';
import FormLayout from '../../components/auth/layout/FormLayout';
import { loginAPI } from '../../features/auth/authAPI';
import { setCredentials } from '../../features/auth/authSlice';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formInputs, setFormInputs] = useState([
    {
      name: 'username',
      error: false,
      placeholder: 'e.g., alice1234',
      helperText: '',
    },
    {
      name: 'password',
      error: false,
      type: 'password',
      helperText: '',
    },
  ]);

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    let isError = false;
    const username = formData.get('username');
    const password = formData.get('password');

    const updatedFormInputs = [...formInputs];

    // validate username
    if (!username) {
      isError = true;
      updatedFormInputs[0].error = true;
      updatedFormInputs[0].helperText = 'Enter username';
    }

    // validate password
    if (!password) {
      isError = true;
      updatedFormInputs[1].error = true;
      updatedFormInputs[1].helperText = 'Enter password';
    }

    if (isError) {
      setFormInputs(updatedFormInputs);
      return;
    }

    // Call login API
    setIsSubmitting(true);
    try {
      const response = await loginAPI({
        username,
        password,
      });

      // Store credentials in Redux
      const { user, token } = response.data.data;
      dispatch(setCredentials({ user, token, role: user.role }));

      navigate('/personal', { replace: true });
    } catch (error) {
      console.error('Login failed:', error);

      // Handle backend validation errors
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        const newFormInputs = [...formInputs];

        backendErrors.forEach((err) => {
          if (err.path === 'username') {
            newFormInputs[0].error = true;
            newFormInputs[0].helperText = err.message;
          } else if (err.path === 'password') {
            newFormInputs[1].error = true;
            newFormInputs[1].helperText = err.message;
          }
        });

        setFormInputs(newFormInputs);
      } else {
        const newFormInputs = [...formInputs];
        newFormInputs[0].error = true;
        newFormInputs[0].helperText =
          error.response?.data?.message || 'Invalid username or password';
        setFormInputs(newFormInputs);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange(error, index) {
    if (error) {
      const updatedFormInputs = [...formInputs];
      updatedFormInputs[index].error = false;
      updatedFormInputs[index].helperText = '';
      setFormInputs(updatedFormInputs);
    }
  }

  return (
    <FormLayout
      header={'Welcome Back'}
      additionalMessage={'Log in to access your account and continue the onboarding process.'}
    >
      <form
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        onSubmit={handleSubmit}
      >
        {formInputs.map(({ name, error, placeholder, type, helperText }, index) => (
          <TextInput
            key={name}
            name={name}
            label={name[0].toUpperCase() + name.slice(1)}
            placeholder={placeholder || ''}
            type={type || 'text'}
            error={error}
            helperText={helperText}
            onChange={() => handleChange(error, index)}
          />
        ))}

        <PrimaryButton
          buttonDesc={isSubmitting ? 'Logging in...' : 'Login'}
          type={'submit'}
          disabled={isSubmitting}
        />
      </form>
    </FormLayout>
  );
}

export default Login;
