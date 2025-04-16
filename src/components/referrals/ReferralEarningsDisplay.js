import React, { useState, useEffect } from 'react';
import { FaUserFriends, FaMoneyBillWave, FaCalendarAlt, FaWallet } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { formatDate, formatCurrency } from '../../utils/formatting';
import api from '../../services/api';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Link } from 'react-router-dom';

const ReferralEarningsDisplay = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [referralData, setReferralData] = useState({
    referrals: [],
    totalEarnings: 0,
    pendingEarnings: 0,
    paidEarnings: 0,
    availableEarnings: 0
  });

  useEffect(() => {
    const fetchReferralEarnings = async () => {
      try {
        setLoading(true);
        const response = await api.getUserReferralEarnings();
        if (response.data && response.data.success) {
          setReferralData({
            referrals: response.data.data.referrals || [],
            totalEarnings: response.data.data.totalEarnings || 0,
            pendingEarnings: response.data.data.pendingEarnings || 0,
            paidEarnings: response.data.data.paidEarnings || 0,
            availableEarnings: response.data.data.availableEarnings || 0
          });
        }
      } catch (err) {
        setError('Failed to load referral earnings. Please try again later.');
        console.error('Error fetching referral earnings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralEarnings();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaUserFriends className="mr-2 text-blue-600" />
          Referral Earnings
        </h2>
        <Link to="/referrals" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All Referrals →
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg shadow text-white"
        >
          <h3 className="text-sm font-medium opacity-80">Total Earnings</h3>
          <p className="text-2xl font-bold">{formatCurrency(referralData.totalEarnings)}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg shadow text-white"
        >
          <h3 className="text-sm font-medium opacity-80">Available to Withdraw</h3>
          <p className="text-2xl font-bold">{formatCurrency(referralData.availableEarnings)}</p>
          <Link to="/withdrawals" className="text-xs text-white font-medium underline mt-1 inline-block">
            Withdraw Now
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 rounded-lg shadow text-white"
        >
          <h3 className="text-sm font-medium opacity-80">Pending</h3>
          <p className="text-2xl font-bold">{formatCurrency(referralData.pendingEarnings)}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg shadow text-white"
        >
          <h3 className="text-sm font-medium opacity-80">Paid Out</h3>
          <p className="text-2xl font-bold">{formatCurrency(referralData.paidEarnings)}</p>
        </motion.div>
      </div>

      {/* Referral History Table */}
      <div className="overflow-x-auto">
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Recent Referral Earnings</h3>
        
        {referralData.referrals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>You haven't earned any referral commissions yet. Share your referral link to start earning!</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referred User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {referralData.referrals.slice(0, 5).map((referral) => (
                <tr key={referral._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {referral.referee ? (
                        `${referral.referee.name || referral.referee.email}`
                      ) : (
                        'Anonymous User'
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      {formatCurrency(referral.amount)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {referral.percentageEarned}% commission
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${referral.status === 'paid' ? 'bg-green-100 text-green-800' : 
                        referral.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}`}
                    >
                      {referral.status === 'paid' ? 'Paid' : 
                        referral.status === 'pending' ? 'Pending' : referral.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-1 text-gray-400" />
                      {formatDate(referral.createdAt)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Info Box with Withdrawal CTA */}
      <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded flex justify-between items-center">
        <div>
          <h4 className="text-blue-800 font-medium flex items-center">
            <FaMoneyBillWave className="mr-2" />
            How to Earn More
          </h4>
          <p className="text-blue-700 mt-1 text-sm">
            Share your referral link with friends. You'll earn a commission for each investment they make!
          </p>
        </div>
        {referralData.availableEarnings > 0 && (
          <Link 
            to="/withdrawals" 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center"
          >
            <FaWallet className="mr-2" />
            Withdraw Earnings
          </Link>
        )}
      </div>
    </div>
  );
};

export default ReferralEarningsDisplay; 