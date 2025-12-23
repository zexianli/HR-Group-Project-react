import { useState } from 'react';
import TextInput from '../../components/auth/TextInput';
import PrimaryButton from '../../components/auth/PrimaryButton';
import FormLayout from '../../components/auth/layout/FormLayout';

function Login() {
  const [formInputs, setFormInputs] = useState([
    {
      name: 'email',
      error: false,
      placeholder: 'e.g., alice1234@gmail.com',
      helperText: '',
    },
    {
      name: 'password',
      error: false,
      type: 'password',
      helperText: '',
    },
  ]);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    let isError = false;
    const email = formData.get('email');
    const password = formData.get('password');

    const updatedFormInputs = [...formInputs];

    // validate email
    if (!email) {
      isError = true;
      updatedFormInputs[0].error = true;
      updatedFormInputs[0].helperText = 'Enter email';
    } else {
      if (!/^[\w.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
        isError = true;
        updatedFormInputs[0].error = true;
        updatedFormInputs[0].helperText = 'Email format invalid';
      }
    }

    // validate password
    if (!password) {
      isError = true;
      updatedFormInputs[1].error = true;
      updatedFormInputs[1].helperText = 'Enter password';
    }

    if (isError) {
      setFormInputs(updatedFormInputs);
    } else {
      // call login API
      //   const payload = {
      //     email,
      //     password,
      //   };
      // example
      // fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // })
      //   .then((res) => {
      //     if (!res.ok) throw new Error('Login failed');
      //     return res.json();
      //   })
      //   .then((data) => {
      //     localStorage.setItem('token', data.token);
      //     navigate('/dashboard');
      //   })
      //   .catch(console.error);
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

        <PrimaryButton buttonDesc={'Login'} type={'submit'} />
      </form>
    </FormLayout>
  );
}

export default Login;
