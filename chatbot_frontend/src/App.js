import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import './index.css';
import { api } from './services/api';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';

// PUBLIC_INTERFACE
function App() {
  /** Minimal theme handling aligned with the Ocean Professional palette */
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const [messages, setMessages] = useState([
    { id: 'sys-1', role: 'assistant', content: 'Welcome! Upload documents on the left and ask anything. I leverage RAG and multi-agent reasoning to help you.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [history, setHistory] = useState([]);
  const chatContainerRef = useRef(null);

  const canSend = useMemo(() => !isLoading, [isLoading]);

  // Load initial history (best-effort)
  useEffect(() => {
    let mounted = true;
    api.getConversations().then((list) => {
      if (mounted && Array.isArray(list)) setHistory(list);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  // PUBLIC_INTERFACE
  const handleSend = async (text) => {
    if (!text || !canSend) return;
    const userMsg = { id: `u-${Date.now()}`, role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    try {
      const reply = await api.sendMessage(text);
      const assistantMsg = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: reply?.answer ?? 'I could not generate a response.'
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      const errMsg = { id: `e-${Date.now()}`, role: 'assistant', content: 'There was a problem contacting the server.' };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }
  };

  // PUBLIC_INTERFACE
  const handleUploadFiles = async (files) => {
    if (!files || files.length === 0) return;
    const uploading = Array.from(files).map(f => ({ name: f.name, size: f.size }));
    setUploads(prev => [...prev, ...uploading]);
    try {
      await api.uploadDocuments(files);
    } catch (e) {
      // Upload error is displayed subtly by keeping UI calm
    }
  };

  // PUBLIC_INTERFACE
  const handleSelectHistory = async (convId) => {
    try {
      const conv = await api.getConversation(convId);
      if (conv?.messages) {
        setMessages(conv.messages.map((m, idx) => ({
          id: `${convId}-${idx}`,
          role: m.role,
          content: m.content
        })));
      }
    } catch (e) {
      // No-op on failure; keep existing messages
    }
  };

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className="app-root">
      <Header onToggleTheme={toggleTheme} theme={theme} />
      <div className="layout">
        <aside className="sidebar">
          <Sidebar
            uploads={uploads}
            history={history}
            onUpload={handleUploadFiles}
            onSelectHistory={handleSelectHistory}
          />
        </aside>
        <main className="main">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            containerRef={chatContainerRef}
          />
        </main>
      </div>
      <div className="input-bar">
        <MessageInput onSend={handleSend} disabled={!canSend} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default App;
