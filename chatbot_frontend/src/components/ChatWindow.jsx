import React from 'react';

/**
 * PUBLIC_INTERFACE
 * ChatWindow renders a scrollable list of messages.
 * Props:
 * - messages: Array<{id: string, role: 'user'|'assistant'|'system', content: string}>
 * - isLoading: boolean
 * - containerRef: Ref<HTMLDivElement>
 */
export default function ChatWindow({ messages = [], isLoading = false, containerRef }) {
  return (
    <div ref={containerRef} className="chat-container" aria-live="polite">
      {messages.map((m) => (
        <div key={m.id} className={`message ${m.role}`}>
          {m.content}
        </div>
      ))}
      {isLoading && (
        <div className="message assistant">
          <span className="loading">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
            Thinking…
          </span>
        </div>
      )}
    </div>
  );
}
