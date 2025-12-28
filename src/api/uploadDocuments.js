/**
 * Upload a file to backend and return its URL
 *
 * @param {File} file
 * @param {string} docType - e.g. 'avatar', 'resume', 'ead'
 * @returns {Promise<string | null>}
 */
import { getAuthHeader } from './getToken';
export async function uploadDocuments(file, docType) {
  if (!file || !docType) return null;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('docType', docType);

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: getAuthHeader(),
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
