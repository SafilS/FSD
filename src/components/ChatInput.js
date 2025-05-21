import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';

const ChatInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={disabled}
        placeholder={disabled ? 'Please wait...' : 'Type your message here...'}
        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full ${
          !message.trim() || disabled ? 'bg-gray-900 cursor-not-allowed' : 'bg-primary hover:bg-secondary'
        }`}
      >
        <FiSend size={18} />
      </button>
    </form>
  );
};

export default ChatInput;