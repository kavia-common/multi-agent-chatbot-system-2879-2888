const BASE_URL = process.env.REACT_APP_BACKEND_URL || '/api';

/**
 * PUBLIC_INTERFACE
 * sendMessage posts a user query to the backend.
 * Expects backend to return { answer: string, conversationId?: string }.
 */
async function sendMessage(message) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
}

/**
 * PUBLIC_INTERFACE
 * uploadDocuments uploads files as multipart/form-data.
 * Expects backend to accept 'files' array field.
 */
async function uploadDocuments(files) {
  const form = new FormData();
  Array.from(files).forEach((f) => form.append('files', f, f.name));
  const res = await fetch(`${BASE_URL}/documents/upload`, {
    method: 'POST',
    body: form
  });
  if (!res.ok) throw new Error('Failed to upload documents');
  return res.json();
}

/**
 * PUBLIC_INTERFACE
 * getConversations retrieves conversation history list.
 * Expected response: Array<{ id: string, title?: string }>
 */
async function getConversations() {
  const res = await fetch(`${BASE_URL}/conversations`, { method: 'GET' });
  if (!res.ok) return [];
  return res.json();
}

/**
 * PUBLIC_INTERFACE
 * getConversation retrieves a specific conversation.
 * Expected response: { id: string, messages: Array<{ role, content }> }
 */
async function getConversation(id) {
  const res = await fetch(`${BASE_URL}/conversations/${id}`, { method: 'GET' });
  if (!res.ok) throw new Error('Failed to load conversation');
  return res.json();
}

export const api = {
  sendMessage,
  uploadDocuments,
  getConversations,
  getConversation
};
