import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardCard from '../components/ui/DashboardCard';
import ReferralLink from '../components/ui/ReferralLink';
import ReferralEarningsDisplay from '../components/referrals/ReferralEarningsDisplay';
import { 
  FaMoneyBillWave, 
  FaUsers, 
  FaDollarSign, 
  FaChartLine, 
  FaExclamationCircle,
  FaArrowRight,
  FaLock,
  FaUnlock,
  FaClock,
  FaWallet
} from 'react-icons/fa';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import RecentInvestmentItem from '../components/investments/RecentInvestmentItem';
import { userAPI } from '../services/api';
import { 
  EarningsUpdateNotice, 
  UserExperienceNotice,
  TimerEarningsNotice,
  EnhancedBankWithdrawalNotice,
  CustomerExperienceNotice 
} from '../components/ui/NoticeCards';
import { toast } from "react-toastify";
import api, { imageErrorHandler } from "../services/api";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEarningsNotice, setShowEarningsNotice] = useState(true);
  
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await userAPI.getDashboardStats();
        
        if (response.data.success && response.data.data) {
          setDashboardData(response.data.data);
        } else {
          setError('Failed to fetch dashboard data');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();

    // Set a timer to hide the earnings update notice after 30 seconds
    const timer = setTimeout(() => {
      setShowEarningsNotice(false);
    }, 30000);

    // Set another timer to show the earnings update notice every 3 hours (simulating balance updates)
    const updateTimer = setInterval(() => {
      setShowEarningsNotice(true);
      // Hide it again after 30 seconds
      setTimeout(() => {
        setShowEarningsNotice(false);
        // Refresh data to simulate balance update
        fetchDashboardData();
      }, 30000);
    }, 3 * 60 * 60 * 1000); // 3 hours

    return () => {
      clearTimeout(timer);
      clearInterval(updateTimer);
    };
  }, []);
  
  // Show loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }
  
  // Show error message
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex items-center">
            <FaExclamationCircle className="text-red-400 mr-3" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  const handleImageError = (e) => {
    e.target.src = "/assets/images/placeholder.jpg";
    if (imageErrorHandler.trackError("Referral image failed to load")) {
      toast.error("Referral image failed to load");
    }
  };
  
  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {currentUser?.name}</h1>
          <p className="text-gray-600">Here's an overview of your investments and earnings</p>
        </div>
        
        {/* Dynamic Notices */}
        {showEarningsNotice && dashboardData?.activeInvestmentsCount > 0 && (
          <div className="mb-8">
            <TimerEarningsNotice />
          </div>
        )}
        
        {/* Additional notices */}
        <div className="mb-8 space-y-4">
          <EnhancedBankWithdrawalNotice />
          <CustomerExperienceNotice />
        </div>
        
        {/* Balance Cards */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Balance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
            <DashboardCard
              title="Withdrawable Balance"
              value={`$${(dashboardData?.totalWithdrawable || 0).toFixed(2)}`}
              icon={<FaWallet className="h-6 w-6" />}
              color="success"
              onClick={() => window.location.href = '/withdrawals'}
              actionText="Withdraw Funds"
              subtitle={dashboardData?.referralBalance > 0 ? `Includes $${dashboardData?.referralBalance.toFixed(2)} from referrals` : null}
            />
            
            <DashboardCard
              title="Pending ROI"
              value={`$${(dashboardData?.pendingBalance || 0).toFixed(2)}`}
              icon={<FaClock className="h-6 w-6" />}
              color="warning"
              subtitle="All ROI earnings are now immediately available"
              actionText="No waiting period"
            />
            
            <DashboardCard
              title="Referral Earnings"
              value={`$${(dashboardData?.referralBalance || 0).toFixed(2)}`}
              icon={<FaUsers className="h-6 w-6" />}
              color="info"
              onClick={() => window.location.href = '/referrals'}
              actionText="View Referrals"
              subtitle="Immediately available for withdrawal"
            />
          </div>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Total Invested"
            value={`$${(dashboardData?.totalInvested || 0).toFixed(2)}`}
            icon={<FaMoneyBillWave className="h-6 w-6" />}
            color="primary"
          />
          
          <DashboardCard
            title="Total ROI Earned"
            value={`$${(dashboardData?.totalRoiEarned || 0).toFixed(2)}`}
            icon={<FaDollarSign className="h-6 w-6" />}
            color="success"
          />
          
          <DashboardCard
            title="Referral Earnings"
            value={`$${(dashboardData?.totalReferralEarned || 0).toFixed(2)}`}
            icon={<FaUsers className="h-6 w-6" />}
            color="info"
          />
          
          <DashboardCard
            title="Active Investments"
            value={dashboardData?.activeInvestmentsCount || 0}
            icon={<FaChartLine className="h-6 w-6" />}
            color="warning"
            onClick={() => window.location.href = '/investments'}
          />
        </div>
        
        {/* Referral Link */}
        <div className="mb-8">
          <ReferralLink referralCode={currentUser?.referralCode} />
        </div>
        
        {/* Referral Earnings Display - New Section */}
        <div className="mb-8">
          <ReferralEarningsDisplay />
        </div>
        
        {/* Recent Investments */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Investments</h2>
            <Link to="/investments" className="text-primary font-medium hover:text-primary-dark flex items-center">
              View All <FaArrowRight className="ml-1" />
            </Link>
          </div>
          
          {dashboardData?.recentInvestments?.length ? (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ROI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expected Return
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
                  {dashboardData?.recentInvestments?.map((investment) => (
                    <RecentInvestmentItem key={investment._id} investment={investment} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <p className="text-gray-500">No investments yet. Start investing to see your returns!</p>
              <Link to="/invest" className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
                Start Investing
              </Link>
            </div>
          )}
        </div>
      </div>
  );
};

export default Dashboard; 