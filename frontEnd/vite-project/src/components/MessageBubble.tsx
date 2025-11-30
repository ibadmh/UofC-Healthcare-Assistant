import React, { useEffect, useState } from 'react';
import type { Message } from '../types/chat';

type Props = { message: Message; index?: number };

export default function MessageBubble({ message, index = 0 }: Props) {
  const isUser = message.role === 'user';

  const avatarLabel = isUser ? 'You' : 'HC';

  const animationStyle: React.CSSProperties = {
    animationDelay: `${index * 35}ms`
  };

  const [displayText, setDisplayText] = useState<string>(isUser ? message.text : '');

  useEffect(() => {
    let mounted = true;
    const full = message.text ?? '';

    if (message.role === 'assistant') {
      setDisplayText('');
      // Adjust delay so longer messages type a bit faster overall
      const delay = Math.max(6, Math.floor(700 / Math.max(1, full.length)));
      let i = 0;
      const id = setInterval(() => {
        if (!mounted) return;
        i += 1;
        setDisplayText(full.slice(0, i));
        if (i >= full.length) clearInterval(id);
      }, delay);

      return () => {
        mounted = false;
        clearInterval(id);
      };
    }

    // for user or other roles, render immediately
    setDisplayText(full);

    return () => {
      mounted = false;
    };
  }, [message.text, message.role]);

  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div className="msg-row" style={{ width: '100%', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
        {!isUser && (
          <div className="msg-avatar" style={{ background: '#fde8f2', color: '#7b1646' }} aria-hidden>
            🤖
          </div>
        )}

        <div
          className="msg"
          style={{
            maxWidth: '72%',
            background: isUser ? 'linear-gradient(90deg,#ffd7e6,#ffb7d0)' : 'white',
            color: isUser ? '#33051a' : '#111827',
            padding: '12px 14px',
            borderRadius: 14,
            boxShadow: '0 6px 18px rgba(16,24,40,0.06)',
            border: '1px solid rgba(16,24,40,0.04)',
            ...animationStyle
          }}
        >
          <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{displayText}</div>
        </div>

        {isUser && (
          <div className="msg-avatar" style={{ background: '#ffd7e6', color: '#33051a' }} aria-hidden>
            {avatarLabel}
          </div>
        )}
      </div>
    </div>
  );
}
