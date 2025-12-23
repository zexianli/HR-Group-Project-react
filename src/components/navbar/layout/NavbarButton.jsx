import { useState } from 'react';

function NavbarButton({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  onClick,
  style = {},
}) {
  const [hover, setHover] = useState(false);

  const variants = {
    primary: {
      backgroundColor: '#2563eb',
      color: '#ffffff',
    },
    secondary: {
      backgroundColor: '#ffffff',
      color: '#2563eb',
      border: '1px solid #2563eb',
    },
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => !disabled && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '10px 18px',
        fontSize: '14px',
        fontWeight: 600,
        borderRadius: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: disabled ? 0.6 : 1,
        transform: hover ? 'translateY(-1px)' : 'translateY(0)',
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export default NavbarButton;
