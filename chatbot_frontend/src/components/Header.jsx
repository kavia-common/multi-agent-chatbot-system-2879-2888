import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Header component with branding and theme toggle.
 * Props:
 * - theme: 'light' | 'dark'
 * - onToggleTheme: () => void
 */
export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="header">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true" />
        <div className="brand-title">Multi‑Agent Chatbot</div>
      </div>
      <div className="header-actions">
        <button className="btn btn-ghost" type="button" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>
        <a className="btn" href="https://reactjs.org" target="_blank" rel="noreferrer">Docs</a>
      </div>
    </header>
  );
}
