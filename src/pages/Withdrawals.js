import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaMoneyBillWave, FaHistory, FaExchangeAlt, FaSyncAlt, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { withdrawalAPI, userAPI } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import TabNavigation from '../components/ui/TabNavigation';
import WithdrawalForm from '../components/withdrawals/WithdrawalForm';
import WithdrawalHistory from '../components/withdrawals/WithdrawalHistory';
import EarningsHistory from '../components/withdrawals/EarningsHistory';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import { formatCurrency } from '../components/withdrawals/formatters';

// Add this component to show a notification about available referral earnings
const ReferralBalanceNotification = ({ referralBalance, onClickWithdraw }) => {
  if (!referralBalance || referralBalance <= 0) return null;
  
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 flex justify-between items-center">
      <div>
        <h3 className="font-medium text-blue-800 flex items-center">
          <FaMoneyBillWave className="mr-2" /> Referral Earnings Available
        </h3>
        <p className="text-sm text-blue-700 mt-1">
          You have ${referralBalance.toFixed(2)} in referral earnings available to withdraw.
          You can withdraw this amount along with your main balance.
        </p>
      </div>
      <button 
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
        onClick={onClickWithdraw}
      >
        Withdraw Now
      </button>
    </div>
  );
};

// Add a component to explain how referral earnings work
const ReferralEarningsExplanation = () => {
  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
      <h3 className="font-medium text-green-800 flex items-center">
        <FaInfoCircle className="mr-2" /> How Referral Earnings Work
      </h3>
      <p className="text-sm text-green-700 mt-1">
        When someone invests using your referral code, you instantly earn a commission (5%) that's immediately added to your withdrawable balance.
        This is different from ROI earnings which go through a 3-4 day holding period before becoming withdrawable.
      </p>
    </div>
  );
};

const Withdrawals = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('withdrawals');
  const [withdrawableBalance, setWithdrawableBalance] = useState(0);
  const [referralBalance, setReferralBalance] = useState(0); 
  const [pendingBalance, setPendingBalance] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTimer, setRefreshTimer] = useState(120); // 2 minute timer
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Track loading state for each data type
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [earningsLoading, setEarningsLoading] = useState(false);
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(false);

  // Add a state for the initial withdrawal type
  const [initialWithdrawalType, setInitialWithdrawalType] = useState('combined');
  const [initialAmount, setInitialAmount] = useState('');

  // Fetch balance from API
  const fetchBalance = useCallback(async () => {
    setBalanceLoading(true);
    try {
      // Get the available balances
      const balanceRes = await withdrawalAPI.getWithdrawableBalance();
      if (balanceRes && balanceRes.data) {
        setWithdrawableBalance(balanceRes.data.withdrawableBalance || 0);
        setReferralBalance(balanceRes.data.referralBalance || 0);
        setPendingBalance(balanceRes.data.pendingBalance || 0);
      }
      
      // Get total amount already withdrawn
      const withdrawalsRes = await withdrawalAPI.getUserWithdrawals();
      if (withdrawalsRes && withdrawalsRes.data) {
        // Ensure we have an array to work with
        const withdrawalsData = Array.isArray(withdrawalsRes.data) ? withdrawalsRes.data : [];
        const completedWithdrawals = withdrawalsData.filter(w => w.status === 'completed');
        const totalAmount = completedWithdrawals.reduce((sum, w) => sum + (parseFloat(w.amount) || 0), 0);
        setTotalWithdrawn(totalAmount);
        setWithdrawals(withdrawalsData);
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError('Failed to fetch your balance. Please try again later.');
      toast.error('Error loading your balance information');
    } finally {
      setBalanceLoading(false);
    }
  }, []);

  // Fetch earnings history
  const fetchEarningsHistory = useCallback(async () => {
    setEarningsLoading(true);
    try {
      const res = await userAPI.getEarningHistory();
      // Check if data exists and is an array before setting state
      if (res && res.data) {
        setEarnings(Array.isArray(res.data) ? res.data : []);
      } else {
        setEarnings([]);
      }
    } catch (err) {
      console.error('Error fetching earnings history:', err);
      setEarnings([]); // Set to empty array on error
    } finally {
      setEarningsLoading(false);
    }
  }, []);

  // Fetch withdrawals history
  const fetchWithdrawals = useCallback(async () => {
    setWithdrawalsLoading(true);
    try {
      const res = await withdrawalAPI.getUserWithdrawals();
      if (res && res.data) {
        setWithdrawals(Array.isArray(res.data) ? res.data : []);
      } else {
        setWithdrawals([]);
      }
    } catch (err) {
      console.error('Error fetching withdrawals:', err);
      setWithdrawals([]); // Set to empty array on error
    } finally {
      setWithdrawalsLoading(false);
    }
  }, []);

  // Fetch data on initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchBalance(),
          fetchEarningsHistory(),
          fetchWithdrawals()
        ]);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load withdrawal data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [fetchBalance, fetchEarningsHistory, fetchWithdrawals]);

  // Handle refresh timer
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshTimer(prev => (prev > 0 ? prev - 1 : 120));
    }, 1000);
    
    // Auto-refresh when timer hits 0
    if (refreshTimer === 0) {
      handleRefresh();
    }
    
    return () => clearInterval(timer);
  }, [refreshTimer]);

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchBalance(),
        fetchEarningsHistory(),
        fetchWithdrawals()
      ]);
      toast.success('Data updated successfully!');
      setRefreshTimer(120); // Reset timer to 2 minutes
    } catch (err) {
      console.error('Error refreshing data:', err);
      toast.error('Failed to update data');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle form submission success
  const handleWithdrawalSuccess = () => {
    fetchBalance();
    fetchWithdrawals();
    toast.success('Withdrawal request submitted successfully!');
  };

  // Add a function to handle the "Withdraw Now" button from the notification
  const handleWithdrawReferrals = () => {
    setActiveTab('withdrawals');
    // Set the initial values for the withdrawal form
    setInitialWithdrawalType('referral');
    setInitialAmount(referralBalance.toString());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorAlert message={error} />
        <div className="mt-4 flex justify-center">
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <PageHeader
        title="Withdrawals & Earnings"
        description="Request withdrawals and view your transaction history"
        icon={<FaMoneyBillWave className="text-blue-500" size={32} />}
      />
      
      {/* Add the explanation component */}
      <ReferralEarningsExplanation />
      
      {/* Enhanced Balance Info */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Withdrawable Balance</h3>
          <div className="text-3xl font-bold text-green-600 mb-1">{formatCurrency(withdrawableBalance)}</div>
          <p className="text-sm text-gray-500">Available for immediate withdrawal</p>
          {referralBalance > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-blue-600">
              Includes {formatCurrency(referralBalance)} from referral earnings
            </div>
          )}
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Referral Earnings</h3>
          <div className="text-3xl font-bold text-blue-600 mb-1">{formatCurrency(referralBalance)}</div>
          <p className="text-sm text-gray-500">Already included in withdrawable balance</p>
          <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-green-600">
            Referral earnings are instantly withdrawable
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Pending ROI</h3>
          <div className="text-3xl font-bold text-amber-600 mb-1">{formatCurrency(pendingBalance)}</div>
          <p className="text-sm text-gray-500">Will be available in 3-4 days</p>
        </div>
      </div>
      
      {/* Referral balance notification if there's a significant amount */}
      {referralBalance > 50 && (
        <ReferralBalanceNotification 
          referralBalance={referralBalance} 
          onClickWithdraw={handleWithdrawReferrals}
        />
      )}
      
      {/* Refresh button with timer */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center text-primary hover:text-primary-dark text-sm font-medium"
        >
          <FaSyncAlt className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh {isRefreshing ? 'Loading...' : `(${Math.floor(refreshTimer / 60)}:${(refreshTimer % 60).toString().padStart(2, '0')})`}
        </button>
      </div>
      
      {/* Navigation Tabs */}
      <TabNavigation
        tabs={[
          { id: 'withdrawals', label: 'Request Withdrawal', icon: <FaMoneyBillWave /> },
          { id: 'history', label: 'Withdrawal History', icon: <FaHistory /> },
          { id: 'earnings', label: 'Earnings History', icon: <FaExchangeAlt /> }
        ]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      {/* Show error if any */}
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      
      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'withdrawals' && (
          <WithdrawalForm 
            balance={withdrawableBalance} 
            referralBalance={referralBalance}
            onSuccess={handleWithdrawalSuccess}
            initialType={initialWithdrawalType}
            initialAmount={initialAmount}
          />
        )}
        
        {activeTab === 'history' && (
          <WithdrawalHistory 
            withdrawals={withdrawals} 
            loading={withdrawalsLoading}
            onRefresh={fetchWithdrawals}
          />
        )}
        
        {activeTab === 'earnings' && (
          <EarningsHistory 
            earnings={earnings} 
            loading={earningsLoading}
            onRefresh={fetchEarningsHistory}
          />
        )}
      </div>
    </motion.div>
  );
};

export default Withdrawals; 