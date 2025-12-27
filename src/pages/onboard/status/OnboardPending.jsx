import { useEffect } from 'react';
import OuterContainer from '../../../components/auth/layout/OuterContainer';
import { Box } from '@mui/material';
import { fetchOnboarding } from '../../../features/onboarding/onboardingAPI';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

function OnboardPending() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  // console.log(token);
  // console.log('hello');

  useEffect(() => {
    // console.log(token);
    const fetchAPI = async () => {
      try {
        const response = await fetchOnboarding(token);

        // REJECTED -> /onboarding/rejected
        if (response.data.onboarding.status === 'REJECTED') {
          navigate('/onboarding/rejected', { replace: true });
        }
        // APPROVED -> /personal
        if (response.data.onboarding.status === 'APPROVED') {
          navigate('/personal', { replace: true });
        }
      } catch (e) {
        console.log(e);
        // token expired, need to login again
        if (e.response.status === 401) {
          navigate('/login', { replace: true });
        }
      }
    };

    fetchAPI();
    // always check its onboarding status
  }, []);

  return (
    <OuterContainer>
      <Box
        sx={{
          border: 'solid 1px #abcdcf',
          borderRadius: '10px',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) ',
          width: '500px',
          height: 'fit-content',
          textAlign: 'center',
          padding: '20px 40px',
          paddingBottom: '55px',
          backgroundColor: 'white',
        }}
      >
        <>
          <p
            style={{
              fontWeight: '500',
              fontSize: '40px',
              marginBottom: '40px',
            }}
          >
            You are done with your first step!
          </p>
          <p style={{ fontFamily: 'Roboto, sans-serif', lineHeight: '22px' }}>
            Your onboarding application has been sent to the HR. Please wait, as the HR will review
            your application. If there is something wrong, you will be notified. If none, you're
            good to go, and you will be able to access your account. Keep yourself posted for any
            updates
          </p>
        </>
      </Box>
    </OuterContainer>
  );
}

export default OnboardPending;
