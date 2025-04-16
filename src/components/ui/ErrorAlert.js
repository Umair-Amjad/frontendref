import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorAlert = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded shadow-sm">
      <div className="flex items-start">
        <FaExclamationTriangle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-medium text-red-800">Error</h3>
          <div className="mt-2 text-red-700">
            {message}
          </div>
          <div className="mt-3 text-sm">
            <p>Please try again or contact support if the problem persists.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert; 