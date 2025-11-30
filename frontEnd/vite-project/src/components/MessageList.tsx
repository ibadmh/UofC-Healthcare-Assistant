import React from 'react';
import type { Message } from '../types/chat';
import MessageBubble from './MessageBubble';

export default function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div 
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px 8px', /* top/bottom 24, right/left 8 to keep scrollbar near edge */
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
      id="message-list"
    >
      {messages.map((m, i) => (
        <MessageBubble key={m.id} message={m} index={i} />
      ))}
    </div>
  );
}
