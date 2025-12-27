/**
 * Upload a file to backend and return its URL
 *
 * @param {File} file
 * @param {string} docType - e.g. 'avatar', 'resume', 'ead'
 * @returns {Promise<string | null>}
 */
export async function uploadVisa(file, docType) {
  if (!file || !docType) return null;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('docType', docType);

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/visa/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_MOCK_TOKEN}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Upload failed: ${res.status}`);
    }

    const data = await res.json(); // { url: string }
    return data.url || null;
  } catch (err) {
    console.error('uploadFile failed:', err);
    return null;
  }
}
