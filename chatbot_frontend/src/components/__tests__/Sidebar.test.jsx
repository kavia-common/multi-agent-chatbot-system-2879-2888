import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sidebar from '../Sidebar';

function createFile(name, type = 'text/plain', content = 'hello') {
  return new File([content], name, { type });
}

describe('Sidebar', () => {
  test('smoke: renders documents and history sections', () => {
    render(<Sidebar uploads={[]} history={[]} onUpload={jest.fn()} onSelectHistory={jest.fn()} />);
    expect(screen.getByRole('heading', { name: /Documents/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /History/i })).toBeInTheDocument();
    expect(screen.getByText(/No conversations yet/i)).toBeInTheDocument();
  });

  test('clicking "Upload files" label opens file chooser and calls onUpload with files', async () => {
    const user = userEvent.setup();
    const onUpload = jest.fn();
    render(<Sidebar uploads={[]} history={[]} onUpload={onUpload} onSelectHistory={jest.fn()} />);

    // The input is hidden, but we can interact via the label
    const label = screen.getByLabelText(/Upload documents/i, { selector: 'input' });
    // Use the visible label to upload
    const visibleLabel = screen.getByText(/Upload files/i);

    const fileA = createFile('docA.txt');
    const fileB = createFile('docB.md', 'text/markdown', '# md');

    await user.upload(label, [fileA, fileB]);

    // The handler should be called with a FileList-like object; we can assert length via mock
    expect(onUpload).toHaveBeenCalledTimes(1);
    const filesArg = onUpload.mock.calls[0][0];
    expect(filesArg).toBeDefined();
    expect(filesArg.length).toBe(2);

    // The UI should show uploaded filenames list entries after parent state update,
    // but as Sidebar only renders props, we simulate by passing uploads prop.
    const { rerender } = render(<Sidebar uploads={[{ name: 'docA.txt' }, { name: 'docB.md' }]} history={[]} onUpload={onUpload} onSelectHistory={jest.fn()} />);
    const list = screen.getByRole('list', { name: '' }) || screen.getByRole('list');
    expect(within(list).getByText(/docA.txt/)).toBeInTheDocument();
    expect(within(list).getByText(/docB.md/)).toBeInTheDocument();

    // Also verify the visible label exists for manual clicking (smoke)
    expect(visibleLabel).toBeInTheDocument();
  });

  test('clicking a history item calls onSelectHistory with id', async () => {
    const user = userEvent.setup();
    const onSelectHistory = jest.fn();
    const history = [
      { id: 'conv-1', title: 'Conversation One' },
      { id: 'conv-2', title: 'Conversation Two' },
    ];

    render(<Sidebar uploads={[]} history={history} onUpload={jest.fn()} onSelectHistory={onSelectHistory} />);

    const item = screen.getByText(/Conversation One/i).closest('.item');
    expect(item).toBeInTheDocument();

    await user.click(item);
    expect(onSelectHistory).toHaveBeenCalledWith('conv-1');
  });
});
