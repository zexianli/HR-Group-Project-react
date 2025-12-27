import OuterLayout from '../../components/onboard/OuterLayout';
import PersonalInfo from './PersonalInfo';
import AddressContact from './AddressContact';
import WorkAuth from './WorkAuth';
import { Box } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { fetchOnboarding } from '../../features/onboarding/onboardingAPI';
// import { userOnboardNav } from '../../utilities/navigation';

function Onboarding() {
  // a stepper
  // there will be four pages
  // first page -> HP-33
  // second page -> HP-34
  // third page -> HP-35
  // fourth page -> confirming page
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  // console.log('hello');

  useEffect(() => {
    // console.log(token);
    const fetchAPI = async () => {
      try {
        const response = await fetchOnboarding(token);

        // REJECTED -> /onboarding/rejected
        // if (response.data.onboarding.status === 'REJECTED') {
        //   navigate('/onboarding/rejected', { replace: true });
        // }

        // // PENDING -> /onboarding/pending
        // if (response.data.onboarding.status === 'PENDING') {
        //   navigate('/onboarding/pending', { replace: true });
        // }
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

  const email = user.email || '';

  const prevNextHandlerRef = useRef({});
  const pages = [
    {
      name: 'Personal Information',
      ui: <PersonalInfo prevNextHandler={(h) => (prevNextHandlerRef.current = h)} email={email} />,
    },
    {
      name: 'Address and Contacts',
      ui: <AddressContact prevNextHandler={(h) => (prevNextHandlerRef.current = h)} />,
    },
    {
      name: 'Work Authorization',
      ui: <WorkAuth prevNextHandler={(h) => (prevNextHandlerRef.current = h)} />,
    },
  ];

  // states
  const [currPageIndex, setCurrPageIndex] = useState(0);

  // functions
  async function handleNext() {
    const canGoNext = await prevNextHandlerRef.current?.onNext?.();
    // console.log(canGoNext);
    if (canGoNext) {
      setCurrPageIndex((prev) => prev + 1);
    }
  }

  function handlePrev() {
    prevNextHandlerRef.current?.onPrev?.();
    setCurrPageIndex((prev) => prev - 1);
  }

  function handleSubmit() {
    prevNextHandlerRef.current?.onSubmit?.();
  }

  return (
    <>
      <OuterLayout
        pagesName={pages.map(({ name }) => name)}
        handleNext={handleNext}
        handlePrev={handlePrev}
        handleSubmit={handleSubmit}
        currPageIndex={currPageIndex}
      >
        {/* This is the code for rendering things  */}
        <Box
          sx={{
            flex: '1',
            overflow: 'auto',
            backgroundColor: 'white',
            border: 'solid 1px #abcdcf',
            borderRadius: '10px',
            padding: '30px',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) ',
          }}
        >
          {pages[currPageIndex].ui}
        </Box>
      </OuterLayout>
    </>
  );
}

export default Onboarding;
