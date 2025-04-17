import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/layout/AdminLayout';
import { FaUsers, FaMoneyBillWave, FaExchangeAlt, FaChartBar, FaCalendarAlt, FaCreditCard, FaChartLine, FaSyncAlt } from 'react-icons/fa';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { imageErrorHandler } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';
import { formatCurrency } from '../../components/withdrawals/formatters';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StatCard = ({ title, value, icon, color, previousValue }) => {
  const colorClasses = {
    primary: 'bg-blue-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    danger: 'bg-red-500 text-white',
    info: 'bg-indigo-500 text-white'
  };
  
  // Calculate percentage change if previous value exists
  const hasChanged = previousValue !== undefined && previousValue !== value;
  const isIncrease = hasChanged && value > previousValue;
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-500 ${hasChanged ? 'scale-105' : ''}`}>
      <div className={`p-4 ${colorClasses[color]}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white opacity-75">{title}</p>
            <div className="flex items-center">
              <h3 className="text-xl font-bold text-white">{value}</h3>
              {hasChanged && (
                <span className={`ml-2 text-xs font-medium ${isIncrease ? 'text-green-200' : 'text-red-200'}`}>
                  {isIncrease ? '↑' : '↓'} {Math.abs(value - previousValue)}
                </span>
              )}
            </div>
          </div>
          <div className="text-white text-3xl">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

const FinancialCard = ({ title, value, subtitle, icon, color, previousValue }) => {
  const colorClasses = {
    primary: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    info: 'text-indigo-600'
  };
  
  // Calculate percentage change if previous value exists
  const hasChanged = previousValue !== undefined && previousValue !== value;
  const isIncrease = hasChanged && value > previousValue;
  const changeAmount = hasChanged ? Math.abs(value - previousValue) : 0;
  
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 transition-all duration-500 ${hasChanged ? 'scale-105' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className={`text-2xl font-bold ${colorClasses[color]} mt-1`}>{value}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`${colorClasses[color]} text-3xl p-2 bg-gray-100 rounded-full`}>
          {icon}
        </div>
      </div>
      {hasChanged && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className={`text-sm ${isIncrease ? 'text-green-600' : 'text-red-600'} flex items-center`}>
            {isIncrease ? '↑' : '↓'} {formatCurrency(changeAmount)}
            <span className="text-gray-500 ml-1">since last update</span>
          </p>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [previousData, setPreviousData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Function to fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    setIsRefreshing(true);
    
    try {
      const response = await adminAPI.getDashboardStats();
      
      if (response.data.success) {
        // Save the previous data for comparison
        setPreviousData(dashboardData);
        
        // Set the new data
        setDashboardData(response.data.data);
        
        // Check for significant changes and notify
        if (dashboardData) {
          const newInvestments = response.data.data.financials.totalInvestmentAmount - dashboardData.financials.totalInvestmentAmount;
          const newWithdrawals = response.data.data.financials.totalWithdrawalAmount - dashboardData.financials.totalWithdrawalAmount;
          
          if (newInvestments > 0) {
            toast.success(`New investment detected: +${formatCurrency(newInvestments)}`);
          }
          
          if (newWithdrawals > 0) {
            toast.info(`New withdrawal completed: +${formatCurrency(newWithdrawals)}`);
          }
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error fetching dashboard data');
      if (!dashboardData) {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  }, [dashboardData]);
  
  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);
  
  // Handle manual refresh
  const handleRefresh = () => {
    fetchDashboardData();
    toast.info('Dashboard refreshed');
  };

  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-700">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            <FaSyncAlt className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Dashboard'}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total Users" 
            value={dashboardData?.counts?.users || 0} 
            icon={<FaUsers />} 
            color="primary" 
            previousValue={previousData?.counts?.users}
          />
          <StatCard 
            title="Active Investments" 
            value={dashboardData?.counts?.activeInvestments || 0} 
            icon={<FaMoneyBillWave />} 
            color="success" 
            previousValue={previousData?.counts?.activeInvestments}
          />
          <StatCard 
            title="Pending Withdrawals" 
            value={dashboardData?.counts?.pendingWithdrawals || 0} 
            icon={<FaCreditCard />} 
            color="warning" 
            previousValue={previousData?.counts?.pendingWithdrawals}
          />
        </div>
        
        {/* Financial Overview */}
        <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <FinancialCard
            title="Total Invested Amount"
            value={formatCurrency(dashboardData?.financials?.totalInvestmentAmount || 0)}
            icon={<FaChartLine />}
            color="primary"
            subtitle="Total amount invested by all users"
            previousValue={previousData?.financials?.totalInvestmentAmount}
          />
          <FinancialCard
            title="Total Withdrawn Amount"
            value={formatCurrency(dashboardData?.financials?.totalWithdrawalAmount || 0)}
            icon={<FaExchangeAlt />}
            color="warning"
            subtitle="Total completed withdrawals"
            previousValue={previousData?.financials?.totalWithdrawalAmount}
          />
          <FinancialCard
            title="Net Balance"
            value={formatCurrency(dashboardData?.financials?.netBalance || 0)}
            icon={<FaMoneyBillWave />}
            color="success"
            subtitle="Investments minus withdrawals"
            previousValue={previousData?.financials?.netBalance}
          />
        </div>
        
        {/* Recent Users */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referral Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData?.recentUsers?.map(user => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.referralCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Recent Investments */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Investments</h2>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData?.recentInvestments?.map(investment => (
                  <tr key={investment._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {investment.user ? investment.user.name : 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {investment.user ? investment.user.email : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {investment.plan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${investment.amount?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {investment.roi}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${investment.status === 'active' ? 'bg-green-100 text-green-800' : 
                          investment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {investment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDistanceToNow(new Date(investment.createdAt), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pending Withdrawals */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Pending Withdrawals</h2>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData?.pendingWithdrawals?.map(withdrawal => (
                  <tr key={withdrawal._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {withdrawal.user ? withdrawal.user.name : 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {withdrawal.user ? withdrawal.user.email : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${withdrawal.amount?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {withdrawal.method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDistanceToNow(new Date(withdrawal.createdAt), { addSuffix: true })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a 
                        href={`/admin/withdrawals?id=${withdrawal._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Process
                      </a>
                    </td>
                  </tr>
                ))}
                {(!dashboardData?.pendingWithdrawals || dashboardData.pendingWithdrawals.length === 0) && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No pending withdrawals
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard; 