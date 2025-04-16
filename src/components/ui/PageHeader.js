import React from 'react';

const PageHeader = ({ title, description, icon }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        {icon && <span className="mr-2">{icon}</span>}
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
      {description && <p className="text-gray-600">{description}</p>}
    </div>
  );
};

export default PageHeader; 