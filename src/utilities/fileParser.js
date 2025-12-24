export function storeFile(name, file, fileName) {
  if (!file) {
    localStorage.setItem(name, 'null');
    localStorage.setItem(name + 'name', 'null');
    return;
  }
  const reader = new FileReader();

  reader.onload = function (event) {
    // The result is the file data as a Base64 encoded string
    const base64String = event.target.result;

    // Store the string in localStorage with a key, e.g., 'storedFileData'
    localStorage.setItem(name, base64String);
    localStorage.setItem(name + 'name', fileName);
  };

  reader.onerror = function (error) {
    console.error('Error reading file: ', error);
  };

  // Read the file as a Data URL (Base64 string)
  reader.readAsDataURL(file);
}

export function retrieveFile(name) {
  // Get the stored Base64 string
  const base64DataUrl = localStorage.getItem(name);

  if (!base64DataUrl) {
    return null;
  }

  if (base64DataUrl === 'null') {
    return null;
  }

  const fileName = localStorage.getItem(name + 'name');
  const [meta, base64] = base64DataUrl.split(',');
  const mimeMatch = meta.match(/data:(.*?);base64/);

  const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';

  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new File([bytes], fileName, { type: mimeType });
}
