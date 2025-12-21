import { useLocation } from 'react-router';

function Register() {
  const queryParams = new URLSearchParams(useLocation().search);
  const registrationToken = queryParams.get('token') || null;

  return (
    <>
      <h1>Hello from Register</h1>
    </>
  );
}

export default Register;
