import { Button } from '@mui/material';

function PrimaryButton({ buttonDesc, ...props }) {
  return (
    <Button
      variant="contained"
      {...props}
      sx={{ marginTop: '50px', width: 'fit-content', alignSelf: 'end' }}
    >
      {buttonDesc}
    </Button>
  );
}

export default PrimaryButton;
