import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaUsers, FaCoins, FaCopy, FaTwitter, FaFacebook, FaTelegram, FaWhatsapp, FaMoneyBillWave, FaClock, FaCheckCircle } from 'react-icons/fa';
import api from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Referrals = () => {
  const { currentUser } = useAuth();
  const [referralData, setReferralData] = useState({
    referrals: [],
    referralCode: '',
    referralLink: '',
    referralsCount: 0,
    totalReferralEarned: 0
  });
  const [earningsData, setEarningsData] = useState({
    totalEarnings: 0,
    pendingEarnings: 0,
    paidEarnings: 0,
    availableEarnings: 0,
    earnings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    const fetchReferralData = async () => {
      setLoading(true);
      try {
        // Get referral info
        const infoResponse = await api.getReferralInfo();
        
        if (!infoResponse.data.success) {
          throw new Error(infoResponse.data.message || 'Failed to load referral information');
        }
        
        // Get referral list
        const referralsResponse = await api.getUserReferrals();
        
        if (!referralsResponse.data.success) {
          throw new Error(referralsResponse.data.message || 'Failed to load referrals');
        }
        
        // Get detailed earnings data
        const earningsResponse = await api.getUserReferralEarnings();
        
        if (!earningsResponse.data.success) {
          throw new Error(earningsResponse.data.message || 'Failed to load earnings data');
        }
        
        setReferralData({
          ...infoResponse.data.data,
          referrals: referralsResponse.data.data || []
        });
        
        setEarningsData({
          totalEarnings: earningsResponse.data.data.totalEarnings || 0,
          pendingEarnings: earningsResponse.data.data.pendingEarnings || 0,
          paidEarnings: earningsResponse.data.data.paidEarnings || 0,
          availableEarnings: earningsResponse.data.data.availableEarnings || 0,
          earnings: earningsResponse.data.data.referrals || []
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load referral data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralData.referralLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const shareViaTwitter = () => {
    const text = `Join me on this amazing investment platform and earn great returns! Sign up using my referral link: ${referralData.referralLink}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralData.referralLink)}`, '_blank');
  };

  const shareViaTelegram = () => {
    const text = `Join me on this amazing investment platform and earn great returns! Sign up using my referral link: ${referralData.referralLink}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralData.referralLink)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareViaWhatsApp = () => {
    const text = `Join me on this amazing investment platform and earn great returns! Sign up using my referral link: ${referralData.referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Referral Program</h1>
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Referral Program</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Total Referrals</h2>
              <p className="text-3xl font-bold text-gray-800">{referralData.referralsCount}</p>
            </div>
          </div>
          <p className="text-gray-600">Number of users who signed up using your referral link</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FaCoins className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Total Earnings</h2>
              <p className="text-3xl font-bold text-gray-800">${earningsData.totalEarnings?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
          <p className="text-gray-600">Amount earned from referral commissions</p>
        </div>
      </div>
      
      {/* Earnings Breakdown Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Earnings Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="flex items-center mb-2">
              <FaCheckCircle className="text-green-500 mr-2" />
              <h3 className="font-medium">Paid Earnings</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">${earningsData.paidEarnings?.toFixed(2) || '0.00'}</p>
            <p className="text-xs text-gray-500 mt-1">Commissions already paid to you</p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
            <div className="flex items-center mb-2">
              <FaClock className="text-yellow-500 mr-2" />
              <h3 className="font-medium">Pending Earnings</h3>
            </div>
            <p className="text-2xl font-bold text-yellow-600">${earningsData.pendingEarnings?.toFixed(2) || '0.00'}</p>
            <p className="text-xs text-gray-500 mt-1">Commissions being processed</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center mb-2">
              <FaMoneyBillWave className="text-blue-500 mr-2" />
              <h3 className="font-medium">Available to Withdraw</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">${earningsData.availableEarnings?.toFixed(2) || '0.00'}</p>
            <p className="text-xs text-gray-500 mt-1">Amount you can withdraw now</p>
            {earningsData.availableEarnings > 0 && (
              <a href="/withdrawals" className="text-xs inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium">
                Withdraw Funds →
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* Recent Earnings Section */}
      {earningsData.earnings && earningsData.earnings.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Earnings</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referred User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {earningsData.earnings.slice(0, 5).map((earning) => (
                  <tr key={earning._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {earning.referee ? earning.referee.name || earning.referee.email : 'Anonymous User'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        ${earning.amount?.toFixed(2) || '0.00'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {earning.percentageEarned}% commission
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(earning.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        earning.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {earning.status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Your Referral Link</h2>
        <div className="flex items-center">
          <input 
            type="text" 
            value={referralData.referralLink} 
            readOnly 
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
          />
          <button 
            onClick={copyToClipboard}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
          >
            <FaCopy className="mr-2" /> 
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        
        <div className="mt-6">
          <h3 className="text-md font-medium mb-3">Share your referral link</h3>
          <div className="flex space-x-4">
            <button 
              onClick={shareViaTwitter}
              className="bg-[#1DA1F2] text-white p-2 rounded-full hover:bg-opacity-90 focus:outline-none"
            >
              <FaTwitter className="text-xl" />
            </button>
            <button 
              onClick={shareViaFacebook}
              className="bg-[#4267B2] text-white p-2 rounded-full hover:bg-opacity-90 focus:outline-none"
            >
              <FaFacebook className="text-xl" />
            </button>
            <button 
              onClick={shareViaTelegram}
              className="bg-[#0088cc] text-white p-2 rounded-full hover:bg-opacity-90 focus:outline-none"
            >
              <FaTelegram className="text-xl" />
            </button>
            <button 
              onClick={shareViaWhatsApp}
              className="bg-[#25D366] text-white p-2 rounded-full hover:bg-opacity-90 focus:outline-none"
            >
              <FaWhatsapp className="text-xl" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Your Referrals</h2>
        
        {referralData.referrals.length === 0 ? (
          <p className="text-center py-4 text-gray-500">You haven't referred anyone yet. Share your referral link to start earning!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Joined
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Earnings
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {referralData.referrals.map(referral => (
                  <tr key={referral._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{referral.name}</div>
                      <div className="text-sm text-gray-500">{referral.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(referral.joinedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        referral.isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {referral.isVerified ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${referral.totalEarned?.toFixed(2) || '0.00'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Referrals; 