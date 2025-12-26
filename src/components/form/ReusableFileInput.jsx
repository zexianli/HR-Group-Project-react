import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import FormHelperText from '@mui/material/FormHelperText';
const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

function ReusableFileInput({
  labelContent,
  handleUploadingFile,
  fileVarName,
  fileName,
  error,
  required,
}) {
  return (
    <>
      <FormGrid size={12}>
        <Button variant="contained" component="label" sx={{ width: 'fit-content' }}>
          {`${labelContent}${required && '*'}`}
          <input
            type="file"
            hidden
            accept="image/png,image/jpeg,image/jpg,application/pdf"
            onChange={(e) => {
              handleUploadingFile(e, fileVarName);
            }}
          />
        </Button>
        {fileName !== '' && fileName}
        {!!error && (
          <FormHelperText sx={{ color: '#d32f2f', paddingLeft: '14px' }}>
            {error?.message}
          </FormHelperText>
        )}
      </FormGrid>
    </>
  );
}

export default ReusableFileInput;
