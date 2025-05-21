import React from 'react';

const Header = ({ onClear, onToggleSidebar, showSidebarButton = false, onLogout, isAuthenticated, onLoginClick }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          {showSidebarButton && (
            <button
              onClick={onToggleSidebar}
              className="mr-4 p-2 rounded-md hover:bg-gray-200 md:hidden"
              aria-label="Toggle chat history"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <h1 className="text-2xl font-bold text-gray-900">AI-ChatBot</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onClear}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200"
          >
            Clear Chat
          </button>
          {/* Only show on desktop */}
          <button
            onClick={onToggleSidebar}
            className="hidden md:flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-750 transition duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            History
          </button>
          {isAuthenticated ? (
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;