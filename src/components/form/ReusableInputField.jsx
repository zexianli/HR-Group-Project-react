import FormLabel from '@mui/material/FormLabel';
import { TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

// import { forwardRef } from 'react';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

function ReusableInputField(
  { xs, md, id, label, placeholder, required, type, disabled, error, helperText, ...rest },
  ref
) {
  return (
    <FormGrid size={{ xs, md }}>
      <FormLabel htmlFor={id} required={required}>
        {label}
      </FormLabel>
      <TextField
        id={id}
        name={id}
        type={type || 'text'}
        placeholder={placeholder}
        size="small"
        disabled={disabled}
        inputRef={ref}
        error={error}
        helperText={helperText || ''}
        {...rest}
      />
    </FormGrid>
  );
}

export default ReusableInputField;
