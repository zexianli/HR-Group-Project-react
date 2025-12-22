import { TextField } from '@mui/material';

function TextInput({ ...props }) {
  return <TextField variant="standard" {...props} />;
}

export default TextInput;
