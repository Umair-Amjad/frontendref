import React from 'react';

const PlanCard = ({ plan, isSelected, onSelect }) => {
  const { name, minAmount, maxAmount, roi, duration } = plan;
  
  return (
    <div 
      className={`card border-2 transition-all ${
        isSelected 
          ? 'border-primary shadow-lg transform scale-105' 
          : 'border-transparent hover:border-gray-200'
      }`}
      onClick={() => onSelect(plan)}
    >
      <div className="text-center">
        <h3 className={`text-xl font-bold mb-2 ${isSelected ? 'text-primary' : 'text-gray-800'}`}>
          {name}
        </h3>
        <div className="bg-gray-100 py-4 px-6 rounded-lg mb-4">
          <p className="text-3xl font-bold text-primary">{roi}%</p>
          <p className="text-gray-600">Return on Investment</p>
        </div>
        <ul className="text-left space-y-2 mb-4">
          <li className="flex justify-between">
            <span className="text-gray-600">Minimum:</span>
            <span className="font-semibold">${minAmount}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">Maximum:</span>
            <span className="font-semibold">${maxAmount}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-semibold">{duration} {duration === 1 ? 'day' : 'days'}</span>
          </li>
        </ul>
        <button 
          className={`btn w-full ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(plan);
          }}
        >
          {isSelected ? 'Selected' : 'Select Plan'}
        </button>
      </div>
    </div>
  );
};

export default PlanCard; 