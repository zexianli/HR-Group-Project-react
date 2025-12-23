import { Box, Stack } from '@mui/material';
import ReusableStepper from '../form/ReusableStepper';

function OuterLayout({ children, pagesName, handleNext, handlePrev, currPageIndex }) {
  return (
    <>
      <Stack
        direction="row"
        sx={{
          boxSizing: 'border-box',
          height: 'calc(100vh - 16px)',
          width: 'calc(100vw - 16px)',
          gap: '50px',
          padding: '20px',
        }}
      >
        <Box
          sx={{
            boxSizing: 'border-box',
            height: 'calc(100vh - 56px)',
            flex: '0 0 400px',
            backgroundColor: 'white',
            border: 'solid 1px #abcdcf',
            borderRadius: '10px',
            padding: '30px',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) ',
          }}
        >
          <h1>Welcome to Onboarding Stage</h1>
        </Box>
        <ReusableStepper
          pagesName={pagesName}
          handleNext={handleNext}
          handlePrev={handlePrev}
          currPageIndex={currPageIndex}
        >
          {children}
        </ReusableStepper>
      </Stack>
    </>
  );
}

export default OuterLayout;
