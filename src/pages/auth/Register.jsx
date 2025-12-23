import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import TextInput from '../../components/auth/TextInput';
import PrimaryButton from '../../components/auth/PrimaryButton';
import FormLayout from '../../components/auth/layout/FormLayout';
import { validateTokenAPI, registerAPI } from '../../features/auth/authAPI';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const registrationToken = queryParams.get('token') || null;

  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formInputs, setFormInputs] = useState([
    {
      name: 'email',
      error: false,
      placeholder: 'e.g., alice1234@gmail.com',
      helperText: '',
      disabled: true,
      defaultValue: 'user123@gmail.com',
    },
    { name: 'username', error: false, placeholder: 'e.g., alice1234', helperText: '' },
    { name: 'password', error: false, type: 'password', helperText: '' },
    { name: 'confirm password', error: false, type: 'password', helperText: '' },
  ]);

  // Validate registration token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!registrationToken) {
        navigate('/register/expired', { replace: true });
        return;
      }

      try {
        const response = await validateTokenAPI(registrationToken);

        const email = response.data.data.email;

        setFormInputs((prev) => {
          const updated = [...prev];
          const emailIndex = updated.findIndex((input) => input.name === 'email');
          if (emailIndex !== -1) {
            updated[emailIndex].defaultValue = email;
          }
          return updated;
        });

        setIsValidatingToken(false);
      } catch (error) {
        console.error('Token validation failed:', error);
        navigate('/register/expired', { replace: true });
      }
    };

    validateToken();
  }, [registrationToken, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    // get input values
    let isError = false;
    const username = formData.get('username');
    // const email = formData.get('email');
    const password = formData.get('password');
    const confirm = formData.get('confirm password');

    const updatedFormInputs = [...formInputs];

    // validate username
    if (!username) {
      // empty input validation
      isError = true;
      updatedFormInputs[1].error = true;
      updatedFormInputs[1].helperText = 'Enter username';
    } else {
      // length check
      if (username.length < 6 || username.length > 40) {
        isError = true;
        updatedFormInputs[1].error = true;
        updatedFormInputs[1].helperText =
          username.length < 6 ? 'Username too short' : 'Username too long';
      }
      // special characters check
      if (!/^[A-Za-z0-9]+$/.test(username)) {
        isError = true;
        updatedFormInputs[1].error = true;
        updatedFormInputs[1].helperText = 'Only letters and digits allowed';
      }
    }

    // validate password
    if (!password) {
      // empty input validation
      isError = true;
      updatedFormInputs[2].error = true;
      updatedFormInputs[2].helperText = 'Enter password';
    } else {
      // length check
      if (password.length < 6 || password.length > 40) {
        isError = true;
        updatedFormInputs[2].error = true;
        updatedFormInputs[2].helperText =
          password.length < 6 ? 'Username too short' : 'Username too long';
      }
      // special characters check
      if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/.test(password)) {
        isError = true;
        updatedFormInputs[2].error = true;
        updatedFormInputs[2].helperText = 'Password format invalid';
      }
    }

    // validate confirm password
    if (!confirm) {
      // empty input validation
      isError = true;
      updatedFormInputs[3].error = true;
      updatedFormInputs[3].helperText = 'Confirm password';
    } else {
      // same with password check
      if (confirm !== password) {
        isError = true;
        updatedFormInputs[3].error = true;
        updatedFormInputs[3].helperText = 'Passwords did not match';
      }
    }

    if (isError) {
      setFormInputs(updatedFormInputs);
      return;
    }

    // Call registration API
    setIsSubmitting(true);
    try {
      const response = await registerAPI({
        token: registrationToken,
        username: username.toLowerCase().trim(),
        password,
      });

      const { user, token } = response.data.data;
      dispatch(setCredentials({ user, token, role: user.role }));

      navigate('/personal', { replace: true });
    } catch (error) {
      console.error('Registration failed:', error);

      // Handle backend validation errors
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        const newFormInputs = [...formInputs];

        backendErrors.forEach((err) => {
          if (err.path === 'username') {
            newFormInputs[1].error = true;
            newFormInputs[1].helperText = err.message;
          } else if (err.path === 'password') {
            newFormInputs[2].error = true;
            newFormInputs[2].helperText = err.message;
          }
        });

        setFormInputs(newFormInputs);
      } else {
        alert(error.response?.data?.message || 'Registration failed. Please try again.');
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
        onSubmit={handleSubmit}
      >
        {formInputs.map(
          ({ name, error, placeholder, type, helperText, disabled, defaultValue }, index) => (
            <TextInput
              key={name}
              name={name}
              label={name[0].toUpperCase() + name.slice(1)}
              placeholder={placeholder || ''}
              type={type || 'text'}
              error={error}
              disabled={disabled}
              defaultValue={defaultValue || ''}
              onChange={() => {
                handleChange(error, index);
              }}
              helperText={helperText}
            />
          )
        )}
        <PrimaryButton
          buttonDesc={isSubmitting ? 'Submitting...' : 'Submit'}
          type={'submit'}
          disabled={isSubmitting}
          // sx={{ marginTop: '50px', width: 'fit-content', alignSelf: 'end' }}
        />
      </form>
    </FormLayout>
  );
}

export default Register;
