import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import Header from './components/Header';
import ChatHistory from './components/ChatHistory';
import { chatService } from './services/api';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showLogin, setShowLogin] = useState(false); // <-- changed to false
  const [authLoading, setAuthLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Authentication handlers
  const handleLogin = async ({ email, password }) => {
    setAuthLoading(true);
    try {
      // Simulate login success (replace with real API call)
      setIsAuthenticated(true);
      setShowLogin(false);
    } catch (err) {
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setAuthLoading(true);
    try {
      // Simulate registration success (replace with real API call)
      setIsAuthenticated(true);
      setShowLogin(false);
    } catch (err) {
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLogin(true);
    setSessionId(null);
    setMessages([]);
  };

  const switchToRegister = () => setShowLogin(false);
  const switchToLogin = () => setShowLogin(true);

  // Initialize chat session
  useEffect(() => {
    // Always initialize a session, regardless of authentication
    const initializeSession = async () => {
      try {
        const response = await chatService.createSession();
        setSessionId(response.sessionId);
      } catch (err) {
        console.error('Failed to initialize chat session:', err);
        setError('Failed to connect to the chat server. Please try again.');
      }
    };
    initializeSession();
  }, []); // <-- only run once on mount

  // Load messages when session changes
  useEffect(() => {
    const loadSessionMessages = async () => {
      if (!sessionId) return;
      
      try {
        setLoading(true);
        setError(null);
        console.log(`Loading messages for session: ${sessionId}`);
        
        const session = await chatService.getSession(sessionId);
        
        if (session && session.messages) {
          console.log(`Loaded ${session.messages.length} messages`);
          setMessages(session.messages);
        } else {
          console.log('No messages found in session');
          setMessages([]);
        }
      } catch (err) {
        console.error('Failed to load session messages:', err);
        setError('Failed to load chat messages.');
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    loadSessionMessages();
  }, [sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message) => {
    if (!message.trim() || !sessionId) return;

    try {
      // Add user message immediately
      setMessages([...messages, { role: 'user', content: message }]);
      setLoading(true);
      setError(null);

      // Create a placeholder for bot response
      const placeholderIndex = messages.length + 1;
      setMessages(prev => [...prev, { role: 'bot', content: '', loading: true }]);

      // First, send the message to the backend to store it
      await chatService.sendMessage(sessionId, message);

      // Then, open EventSource for SSE (GET request, no headers/body)
      const eventSource = new EventSource(`/api/chat/session/${sessionId}/message/stream?message="${encodeURIComponent(message)}"`);

      let fullResponse = '';

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.error) {
          setError(data.error);
          eventSource.close();
          setLoading(false);
          return;
        }
        
        if (data.done) {
          eventSource.close();
          setLoading(false);
          return;
        }
        
        if (data.chunk) {
          fullResponse += data.chunk;
          setMessages(prev => {
            const updated = [...prev];
            updated[placeholderIndex] = { 
              role: 'bot', 
              content: fullResponse,
              loading: false
            };
            return updated;
          });
        }
      };

      eventSource.onerror = (err) => {
        console.error('EventSource error:', err);
        eventSource.close();
        setError('Connection error. Please try again.');
        setLoading(false);
      };

    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (!sessionId) return;
    
    try {
      await chatService.clearSession(sessionId);
      setMessages([]);
    } catch (err) {
      console.error('Failed to clear chat history:', err);
      setError('Failed to clear chat history. Please try again.');
    }
  };

  const handleSelectSession = (id) => {
    setSessionId(id);
    if (window.innerWidth < 768) {
      setShowSidebar(false); 
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex h-screen bg-light">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'block' : 'hidden'} md:block w-full md:w-80 lg:w-96 h-screen overflow-auto border-r border-gray-200`}>
        <ChatHistory 
          onSelectSession={handleSelectSession} 
          currentSessionId={sessionId}
          isAuthenticated={isAuthenticated}
        />
      </div>
      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 h-screen">
        <Header 
          onClear={handleClearChat} 
          onToggleSidebar={toggleSidebar}
          showSidebarButton={isAuthenticated} // Only show sidebar button if authenticated
          onLogout={handleLogout}
          isAuthenticated={isAuthenticated}
          onLoginClick={() => { setShowLogin(true); }}
        />
        <div className="flex-1 overflow-auto px-4 py-4">
          <div className="max-w-3xl mx-auto break-words whitespace-pre-wrap">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <h2 className="text-2xl font-bold mb-2">Welcome to your chat space</h2>
                  <p>Ask me anything to start a conversation!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <ChatMessage 
                    key={index} 
                    message={msg} 
                    isLoading={msg.loading}
                  />
                ))}
                {error && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              disabled={loading || !sessionId}
            />
          </div>
        </div>
      </div>
      {/* Login/Register Modal */}
      {showLogin && !isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <Login onLogin={handleLogin} switchToRegister={switchToRegister} loading={authLoading} />
        </div>
      )}
      {!showLogin && !isAuthenticated && false && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <Register onRegister={handleRegister} switchToLogin={switchToLogin} loading={authLoading} />
        </div>
      )}
    </div>
  );
}

export default App;