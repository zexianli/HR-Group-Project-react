import OuterContainer from '../../components/auth/layout/OuterContainer';
import { Box } from '@mui/material';

function Fail() {
  return (
    <OuterContainer>
      <Box
        sx={{
          border: 'solid 1px #abcdcf',
          borderRadius: '10px',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) ',
          width: '500px',
          height: 'fit-content',
          textAlign: 'center',
          padding: '20px 40px',
          paddingBottom: '55px',
          backgroundColor: 'white',
        }}
      >
        <>
          <p
            style={{
              fontWeight: '500',
              fontSize: '40px',
              marginBottom: '40px',
            }}
          >
            Oops, there is something wrong...
          </p>
          <p style={{ fontFamily: 'Roboto, sans-serif', lineHeight: '22px' }}>
            Turns out that your registration request was failed because the registration link has
            expired. Please reach out to our representative for help. Make sure to register within
            three hours after receiving the link
          </p>
        </>
      </Box>
    </OuterContainer>
  );
}

export default Fail;
