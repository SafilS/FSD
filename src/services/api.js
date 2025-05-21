import axios from 'axios';

// Base API URL - This is configured via proxy in package.json for development
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // In production, this will be relative to the server
  : '/api'; // In development, this will be proxied to localhost:5000/api

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatService = {
  // Create a new chat session
  createSession: async (title = 'New Chat') => {
    try {
      const response = await api.post('/chat/session', { title });
      return response.data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },

  // Get a chat session by ID
  getSession: async (sessionId) => {
    try {
      const response = await api.get(`/chat/session/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting session:', error);
      throw error;
    }
  },
  
  // Get all chat sessions (chat history)
  getAllSessions: async () => {
    try {
      console.log('Fetching chat history from API');
      const response = await api.get('/chat/sessions');
      console.log('Chat history response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting chat history:', error);
      throw error;
    }
  },

  // Send a message (non-streaming version)
  sendMessage: async (sessionId, message) => {
    try {
      const response = await api.post(`/chat/session/${sessionId}/message`, { message });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
  
  // Send a message for streaming (this only sets up the headers)
  // The actual streaming is handled via EventSource in the component
  prepareMessageStream: async (sessionId, message) => {
    try {
      const response = await api.post(`/chat/session/${sessionId}/message/stream`, { message });
      return response.data;
    } catch (error) {
      console.error('Error preparing message stream:', error);
      throw error;
    }
  },

  // Clear a chat session
  clearSession: async (sessionId) => {
    try {
      const response = await api.delete(`/chat/session/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error clearing session:', error);
      throw error;
    }
  },
};

export default api;