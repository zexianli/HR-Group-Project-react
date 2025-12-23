import { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router';
import TextInput from '../../components/auth/TextInput';
import PrimaryButton from '../../components/auth/PrimaryButton';
import FormLayout from '../../components/auth/layout/FormLayout';

function Register() {
  // const navigate = useNavigate();
  // const queryParams = new URLSearchParams(useLocation().search);
  // const registrationToken = queryParams.get('token') || null;
  // register will ask for username, password and email

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
    { name: 'confirm', error: false, type: 'password', helperText: '' },
  ]);

  // there will be useEffect to process the token and get the email
  useEffect(() => {
    // get the email from the token
    // if the token expires, redirect to /register/expired
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    // get input values
    let isError = false;
    const username = formData.get('username');
    // const email = formData.get('email');
    const password = formData.get('password');
    const confirm = formData.get('confirm');

    const updatedFormInputs = [...formInputs];

    // // validate email
    // if (!email) {
    //   // empty input validation
    //   isError = true;
    //   updatedFormInputs[0].error = true;
    //   updatedFormInputs[0].helperText = 'Enter email';
    // } else {
    //   // format check
    //   if (!/^[\w.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
    //     isError = true;
    //     updatedFormInputs[0].error = true;
    //     updatedFormInputs[0].helperText = 'Email format invalid';
    //   }
    //   // length check
    //   if (email.length < 4 || email.length > 75) {
    //     isError = true;
    //     updatedFormInputs[0].error = true;
    //     updatedFormInputs[0].helperText = email.length < 4 ? 'Email too short' : 'Email too long';
    //   }
    // }

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
    } else {
      // call the API to register
      // redirect to the onboarding page for registering
      // might need to use registrationToken
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
    <>
      <FormLayout
        header={'Create Your Account'}
        additionalMessage={
          'to get you started with the onboarding process. Use this account to upload necessary documents and access your onboarding information'
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
            buttonDesc={'Submit'}
            type={'submit'}
            // sx={{ marginTop: '50px', width: 'fit-content', alignSelf: 'end' }}
          />
        </form>
      </FormLayout>
    </>
  );
}

export default Register;
