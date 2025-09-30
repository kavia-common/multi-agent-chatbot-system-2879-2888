import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MessageInput from '../MessageInput';

describe('MessageInput', () => {
  test('smoke: renders textarea and send button', () => {
    render(<MessageInput onSend={() => {}} />);
    expect(screen.getByLabelText(/Message input/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send/i })).toBeInTheDocument();
  });

  test('allows typing and sends on click', async () => {
    const user = userEvent.setup();
    const onSend = jest.fn();

    render(<MessageInput onSend={onSend} disabled={false} isLoading={false} />);
    const input = screen.getByLabelText(/Message input/i);
    await user.type(input, 'Hello world');
    await user.click(screen.getByRole('button', { name: /Send/i }));

    expect(onSend).toHaveBeenCalledWith('Hello world');
  });

  test('sends on Enter key (without Shift), clears input', async () => {
    const user = userEvent.setup();
    const onSend = jest.fn();

    render(<MessageInput onSend={onSend} disabled={false} isLoading={false} />);
    const input = screen.getByLabelText(/Message input/i);
    await user.type(input, 'Line1');
    await user.keyboard('{Enter}');

    expect(onSend).toHaveBeenCalledWith('Line1');
    // Ensure cleared
    expect(input).toHaveValue('');
  });

  test('does not send when disabled', async () => {
    const user = userEvent.setup();
    const onSend = jest.fn();

    render(<MessageInput onSend={onSend} disabled={true} isLoading={false} />);
    const input = screen.getByLabelText(/Message input/i);
    await user.type(input, 'Should not send');
    await user.click(screen.getByRole('button', { name: /Send/i }));

    expect(onSend).not.toHaveBeenCalled();
  });

  test('send button shows "Sending…" when isLoading', () => {
    render(<MessageInput onSend={() => {}} disabled={true} isLoading={true} />);
    expect(screen.getByRole('button', { name: /Sending/i })).toBeInTheDocument();
  });
});
