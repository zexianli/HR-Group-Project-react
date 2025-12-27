import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import ProtectedRoute from '../components/ProtectedRoute';

function Home() {
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
