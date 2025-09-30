import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../Header';

describe('Header', () => {
  test('smoke: renders brand title', () => {
    render(<Header theme="light" onToggleTheme={() => {}} />);
    expect(screen.getByText(/Multi‑Agent Chatbot/i)).toBeInTheDocument();
  });

  test('shows correct theme button text and toggles on click', async () => {
    const user = userEvent.setup();
    const onToggleTheme = jest.fn();
    const { rerender } = render(<Header theme="light" onToggleTheme={onToggleTheme} />);
    const toggleBtn = screen.getByRole('button', { name: /toggle theme/i });

    // When light theme, shows "Dark mode"
    expect(screen.getByText(/Dark mode/i)).toBeInTheDocument();

    await user.click(toggleBtn);
    expect(onToggleTheme).toHaveBeenCalledTimes(1);

    // Rerender as dark theme to verify text changes
    rerender(<Header theme="dark" onToggleTheme={onToggleTheme} />);
    expect(screen.getByText(/Light mode/i)).toBeInTheDocument();
  });
});
