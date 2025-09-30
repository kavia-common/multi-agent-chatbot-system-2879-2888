import React, { useRef } from 'react';

/**
 * PUBLIC_INTERFACE
 * Sidebar for uploading documents and viewing conversation history.
 * Props:
 * - uploads: Array<{name: string, size?: number}>
 * - history: Array<{id: string, title?: string}>
 * - onUpload: (FileList) => Promise<void> | void
 * - onSelectHistory: (id: string) => Promise<void> | void
 */
export default function Sidebar({ uploads = [], history = [], onUpload, onSelectHistory }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && onUpload) onUpload(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      <div className="section">
        <h4>Documents</h4>
        <div className="upload-drop">
          <input
            ref={fileInputRef}
            id="doc-upload"
            type="file"
            multiple
            onChange={handleFileChange}
            aria-label="Upload documents"
          />
          <label htmlFor="doc-upload" className="upload-label">Upload files</label>
          <div className="muted" style={{ marginTop: 8 }}>PDF, TXT, MD</div>
        </div>
        <ul className="upload-list">
          {uploads.map((u, idx) => (
            <li className="item" key={`${u.name}-${idx}`}>
              <span title={u.name} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{u.name}</span>
              {typeof u.size === 'number' ? <span className="muted">{Math.ceil(u.size / 1024)} KB</span> : null}
            </li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h4>History</h4>
        <ul className="history-list">
          {history.length === 0 && <li className="muted">No conversations yet</li>}
          {history.map((h) => (
            <li key={h.id} className="item" role="button" onClick={() => onSelectHistory?.(h.id)}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
                {h.title || `Conversation ${h.id.slice(0, 6)}`}
              </span>
              <span className="muted">Open</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
