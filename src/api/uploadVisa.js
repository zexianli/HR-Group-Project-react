import { getAuthHeader } from './getToken';

export async function uploadVisa({ file, documentType }) {
  console.log('uploadVisa', documentType, file);

  if (!file || !documentType) return null;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('docType', documentType);

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/visa/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: getAuthHeader(),
    },
  });

  if (!res.ok) {
    throw new Error(`Upload failed: ${res.status}`);
  }

  const data = await res.json();
  return data.url || null;
}
