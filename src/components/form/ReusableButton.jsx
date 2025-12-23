import { Button } from '@mui/material';

function ReusableButton({ children, onClickMethod }) {
  return (
    <Button variant="contained" onClick={onClickMethod}>
      {children}
    </Button>
  );
}

export default ReusableButton;
