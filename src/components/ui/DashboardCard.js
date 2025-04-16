import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary', 
  onClick,
  subtitle = null,
  actionText = null
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'text-blue-600 bg-blue-100';
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'info':
        return 'text-indigo-600 bg-indigo-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'danger':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getTextColorClass = () => {
    switch (color) {
      case 'primary': return 'text-blue-600';
      case 'success': return 'text-green-600';
      case 'info': return 'text-indigo-600';
      case 'warning': return 'text-yellow-600';
      case 'danger': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        {icon && (
          <div className={`p-3 rounded-full mr-4 ${getColorClasses()}`}>
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold text-gray-500">{title}</h2>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          {subtitle && <p className={`text-sm ${getTextColorClass()} mt-1`}>{subtitle}</p>}
        </div>
      </div>
      
      {actionText && onClick && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button className={`text-sm font-medium ${getTextColorClass()} flex items-center`}>
            {actionText} <FaArrowRight className="ml-1" size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardCard; 