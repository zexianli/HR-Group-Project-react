/**
 * Fetch visa status data
 * @returns {Promise<Object|null>}
 */
import { getAuthHeader } from './getToken';
export async function visaStatus() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/employee/visa/status`, {
      method: 'GET',
      headers: {
        Authorization: getAuthHeader(),
      },
    });

    if (!res.ok) {
      throw new Error(`visaStatus failed: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error('visaStatus failed:', err);
    return null;
  }
}
