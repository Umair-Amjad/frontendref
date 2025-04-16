import React from 'react';
import { FaWallet, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaMoneyBillWave, FaMobile, FaUniversity, FaPaypal } from 'react-icons/fa';
import Moment from 'react-moment';
import { formatCurrency, getStatusClass, formatDate } from './formatters';

const WithdrawalHistory = ({ withdrawals = [], loading }) => {
  // Function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="text-green-500" />;
      case 'approved':
        return <FaCheckCircle className="text-blue-500" />;
      case 'pending':
        return <FaHourglassHalf className="text-yellow-500" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaHourglassHalf className="text-gray-500" />;
    }
  };

  // Function to get payment method icon
  const getMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'usdt':
      case 'crypto':
        return <FaWallet className="text-green-500" />;
      case 'jazzcash':
        return <FaMoneyBillWave className="text-red-500" />;
      case 'easypaisa':
        return <FaMobile className="text-green-600" />;
      case 'bank':
        return <FaUniversity className="text-blue-600" />;
      case 'paypal':
        return <FaPaypal className="text-blue-700" />;
      default:
        return <FaMoneyBillWave className="text-blue-500" />;
    }
  };

  // Get payment details display
  const getPaymentDetails = (withdrawal) => {
    if (!withdrawal) return null;
    
    const paymentMethod = withdrawal.paymentMethod || withdrawal.method;
    const paymentDetails = withdrawal.paymentDetails || {};
    
    if (!paymentDetails) return null;
    
    if (paymentMethod?.toLowerCase() === 'usdt' || paymentMethod?.toLowerCase() === 'crypto') {
      return (
        <div className="text-xs text-gray-500 mt-1">
          <div className="flex items-center">
            <span className="font-medium mr-1">Wallet:</span>
            <span className="truncate" title={paymentDetails.walletAddress || paymentDetails.address}>
              {(paymentDetails.walletAddress || paymentDetails.address || '').substring(0, 10)}...
            </span>
          </div>
          {(paymentDetails.network) && (
            <div>
              <span className="font-medium mr-1">Network:</span>
              {paymentDetails.network}
            </div>
          )}
        </div>
      );
    } else if (paymentMethod?.toLowerCase() === 'jazzcash' || paymentMethod?.toLowerCase() === 'easypaisa') {
      return (
        <div className="text-xs text-gray-500 mt-1">
          <div>
            <span className="font-medium mr-1">Phone:</span>
            {paymentDetails.phoneNumber || paymentDetails.number || 'N/A'}
          </div>
          {paymentDetails.accountName && (
            <div>
              <span className="font-medium mr-1">Name:</span>
              {paymentDetails.accountName}
            </div>
          )}
        </div>
      );
    } else if (paymentMethod?.toLowerCase() === 'bank') {
      return (
        <div className="text-xs text-gray-500 mt-1">
          <div>
            <span className="font-medium mr-1">Bank:</span>
            {paymentDetails.bankName || 'N/A'}
          </div>
          {paymentDetails.accountNumber && (
            <div>
              <span className="font-medium mr-1">Acct:</span>
              {paymentDetails.accountNumber}
            </div>
          )}
        </div>
      );
    } else if (paymentMethod?.toLowerCase() === 'paypal') {
      return (
        <div className="text-xs text-gray-500 mt-1">
          <div>
            <span className="font-medium mr-1">Email:</span>
            {paymentDetails.email || 'N/A'}
          </div>
        </div>
      );
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!withdrawals || !Array.isArray(withdrawals) || withdrawals.length === 0) {
    return (
      <div className="bg-gray-50 p-6 text-center rounded-lg border border-gray-200">
        <p className="text-gray-500">No withdrawal requests found</p>
        <p className="text-sm text-gray-400 mt-1">Your withdrawal requests will appear here</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Withdrawal History</h2>
      
      <div className="overflow-x-auto mt-2">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {withdrawals.map((withdrawal, index) => (
              <tr key={withdrawal._id || index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {withdrawal.createdAt ? (
                    <Moment format="MMM D, YYYY h:mm A">{withdrawal.createdAt}</Moment>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(withdrawal.amount)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getMethodIcon(withdrawal.paymentMethod || withdrawal.method)}
                    <span className="ml-2 text-sm text-gray-900">
                      {withdrawal.paymentMethod || withdrawal.method || 'Unknown'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(withdrawal.status)}`}>
                    {withdrawal.status || 'Unknown'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPaymentDetails(withdrawal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WithdrawalHistory; 