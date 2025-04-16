import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ReferralEarningsDisplay from '../components/referrals/ReferralEarningsDisplay';
import ReferralLink from '../components/ui/ReferralLink';
import { FaArrowLeft, FaUsers, FaExchangeAlt } from 'react-icons/fa';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import api from '../services/api';

const ReferralEarnings = () => {
  const [loading, setLoading] = useState(true);
  const [referralStats, setReferralStats] = useState({
    totalReferred: 0,
    activeReferred: 0,
    conversionRate: 0
  });

  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchReferralStats = async () => {
      try {
        setLoading(true);
        const response = await api.getReferralInfo();
        if (response.data && response.data.success) {
          const { referralsCount, referralInvestmentsCount } = response.data.data;
          setReferralStats({
            totalReferred: referralsCount || 0,
            activeReferred: referralInvestmentsCount || 0,
            conversionRate: referralsCount ? Math.round((referralInvestmentsCount / referralsCount) * 100) : 0
          });
        }
      } catch (error) {
        console.error('Error fetching referral stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center mb-4">
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Referral Earnings</h1>
        <p className="text-gray-600">
          Track your referral commissions and share your link to earn more
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center mb-3">
            <FaUsers className="text-blue-500 mr-3" />
            <h3 className="text-lg font-medium text-gray-700">Total Referred</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{referralStats.totalReferred}</p>
          <p className="text-sm text-gray-500 mt-1">Users who signed up with your referral code</p>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center mb-3">
            <FaExchangeAlt className="text-green-500 mr-3" />
            <h3 className="text-lg font-medium text-gray-700">Active Investors</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{referralStats.activeReferred}</p>
          <p className="text-sm text-gray-500 mt-1">Referred users who have made investments</p>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center mb-3">
            <FaExchangeAlt className="text-purple-500 mr-3" />
            <h3 className="text-lg font-medium text-gray-700">Conversion Rate</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{referralStats.conversionRate}%</p>
          <p className="text-sm text-gray-500 mt-1">Percentage of referred users who invest</p>
        </div>
      </div>

      {/* Referral Link */}
      <div className="mb-8">
        <ReferralLink referralCode={currentUser?.referralCode} />
      </div>

      {/* Earnings Display */}
      <div className="mb-8">
        <ReferralEarningsDisplay />
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white mb-8">
        <h2 className="text-xl font-bold mb-4">How Referral Earnings Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="font-bold text-xl mb-2">1. Share</h3>
            <p className="text-sm">Share your unique referral link with friends, family, or on social media</p>
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="font-bold text-xl mb-2">2. Sign Up</h3>
            <p className="text-sm">When someone signs up using your link, they become your referral</p>
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="font-bold text-xl mb-2">3. Earn</h3>
            <p className="text-sm">Earn 5% commission on every investment your referrals make</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Ready to Withdraw Your Earnings?</h2>
        <p className="text-gray-600 mb-4">Your referral earnings can be withdrawn at any time.</p>
        <Link to="/withdrawals" className="btn bg-primary text-white hover:bg-primary-dark inline-block">
          Withdraw Earnings
        </Link>
      </div>
    </div>
  );
};

export default ReferralEarnings; 