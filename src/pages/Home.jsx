import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import ProtectedRoute from '../components/ProtectedRoute';

function Home() {
  // login
  // already logged in: go to personal
  // to do this, useEffect
  // in the useEffect, check user and token (to know whether they are logged in or not)
  return (
    <ProtectedRoute>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          height: '100vh',
        }}
      >
        <CircularProgress size={100} />
        {/* Hello World */}
      </Box>
    </ProtectedRoute>
  );
}

export default Home;
