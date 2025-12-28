const EMPLOYEE_ME_URL = `${import.meta.env.VITE_API_BASE_URL}/employees/me`;
import { getAuthHeader } from './getToken';

export async function getEmployeeProfile() {
  const res = await fetch(EMPLOYEE_ME_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthHeader(),
    },
  });

  if (!res.ok) {
    throw new Error('Failed to load employee profile');
  }

  return res.json();
}

export async function updateEmployeeProfile(payload) {
  const res = await fetch(EMPLOYEE_ME_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to update employee profile');
  }

  return res.json();
}
