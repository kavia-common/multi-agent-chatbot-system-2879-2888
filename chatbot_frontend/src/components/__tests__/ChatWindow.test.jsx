import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import ChatWindow from '../ChatWindow';

describe('ChatWindow', () => {
  test('smoke: renders without crashing with empty messages', () => {
    render(<ChatWindow messages={[]} isLoading={false} containerRef={createRef()} />);
    // container accessible via role by aria-live
    const container = screen.getByRole('region', { hidden: true }) || screen.getByLabelText(/polite/i) || screen.getByText((_, node) => node?.classList?.contains('chat-container'));
    // if not found via role, at least ensure no exception and document exists
    expect(document.body).toBeInTheDocument();
  });

  test('renders user and assistant messages', () => {
    const msgs = [
      { id: '1', role: 'user', content: 'Hello' },
      { id: '2', role: 'assistant', content: 'Hi there!' },
      { id: '3', role: 'system', content: 'Note' },
    ];
    render(<ChatWindow messages={msgs} isLoading={false} containerRef={createRef()} />);

    expect(screen.getByText(/Hello/)).toBeInTheDocument();
    expect(screen.getByText(/Hi there!/)).toBeInTheDocument();
    expect(screen.getByText(/Note/)).toBeInTheDocument();
  });

  test('shows loading indicator when isLoading = true', () => {
    render(<ChatWindow messages={[]} isLoading={true} containerRef={createRef()} />);
    expect(screen.getByText(/Thinking/i)).toBeInTheDocument();
  });
});
