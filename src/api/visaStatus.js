/**
 * Fetch visa status data
 * @returns {Promise<Object|null>}
 */
export async function visaStatus() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/employee/visa/status`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_MOCK_TOKEN}`,
      },
    });

    if (!res.ok) {
      throw new Error(`visaStatus failed: ${res.status}`);
    }

    return await res.json(); // ✅ return FULL object
  } catch (err) {
    console.error('visaStatus failed:', err);
    return null;
  }
}
