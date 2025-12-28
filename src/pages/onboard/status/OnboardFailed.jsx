import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { fetchOnboarding } from '../../../features/onboarding/onboardingAPI';
import { useEffect, useState } from 'react';
import OuterContainer from '../../../components/auth/layout/OuterContainer';
import { Box } from '@mui/material';

function OnboardFailed() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [rejectedMessage, setRejectedMessage] = useState('');
  // console.log(token);
  // console.log('hello');

  useEffect(() => {
    // console.log(token);
    const fetchAPI = async () => {
      try {
        const response = await fetchOnboarding(token);

        // PENDING -> /onboarding/pending
        if (response.data.onboarding.status === 'PENDING') {
          navigate('/onboarding/pending', { replace: true });
        }
        // APPROVED -> /personal
        if (response.data.onboarding.status === 'APPROVED') {
          navigate('/personal', { replace: true });
        }

        setRejectedMessage(response.data.onboarding.feedback);
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
    <>
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
              Oops, your application has been rejected!
            </p>
            <p
              style={{ fontFamily: 'Roboto, sans-serif', lineHeight: '22px', marginBottom: '40px' }}
            >
              Do not worry about it, as it usually happens a lot with the other candidates, and you
              are still able to start a new application. However, to prevent further rejection, we
              provided you with some feedback on your last application.{' '}
              <b>Please read it before you start a new one.</b>
            </p>
            <p
              style={{
                padding: '10px',
                border: 'solid 1px #abcdcf',
                textAlign: 'left',
                marginBottom: '40px',
                width: '100%',
                height: 'fit-content',
                maxHeight: '250px',
                overflow: 'auto',
              }}
            >
              {rejectedMessage}
            </p>
            <button
              onClick={() => {
                navigate('/onboarding', { replace: true });
              }}
            >
              Start a new application
            </button>
          </>
        </Box>
      </OuterContainer>
    </>
  );
}

export default OnboardFailed;
