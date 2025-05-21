import React from 'react';
import ReactMarkdown from 'react-markdown';

const ChatMessage = ({ message, isLoading }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] p-4 rounded-lg ${
          isUser
            ? 'bg-primary text-white rounded-tr-none'
            : 'bg-white border border-gray-200 shadow-sm rounded-tl-none'
        }`}
      >
        {isLoading ? (
          <div className="flex space-x-2 justify-center items-center h-6">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        ) : (
          <div className={`prose ${isUser ? 'text-white' : 'text-gray-800'}`}>
            {isUser ? (
              <p className="m-0 whitespace-pre-wrap break-words">{message.content}</p>
            ) : (
              <ReactMarkdown className="m-0 whitespace-pre-wrap break-words">
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;