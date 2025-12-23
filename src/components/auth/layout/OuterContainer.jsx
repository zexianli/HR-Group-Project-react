import { Container } from '@mui/material';

function OuterContainer({ children }) {
  return (
    <Container
      sx={{
        height: 'calc(100vh - 16px)',
        width: '100vw',
        display: 'flex',
        justifySelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </Container>
  );
}

export default OuterContainer;
