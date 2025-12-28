import { NavLink, useNavigate } from 'react-router-dom';
import NavbarContainer from './layout/NavbarContainer';
import NavbarButton from './layout/NavbarButton';
import NavbarText from './layout/NavbarText';

function OnboardNavBar() {
  const navigate = useNavigate();

  const navItems = [
    { label: 'Personal Information', path: '/personal' },
    { label: 'Visa Status Management', path: '/visa' },
    { label: 'Housing Information', path: '/housing' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login', { replace: true });
  };

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
    >
      <NavbarContainer>
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Left: Navigation */}
          <div style={{ display: 'flex', gap: '32px' }}>
            {navItems.map(({ label, path }) => (
              <NavLink key={path} to={path} style={{ textDecoration: 'none' }}>
                {({ isActive }) => (
                  <div style={{ position: 'relative' }}>
                    <NavbarText
                      hoverable
                      active={isActive}
                      style={{
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {label}
                    </NavbarText>

                    {/* Active underline */}
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        bottom: -10,
                        width: '100%',
                        height: '3px',
                        borderRadius: '2px',
                        backgroundColor: '#2563eb',
                        transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                        transformOrigin: 'left',
                        transition: 'transform 0.25s ease',
                      }}
                    />
                  </div>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right: Action */}
          <NavbarButton
            variant="secondary"
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </NavbarButton>
        </nav>
      </NavbarContainer>
    </div>
  );
}

export default OnboardNavBar;
