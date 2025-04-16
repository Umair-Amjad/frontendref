import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const colorClasses = {
    blue: 'border-blue-500',
    gray: 'border-gray-500',
    green: 'border-green-500',
    red: 'border-red-500',
    yellow: 'border-yellow-500'
  };

  return (
    <div className="flex justify-center items-center">
      <div 
        className={`animate-spin rounded-full ${sizeClasses[size]} border-t-2 border-b-2 ${colorClasses[color]}`}
      ></div>
    </div>
  );
};

export default LoadingSpinner; 