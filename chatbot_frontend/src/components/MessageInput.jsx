import React, { useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * Message input fixed at the bottom with send action.
 * Props:
 * - onSend: (text: string) => Promise<void> | void
 * - disabled: boolean
 * - isLoading: boolean
 */
export default function MessageInput({ onSend, disabled = false, isLoading = false }) {
  const [text, setText] = useState('');

  const send = () => {
    const value = text.trim();
    if (!value || disabled) return;
    onSend?.(value);
    setText('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="input-wrap">
      <textarea
        className="input-field"
        placeholder="Type your message..."
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        aria-label="Message input"
        disabled={disabled}
      />
      <button
        className="btn btn-primary"
        type="button"
        onClick={send}
        disabled={disabled}
        aria-disabled={disabled}
      >
        {isLoading ? 'Sending…' : 'Send'}
      </button>
    </div>
  );
}
