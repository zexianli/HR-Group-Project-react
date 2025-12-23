import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

function ReusableInputField({ xs, md, id, label, placeholder, required, type }) {
  return (
    <FormGrid size={{ xs, md }}>
      <FormLabel htmlFor={id} required={required}>
        {label}
      </FormLabel>
      <OutlinedInput
        id={id}
        name={id}
        type={type || 'text'}
        placeholder={placeholder}
        required={required}
        size="small"
      />
    </FormGrid>
  );
}

export default ReusableInputField;
