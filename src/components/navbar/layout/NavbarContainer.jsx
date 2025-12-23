function NavbarContainer({ children, padding = '24px' }) {
  return (
    <div
      style={{
        margin: '0 auto',
        padding,
      }}
    >
      {children}
    </div>
  );
}

export default NavbarContainer;
