/**
 * Fetch preview URL for a document type
 * @param {string} docType - e.g. 'avatar', 'resume', 'ead'
 * @returns {Promise<string | null>}
 */
import { getAuthHeader } from './getToken';
export async function previewDocumentsByType(docType) {
  if (!docType) return null;

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/preview-url?docType=${encodeURIComponent(docType)}`,
      {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      }
    );

    if (!res.ok) return null;

    const data = await res.json(); // { url: string }
    return data.url || null;
  } catch (err) {
    console.error('fetchPreviewUrl failed:', err);
    return null;
  }
}

export async function previewTheWholeDocuments() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employee/visa/documents`, {
      method: 'GET',
      headers: {
        Authorization: getAuthHeader(),
      },
    });

    if (!res.ok) return null;

    const response = await res.json(); // { url: string }
    return response.data || null;
  } catch (err) {
    console.error('fetchPreviewUrl failed:', err);
    return null;
  }
}
