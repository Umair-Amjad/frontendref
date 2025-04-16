import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/layout/AdminLayout';
import { FaUsers, FaMoneyBillWave, FaExchangeAlt, FaChartBar, FaCalendarAlt } from 'react-icons/fa';
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

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalInvestments: 0,
    pendingInvestments: 0,
    totalWithdrawals: 0,
    pendingWithdrawals: 0,
    recentActivities: [],
    pageViews: [],
    weeklyStats: []
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('daily'); // daily, weekly, monthly
  const [pendingInvestments, setPendingInvestments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await adminAPI.getDashboardStats();
        if (response.data.success) {
          setStats(response.data.data);
        } else {
          throw new Error(response.data.message || 'Error fetching dashboard data');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error fetching dashboard data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch user activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Calculate date range based on selected time range
        let startDate = new Date();
        if (timeRange === 'daily') {
          startDate.setDate(startDate.getDate() - 1);
        } else if (timeRange === 'weekly') {
          startDate.setDate(startDate.getDate() - 7);
        } else if (timeRange === 'monthly') {
          startDate.setMonth(startDate.getMonth() - 1);
        }

        const response = await adminAPI.getUserActivities({
          startDate: startDate.toISOString(),
          limit: 100
        });

        if (response.data.success) {
          setActivities(response.data.data.activities);
        } else {
          throw new Error(response.data.message || 'Error fetching activities');
        }
      } catch (err) {
        toast.error('Failed to load user activities');
      }
    };

    fetchActivities();
  }, [timeRange]);

  // Fetch pending investments for verification
  useEffect(() => {
    const fetchPendingInvestments = async () => {
      try {
        const response = await adminAPI.getAllInvestments();
        if (response.data.success) {
          // Filter only pending investments
          const pending = response.data.data.filter(inv => inv.paymentStatus === 'pending');
          // Get only the 5 most recent
          setPendingInvestments(pending.slice(0, 5));
        }
      } catch (err) {
        toast.error('Failed to load pending investments');
      }
    };

    fetchPendingInvestments();
  }, []);

  // Prepare chart data for page views
  const pageViewsChartData = {
    labels: stats.pageViews?.map(item => item._id) || [],
    datasets: [
      {
        label: 'Page Views',
        data: stats.pageViews?.map(item => item.count) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare chart data for user stats
  const userStatsChartData = {
    labels: ['Total Users', 'Active Users'],
    datasets: [
      {
        data: [stats.totalUsers, stats.activeUsers],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // Prepare chart data for weekly stats
  const weeklyStatsChartData = {
    labels: stats.weeklyStats?.map(item => item.date) || [],
    datasets: [
      {
        label: 'New Users',
        data: stats.weeklyStats?.map(item => item.newUsers) || [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'New Investments',
        data: stats.weeklyStats?.map(item => item.newInvestments) || [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setImageModalOpen(false);
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                <FaUsers className="text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                <FaMoneyBillWave className="text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Total Investments</p>
                <p className="text-2xl font-bold">${stats.totalInvestments?.toFixed(2) || '0.00'}</p>
                <p className="text-sm text-yellow-500">{stats.pendingInvestments} pending</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                <FaExchangeAlt className="text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Total Withdrawals</p>
                <p className="text-2xl font-bold">${stats.totalWithdrawals?.toFixed(2) || '0.00'}</p>
                <p className="text-sm text-yellow-500">{stats.pendingWithdrawals} pending</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Time Range Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex items-center mb-4">
            <FaCalendarAlt className="text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold">Activity Time Range</h2>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setTimeRange('daily')}
              className={`px-4 py-2 rounded-md ${
                timeRange === 'daily'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Last 24 Hours
            </button>
            <button
              onClick={() => setTimeRange('weekly')}
              className={`px-4 py-2 rounded-md ${
                timeRange === 'weekly'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeRange('monthly')}
              className={`px-4 py-2 rounded-md ${
                timeRange === 'monthly'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Last 30 Days
            </button>
          </div>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Most Visited Pages</h2>
            <div className="h-64">
              <Bar data={pageViewsChartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">User Statistics</h2>
            <div className="h-64 flex justify-center">
              <Pie data={userStatsChartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Weekly Activity</h2>
            <div className="h-64">
              <Line data={weeklyStatsChartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
        
        {/* Recent Pending Investments with Screenshots */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center">
              <FaMoneyBillWave className="text-green-500 mr-2" />
              <h2 className="text-lg font-semibold">Recent Pending Investments</h2>
            </div>
            <a 
              href="/admin/investments" 
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              View All
            </a>
          </div>
          
          {pendingInvestments.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No pending investments requiring verification
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {pendingInvestments.map(investment => (
                <div key={investment._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{investment.plan?.name || "Investment Plan"}</p>
                      <p className="text-sm text-gray-500">
                        ${investment.amount.toFixed(2)} - {investment.paymentMethod}
                      </p>
                    </div>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <p className="text-xs text-gray-500">User</p>
                    <p className="text-sm font-medium">{investment.user?.name}</p>
                    <p className="text-xs text-gray-500">{investment.user?.email}</p>
                  </div>
                  
                  {/* Transaction Screenshot with enlarged view capability */}
                  {(investment.paymentMethod === 'Easypaisa' || investment.paymentMethod === 'JazzCash') && investment.transactionScreenshot && (
                    <div className="mt-2 mb-2">
                      <p className="text-xs text-gray-500 mb-1">Transaction Screenshot</p>
                      <div className="relative">
                        <img 
                          src={`${process.env.REACT_APP_API_URL || 'web-production-989cb.up.railway.app'}/${investment.transactionScreenshot}`} 
                          alt="Transaction Screenshot" 
                          className="w-full h-32 object-cover border border-gray-200 rounded cursor-pointer hover:opacity-90"
                          onClick={() => openImageModal(`${process.env.REACT_APP_API_URL || 'web-production-989cb.up.railway.app'}/${investment.transactionScreenshot}`)}
                          onError={(e) => {
                            console.error('Dashboard image load error:', `${process.env.REACT_APP_API_URL || 'web-production-989cb.up.railway.app'}/${investment.transactionScreenshot}`);
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/150?text=Image+Error';
                            toast.error('Error loading transaction image in dashboard. Please check server configuration.');
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <div className="bg-black bg-opacity-60 text-white px-3 py-1 rounded">
                            Click to enlarge
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2 mt-2">
                    <a
                      href={`/admin/investments?id=${investment._id}`}
                      className="px-3 py-1 text-sm text-blue-700 hover:bg-blue-50 rounded border border-blue-300"
                    >
                      Review
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Image Modal for full-size viewing */}
        {imageModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={closeImageModal}>
            <div className="max-w-4xl max-h-screen overflow-auto bg-white rounded-lg p-2" onClick={e => e.stopPropagation()}>
              <div className="p-2 flex justify-end">
                <button 
                  onClick={closeImageModal}
                  className="text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>
              <div className="p-2">
                <img 
                  src={selectedImage} 
                  alt="Transaction Screenshot Full Size" 
                  className="max-w-full h-auto"
                  onError={(e) => {
                    console.error('Modal image load error:', selectedImage);
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/800x600?text=Image+Error';
                    toast.error('Error loading full size transaction image. Please check server configuration.');
                  }}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Recent Activity Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="flex items-center p-4 border-b">
            <FaChartBar className="text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold">Recent User Activity</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activities.length > 0 ? (
                  activities.map((activity, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {activity.user?.name || 'Anonymous'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {activity.user?.email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {activity.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.page || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(activity.timestamp)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No activities found for the selected time range.
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