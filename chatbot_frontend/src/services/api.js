/**
 * Resolve the API base URL in this order:
 * 1) REACT_APP_BACKEND_URL (recommended for production)
 * 2) '/api' (works with CRA dev proxy and same-origin deployments)
 */
function getBaseUrl() {
  const envUrl = process.env.REACT_APP_BACKEND_URL && process.env.REACT_APP_BACKEND_URL.trim();
  if (envUrl) return envUrl.replace(/\/+$/, ''); // strip trailing slash
  return '/api';
}

const BASE_URL = getBaseUrl();

// Small helper to add a timeout to fetch for better UX and diagnostics.
async function fetchWithTimeout(resource, options = {}, timeoutMs = 20000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(resource, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

// PUBLIC_INTERFACE
async function sendMessage(message) {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      // Include credentials same-origin; adjust if backend uses cookies across origins.
      credentials: 'same-origin',
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Failed to send message: ${res.status} ${res.statusText} ${text}`.trim());
    }
    return res.json();
  } catch (err) {
    // Log more context to help debugging (visible in browser console).
    // Common causes: wrong REACT_APP_BACKEND_URL, backend not running, CORS, or network.
    // eslint-disable-next-line no-console
    console.error('sendMessage error:', { baseUrl: BASE_URL, error: err });
    throw err;
  }
}

// PUBLIC_INTERFACE
async function uploadDocuments(files) {
  const form = new FormData();
  Array.from(files).forEach((f) => form.append('files', f, f.name));
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/documents/upload`, {
      method: 'POST',
      body: form,
      credentials: 'same-origin',
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Failed to upload documents: ${res.status} ${res.statusText} ${text}`.trim());
    }
    return res.json();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('uploadDocuments error:', { baseUrl: BASE_URL, error: err });
    throw err;
  }
}

// PUBLIC_INTERFACE
async function getConversations() {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/conversations`, { method: 'GET', credentials: 'same-origin' });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('getConversations error:', { baseUrl: BASE_URL, error: err });
    return [];
  }
}

// PUBLIC_INTERFACE
async function getConversation(id) {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/conversations/${id}`, { method: 'GET', credentials: 'same-origin' });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Failed to load conversation: ${res.status} ${res.statusText} ${text}`.trim());
    }
    return res.json();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('getConversation error:', { baseUrl: BASE_URL, error: err });
    throw err;
  }
}

export const api = {
  sendMessage,
  uploadDocuments,
  getConversations,
  getConversation
};
