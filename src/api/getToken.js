export function getAuthHeader() {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Auth token not found in localStorage');
  }

  return `Bearer ${token}`;
}
