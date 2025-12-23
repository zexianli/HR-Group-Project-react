import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
// import Typography from '@mui/material/Typography';

function ReusableStepper({ children, pagesName }) {
  return (
    <>
      <Stepper>
        {pagesName.map((name) => {
          return (
            <Step>
              <StepLabel>{name}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {children}
    </>
  );
}

export default ReusableStepper;
