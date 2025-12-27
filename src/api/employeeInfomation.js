const EMPLOYEE_ME_URL = `${import.meta.env.VITE_API_BASE_URL}/api/employees/me`;

export async function getEmployeeProfile() {
  const res = await fetch(EMPLOYEE_ME_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_API_MOCK_TOKEN}`,
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
      Authorization: `Bearer ${import.meta.env.VITE_API_MOCK_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to update employee profile');
  }

  return res.json();
}
