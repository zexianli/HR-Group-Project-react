import { useNavigate } from 'react-router';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '20px',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <h1 style={{ fontSize: '3rem', margin: 0 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Page Not Found</h2>
      <p style={{ color: '#666', maxWidth: '400px' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="button-group" style={{ marginTop: '20px' }}>
        <button className="btn-ghost" onClick={() => navigate(-1)}>
          Go Back
        </button>
        <button className="btn-primary" onClick={() => navigate('/')}>
          Go Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;
