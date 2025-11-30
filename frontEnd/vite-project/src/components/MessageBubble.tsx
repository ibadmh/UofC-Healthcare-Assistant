import React from 'react';
import type { Message } from '../types/chat';

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div
        style={{
          maxWidth: '70%',
          padding: '12px 16px',
          borderRadius: '16px',
          fontSize: '14px',
          lineHeight: '1.5',
          backgroundColor: isUser ? '#ffffff' : '#ffffff',
          color: '#1f2937',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
          border: isUser ? '2px solid #fbd4e3' : '2px solid #f3e8f3'
        }}
      >
        {message.text}
      </div>
    </div>
  );
}
