import React from 'react';
import { FaArrowUp, FaArrowDown, FaClock } from 'react-icons/fa';

const RecentInvestmentItem = ({ investment }) => {
  const getStatusIcon = (status) => {
    if (status === 'active') return <FaArrowUp className="text-green-500" />;
    if (status === 'completed') return <FaArrowDown className="text-blue-500" />;
    if (status === 'pending') return <FaClock className="text-yellow-500" />;
    return <FaClock className="text-gray-500" />;
  };

  const getStatusClass = (status) => {
    if (status === 'active') return 'bg-green-100 text-green-800';
    if (status === 'completed') return 'bg-blue-100 text-blue-800';
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {investment.plan}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${investment.amount.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {investment.roi}%
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${investment.expectedReturn.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {getStatusIcon(investment.status)}
          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(investment.status)}`}>
            {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(investment.createdAt).toLocaleDateString()}
      </td>
    </tr>
  );
};

export default RecentInvestmentItem; 