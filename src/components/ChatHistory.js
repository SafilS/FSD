import React, { useState, useEffect } from 'react';
import { chatService } from '../services/api';

function ChatHistory({ onSelectSession, currentSessionId }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch all chat sessions
  const fetchSessions = async () => {
    try {
      setLoading(true);
      console.log('Fetching chat sessions...');
      const data = await chatService.getAllSessions();
      console.log('Received sessions:', data);
      
      // Filter out sessions with no messages
      const nonEmptySessions = Array.isArray(data) 
        ? data.filter(session => session.messageCount > 0)
        : [];
        
      setSessions(nonEmptySessions);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch chat history:', err);
      setError('Failed to load chat history. Please try refreshing.');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  // Load sessions on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchSessions();
    
    // Set up a refresh interval (every 30 seconds)
    const intervalId = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [refreshTrigger]);

  // Format date to a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // If it's today, show the time
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
      })}`;
    }
    // If it's yesterday, show "Yesterday"
    else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
      })}`;
    }
    // Otherwise show the date
    else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  // Create a new chat session
  const handleNewChat = async () => {
    try {
      const response = await chatService.createSession();
      await fetchSessions(); // Refresh the list
      onSelectSession(response.sessionId);
    } catch (err) {
      console.error('Failed to create new chat:', err);
      setError('Failed to create new chat');
    }
  };
  
  // Get a better preview from the session
  const getPreview = (session) => {
    if (!session.preview || session.preview === 'Empty conversation') {
      return 'No messages';
    }
    
    // Clean up the preview text
    let preview = session.preview
      .replace(/^[#*`_~]+/, '') // Remove markdown at the beginning
      .trim();
      
    return preview;
  };

  return (
    <div className="bg-gray-100 p-4 h-full overflow-auto">
      <div className="mb-4">
        <button 
          onClick={handleNewChat}
          className="w-full bg-gray-900 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded"
        >
          New Chat
        </button>
      </div>

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Chat History</h2>
        <button 
          onClick={() => setRefreshTrigger(prev => prev + 1)}
          className="text-gray-900 hover:text-gray-800 text-sm"
          title="Refresh chat history"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-pulse">Loading chat history...</div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-2">{error}</div>
      ) : sessions.length === 0 ? (
        <div className="text-gray-500 text-center py-4">
          <p>No chat history found</p>
          <p className="text-sm mt-2">Start a new conversation to see it here</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {sessions.map(session => (
            <li 
              key={session.id}
              className={`p-3 rounded cursor-pointer transition-colors ${
                currentSessionId === session.id 
                  ? 'bg-blue-100 border-l-4 border-blue-500' 
                  : 'hover:bg-gray-200'
              }`}
              onClick={() => onSelectSession(session.id)}
            >
              <div className="font-medium truncate">{session.title}</div>
              <div className="text-sm text-gray-500 truncate">{getPreview(session)}</div>
              <div className="text-xs text-gray-400 mt-1 flex justify-between">
                <span>{formatDate(session.updatedAt)}</span>
                <span>{session.messageCount} message{session.messageCount !== 1 ? 's' : ''}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ChatHistory;