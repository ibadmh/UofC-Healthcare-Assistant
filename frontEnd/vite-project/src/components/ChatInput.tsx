import React, { useState } from 'react';

export default function ChatInput({ onSend, disabled }: { onSend: (text: string) => void | Promise<void>; disabled?: boolean }) {
  const [text, setText] = useState('');

  const submit = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText('');
    await onSend(trimmed);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
      <input
        style={{
          flex: 1,
          maxWidth: '100%',
          backgroundColor: '#fef2f7',
          border: 'none',
          borderRadius: '24px',
          padding: '12px 16px',
          fontSize: '14px',
          color: '#1f2937',
          placeholder: '#9ca3af',
          outline: 'none',
          transition: 'all 0.2s ease'
        }}
        placeholder="Ask me anything..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        onFocus={(e) => {
          e.target.style.backgroundColor = '#ffffff';
        }}
        onBlur={(e) => {
          e.target.style.backgroundColor = '#fef2f7';
        }}
        disabled={disabled}
      />
      <button
        style={{
          padding: '12px 24px',
          background: 'linear-gradient(90deg, #ffe6f4 0%, #fff3f7 100%)',
          color: '#1f1220',
          border: '2px solid rgba(200,100,120,0.16)',
          borderRadius: '24px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          transition: 'all 0.15s ease',
          boxShadow: '0 4px 10px rgba(200,100,120,0.08)'
        }}
        onClick={submit}
        onMouseEnter={(e) => !disabled && (e.currentTarget.style.filter = 'brightness(0.98)')}
        onMouseLeave={(e) => !disabled && (e.currentTarget.style.filter = 'none')}
        disabled={disabled}
      >
        {disabled ? '...' : 'Send'}
      </button>
    </div>
  );
}
