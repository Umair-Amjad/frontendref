import React, { useState } from 'react';
import ENV from '../utils/env';
import { FaServer, FaTimes } from 'react-icons/fa';

/**
 * Environment indicator component
 * Shows which API environment is being used (development or production)
 * Only visible in development mode
 */
const EnvIndicator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Don't show in production unless explicitly enabled
  if (!ENV.IS_DEVELOPMENT && !window.localStorage.getItem('showEnvIndicator')) {
    return null;
  }

  const isDevelopment = ENV.API_URL.includes('localhost');
  const bgColor = isDevelopment ? 'bg-yellow-500' : 'bg-purple-600';
  const indicatorText = isDevelopment ? 'LOCAL API' : 'PRODUCTION API';

  // Collapsed indicator that shows in the bottom right
  if (!isOpen && isVisible) {
    return (
      <div 
        className={`fixed bottom-4 right-4 ${bgColor} text-white text-xs font-bold py-1 px-2 rounded-full shadow-lg cursor-pointer z-50 flex items-center`}
        onClick={() => setIsOpen(true)}
      >
        <FaServer className="mr-1" />
        {indicatorText}
      </div>
    );
  }

  // Expanded indicator with more details
  if (isOpen && isVisible) {
    return (
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 max-w-md z-50 border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-gray-700">API Environment</h3>
          <div className="flex">
            <button 
              className="text-gray-400 hover:text-gray-600 mr-2"
              onClick={() => setIsVisible(false)}
              title="Hide"
            >
              <FaTimes />
            </button>
            <button 
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setIsOpen(false)}
              title="Minimize"
            >
              <span>_</span>
            </button>
          </div>
        </div>
        
        <div className="mb-3">
          <div className={`inline-block ${bgColor} text-white text-sm font-bold py-1 px-2 rounded`}>
            {indicatorText}
          </div>
        </div>
        
        <div className="text-sm text-gray-600 mb-2">
          <div><strong>API URL:</strong> {ENV.API_URL}</div>
          <div><strong>Environment:</strong> {ENV.ENVIRONMENT}</div>
        </div>
        
        <div className="text-xs text-gray-500 mt-3">
          {isDevelopment ? (
            <p>You are using the local development API. Make sure your backend server is running.</p>
          ) : (
            <p>You are connected to the production API hosted on Railway.</p>
          )}
        </div>
        
        <div className="mt-3 text-xs flex justify-between">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => {
              if (isDevelopment) {
                window.location.href = 'https://frontendref.vercel.app';
              } else {
                window.location.href = 'http://localhost:3000';
              }
            }}
          >
            {isDevelopment ? 'Go to production site' : 'Go to local site'}
          </button>
          
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default EnvIndicator; 