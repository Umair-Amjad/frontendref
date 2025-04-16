import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';
import { FaUser, FaEye, FaCalendarAlt, FaFilter, FaSync, FaChartBar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#6B66FF'];

const ActivityLogs = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [meta, setMeta] = useState({
    total: 0,
    limit: 50,
    skip: 0,
    pageViewMetrics: [],
    activeUsers: []
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    userId: '',
    type: '',
    page: '',
    startDate: '',
    endDate: ''
  });
  
  const fetchActivities = async (params = {}) => {
    setLoading(true);
    try {
      const response = await adminAPI.getUserActivities({
        ...filters,
        ...params
      });
      
      if (response.data.success) {
        setActivities(response.data.data.activities);
        setMeta(response.data.data.meta);
      } else {
        throw new Error(response.data.message || 'Failed to load activity logs');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load activity logs';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchActivities();
  }, []);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const applyFilters = () => {
    fetchActivities({ skip: 0 }); // Reset pagination when applying filters
  };
  
  const resetFilters = () => {
    setFilters({
      userId: '',
      type: '',
      page: '',
      startDate: '',
      endDate: ''
    });
    fetchActivities({ 
      userId: '',
      type: '',
      page: '',
      startDate: '',
      endDate: '',
      skip: 0
    });
  };
  
  const handlePageChange = (newSkip) => {
    if (newSkip >= 0 && newSkip < meta.total) {
      fetchActivities({ skip: newSkip });
    }
  };
  
  const formatTimestamp = (timestamp) => {
    try {
      return format(new Date(timestamp), 'MMM dd, yyyy HH:mm:ss');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  const getActivityIcon = (type) => {
    switch (type) {
      case 'page_view':
        return <FaEye className="text-blue-500" />;
      case 'user_action':
        return <FaUser className="text-green-500" />;
      default:
        return <FaCalendarAlt className="text-purple-500" />;
    }
  };
  
  const renderPageViewChart = () => {
    if (!meta.pageViewMetrics || meta.pageViewMetrics.length === 0) {
      return <p className="text-center py-4 text-gray-500">No page view data available</p>;
    }
    
    const chartData = meta.pageViewMetrics.map(metric => ({
      name: metric._id.length > 15 ? `${metric._id.substring(0, 15)}...` : metric._id,
      views: metric.count,
      fullName: metric._id
    }));
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value, name, props) => [value, props.payload.fullName]} />
          <Legend />
          <Bar dataKey="views" fill="#8884d8" name="Page Views" />
        </BarChart>
      </ResponsiveContainer>
    );
  };
  
  const renderActiveUsersChart = () => {
    if (!meta.activeUsers || meta.activeUsers.length === 0) {
      return <p className="text-center py-4 text-gray-500">No active user data available</p>;
    }
    
    const chartData = meta.activeUsers.map(user => ({
      name: user.user?.name || 'Unknown',
      value: user.activityCount,
      email: user.user?.email || 'Unknown'
    }));
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name, props) => [value, `${props.payload.name} (${props.payload.email})`]} />
        </PieChart>
      </ResponsiveContainer>
    );
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Activity Logs</h1>
          <button
            onClick={() => fetchActivities()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
          >
            <FaSync className="mr-2" /> Refresh
          </button>
        </div>
        
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <FaFilter className="text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <input
                type="text"
                name="userId"
                value={filters.userId}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="User ID"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All Types</option>
                <option value="page_view">Page View</option>
                <option value="user_action">User Action</option>
                <option value="system_event">System Event</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page</label>
              <input
                type="text"
                name="page"
                value={filters.page}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Page Path"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={applyFilters}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Apply Filters
            </button>
            
            <button
              onClick={resetFilters}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Reset Filters
            </button>
          </div>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FaChartBar className="text-blue-500 mr-2" />
              <h2 className="text-lg font-semibold">Most Visited Pages</h2>
            </div>
            {renderPageViewChart()}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FaUser className="text-blue-500 mr-2" />
              <h2 className="text-lg font-semibold">Most Active Users (24h)</h2>
            </div>
            {renderActiveUsersChart()}
          </div>
        </div>
        
        {/* Activity Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Activity History</h2>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p>{error}</p>
            </div>
          ) : activities.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No activities found with the selected filters.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activities.map((activity, index) => (
                      <tr key={activity._id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getActivityIcon(activity.type)}
                            <span className="ml-2 text-sm text-gray-900">
                              {activity.type === 'page_view' ? 'Page View' : 
                               activity.type === 'user_action' ? 'User Action' : 'System Event'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {activity.user?.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {activity.user?.email || 'Unknown'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {activity.type === 'page_view' ? (
                            <div>
                              <span className="text-sm font-medium text-gray-900">
                                {activity.page || 'Unknown page'}
                              </span>
                              {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {JSON.stringify(activity.metadata)}
                                </div>
                              )}
                            </div>
                          ) : activity.type === 'user_action' ? (
                            <div>
                              <span className="text-sm font-medium text-gray-900">
                                {activity.action || 'Unknown action'}
                              </span>
                              {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {JSON.stringify(activity.metadata)}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">
                              {JSON.stringify(activity.metadata || {})}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatTimestamp(activity.timestamp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{meta.skip + 1}</span> to <span className="font-medium">{Math.min(meta.skip + activities.length, meta.total)}</span> of <span className="font-medium">{meta.total}</span> activities
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(meta.skip - meta.limit)}
                    disabled={meta.skip === 0}
                    className={`px-3 py-1 border rounded-md ${meta.skip === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(meta.skip + meta.limit)}
                    disabled={meta.skip + meta.limit >= meta.total}
                    className={`px-3 py-1 border rounded-md ${meta.skip + meta.limit >= meta.total ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ActivityLogs; 