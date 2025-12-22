import { Grid } from '@mui/material';
import { Container } from '@mui/material';
import OuterContainer from './OuterContainer';

function FormLayout({ children, header, additionalMessage }) {
  console.log('Helllo');
  return (
    <>
      <OuterContainer>
        <Grid
          container
          sx={{
            backgroundColor: 'white',
            width: 'fit-content',
            border: 'solid 1px #abcdcf',
            borderRadius: '10px',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) ',
          }}
        >
          <Grid size={4} sx={{ padding: '30px' }}>
            <img
              src="https://media.licdn.com/dms/image/v2/C560BAQEgZyD0JY8dTA/company-logo_200_200/company-logo_200_200/0/1630645938186?e=2147483647&v=beta&t=8e3vgpblR4anayWp8iW0v-hFsp7Y6RdSCORHB9r18-k"
              alt="beaconfire"
              style={{ width: '100px', height: '100px' }}
            />
            <p
              style={{ fontWeight: '500', fontSize: '40px', marginTop: '20px', marginBottom: '0' }}
            >
              {header}
            </p>
            {additionalMessage && (
              <p style={{ fontFamily: 'Roboto, sans-serif', lineHeight: '22px' }}>
                {additionalMessage}
              </p>
            )}
          </Grid>
          <Grid size={8} sx={{ padding: '40px', paddingTop: '140px' }}>
            {children}
          </Grid>
        </Grid>
      </OuterContainer>
    </>
  );
}

export default FormLayout;
