import { Box } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import ReusableButton from './ReusableButton';
import { useState } from 'react';

function ReusableStepper({
  children,
  pagesName,
  handleNext,
  handlePrev,
  handleSubmit,
  currPageIndex,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <>
      <Box sx={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <Stepper
          activeStep={currPageIndex}
          sx={{
            boxSizing: 'border-box',
            backgroundColor: 'white',
            border: 'solid 1px #abcdcf',
            borderRadius: '10px',
            padding: '30px',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) ',
          }}
        >
          {pagesName.map((name, index) => (
            <Step key={name}>
              <StepLabel>
                <span style={{ fontWeight: `${index <= currPageIndex ? '900' : '500'}` }}>
                  {name}
                </span>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        {children}
        {/* buttons */}
        <Box
          sx={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            flexShrink: '0',
          }}
        >
          {currPageIndex !== pagesName.length - 1 ? (
            <ReusableButton onClickMethod={handleNext}>Save and Continue</ReusableButton>
          ) : (
            <ReusableButton
              onClickMethod={() => {
                setIsSubmitting(true);
                handleSubmit();
                setIsSubmitting(false);
              }}
              disabled={isSubmitting}
            >
              Submit
            </ReusableButton>
          )}
          {currPageIndex !== 0 && <ReusableButton onClickMethod={handlePrev}>Prev</ReusableButton>}
        </Box>
      </Box>
    </>
  );
}

export default ReusableStepper;
