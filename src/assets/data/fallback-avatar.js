const FALLBACK_AVATAR =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
    <rect width="100%" height="100%" fill="#f3f4f6"/>
    <line x1="35" y1="35" x2="125" y2="125" stroke="#9ca3af" stroke-width="10" stroke-linecap="round"/>
    <line x1="125" y1="35" x2="35" y2="125" stroke="#9ca3af" stroke-width="10" stroke-linecap="round"/>
  </svg>
`);

export default FALLBACK_AVATAR;
