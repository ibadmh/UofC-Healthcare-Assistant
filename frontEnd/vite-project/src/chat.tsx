import React, { useEffect, useRef, useState } from 'react';
import { sendMessage } from './api/chat';
import type { Message } from './types/chat';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import './styles/chat.css';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // optional welcome message
    setMessages([
      { id: 'm-welcome', role: 'assistant', text: 'Hi — I am UHealth Friend. How can I help you today?' },
    ]);
  }, []);

  useEffect(() => {
    // auto-scroll to bottom when messages change
    const el = document.getElementById('message-list');
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setIsSending(true);
    try {
      const res = await sendMessage(text);

      // Backend returns { reply, intent, resources, conversationHistory }
      // Fallback for older/mock responses that use `text`
      let replyText = 'Sorry, I had no reply.';
      if (!res) {
        replyText = 'No response from server.';
      } else if (res.error) {
        // If backend returned an error object, show a friendly message
        replyText = typeof res.error === 'string' ? res.error : 'Server error';
      } else {
        replyText = res.reply ?? res.text ?? replyText;
      }

      const botMsg: Message = {
        id: `b-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        resources: res?.resources,
      };

      setMessages((m) => [...m, botMsg]);
    } catch (err: any) {
      const errMsg: Message = { id: `e-${Date.now()}`, role: 'assistant', text: err?.message ?? 'There was an error sending your message.' };
      setMessages((m) => [...m, errMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div 
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(to bottom, #ffe6f4 0%, #fff3f7 50%, #fff9fb 100%)',
        boxSizing: 'border-box',
        padding: '0 32px 48px'
      }}
    >
      {/* Top Menu Bar (transparent, continues page gradient) */}
      <div style={{
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h1 style={{
          fontFamily: "'Open Sans', sans-serif",
          fontSize: '20px',
          fontWeight: '600',
          color: '#c85a75',
          margin: '0'
        }}>HealthConnect</h1>
      </div>

      {/* Messages container - scrollable */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
        padding: '24px 16px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '42rem',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <MessageList messages={messages} />
        </div>
      </div>

      {/* Input at bottom - centered */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'transparent'
      }}>
        <div style={{ width: '100%', maxWidth: '42rem' }}>
          <ChatInput onSend={handleSend} disabled={isSending} />
        </div>
      </div>
    </div>
  );
}
