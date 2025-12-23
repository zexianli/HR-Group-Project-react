import { useState } from 'react';

function NavbarText({ variant = 'body', children, style = {}, hoverable = false }) {
  const [hover, setHover] = useState(false);

  const baseStyle = {
    fontFamily: `'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif`,
    color: '#111827',
    margin: 0,
    transition: 'color 0.2s ease',
  };

  const variants = {
    h1: { fontSize: '28px', fontWeight: 700 },
    h2: { fontSize: '22px', fontWeight: 600 },
    h3: { fontSize: '18px', fontWeight: 600 },
    body: { fontSize: '15px', color: '#374151' },
    caption: { fontSize: '13px', color: '#6b7280' },
  };

  const Tag = variant.startsWith('h') ? variant : 'p';

  return (
    <Tag
      onMouseEnter={() => hoverable && setHover(true)}
      onMouseLeave={() => hoverable && setHover(false)}
      style={{
        ...baseStyle,
        ...variants[variant],
        ...(hover && hoverable ? { color: '#2563eb', cursor: 'pointer' } : {}),
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

export default NavbarText;
