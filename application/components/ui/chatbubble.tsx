import React from 'react';

interface ChatBubbleProps {
  text: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ text }) => {
  return (
    <div className="chat chat-end">
      <div className="chat-bubble">{text}</div>
    </div>
  );
};

export default ChatBubble;
