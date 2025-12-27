import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import FormHelperText from '@mui/material/FormHelperText';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import { useState } from 'react';
const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

function ReusableFileInput({
  labelContent,
  handleUploadingFile,
  file,
  fileVarName,
  fileName,
  error,
  required,
  accept,
}) {
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileType, setFileType] = useState('');
  const [showPDF, setShowPDF] = useState(false);

  return (
    <>
      <FormGrid size={12}>
        <Button variant="contained" component="label" sx={{ width: 'fit-content' }}>
          {`${labelContent}${required && '*'}`}
          <input
            type="file"
            hidden
            accept={accept}
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              handleUploadingFile(e, fileVarName);
              setFileType(file ? file.type : '');
              setPreviewUrl(file ? URL.createObjectURL(file) : '');
            }}
          />
        </Button>
        {fileName !== '' && fileName}
        {!!error && (
          <FormHelperText sx={{ color: '#d32f2f', paddingLeft: '14px' }}>
            {error?.message}
          </FormHelperText>
        )}
        {file && fileType && previewUrl && (
          <>
            {fileType === 'application/pdf' ? (
              <div
                onClick={() => setShowPDF(true)}
                style={{
                  width: '150px',
                  height: '150px',
                  border: '1px solid #ccc',
                  borderRadius: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <img
                  src="https://cdn-icons-png.freepik.com/512/9207/9207510.png"
                  alt="PDF logo"
                  style={{ width: '50px', height: '50px' }}
                />
                Click to view PDF
              </div>
            ) : (
              <img
                src={previewUrl}
                alt={fileName}
                style={{ objectFit: 'contain', height: '200px', width: 'fit-content' }}
              />
            )}
          </>
        )}
        {file && showPDF && previewUrl && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.8)',
              zIndex: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                width: '50px',
                height: '50px',
                cursor: 'pointer',
              }}
            >
              <CloseTwoToneIcon
                sx={{ color: 'white', width: '100%', height: '100%' }}
                onClick={() => setShowPDF(false)}
              />
            </div>
            <iframe
              src={previewUrl}
              width="80%"
              height="80%"
              title="PDF Full Preview"
              style={{ border: 'none' }}
            />
          </div>
        )}
      </FormGrid>
    </>
  );
}

export default ReusableFileInput;
