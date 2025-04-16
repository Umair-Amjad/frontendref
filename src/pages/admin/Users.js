import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/layout/AdminLayout';
import { FaEdit, FaTrash, FaSearch, FaCheckCircle, FaTimesCircle, FaUser, FaEye, FaLock, FaLockOpen, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal';

const Users = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await adminAPI.getAllUsers();
        if (response.data.success) {
          setUsers(response.data.data);
          setFilteredUsers(response.data.data);
        } else {
          throw new Error(response.data.message || 'Error fetching users');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error fetching users');
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditUser = (user) => {
    setCurrentUserData(user);
    setShowModal(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // In a real application, this would make an API call
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    // In a real application, this would make an API call
    const updatedUsers = users.map(user => 
      user.id === currentUserData.id ? currentUserData : user
    );
    setUsers(updatedUsers);
    setShowModal(false);
  };

  const handleVerifyUser = (userId) => {
    // In a real application, this would make an API call
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, isVerified: true } : user
    );
    setUsers(updatedUsers);
  };

  const openDetailsModal = (user) => {
    setSelectedUser(user);
    setDetailsModalOpen(true);
  };

  const toggleUserActive = async (userId) => {
    setToggleLoading(true);
    try {
      const response = await adminAPI.toggleUserActive(userId);
      if (response.data.success) {
        // Update the user in the state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === userId 
              ? { ...user, isActive: !user.isActive } 
              : user
          )
        );
        toast.success(response.data.message || 'User status updated successfully');
      } else {
        throw new Error(response.data.message || 'Failed to update user status');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update user status');
    } finally {
      setToggleLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
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

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        {loading ? (
          <p className="text-center py-4">Loading users...</p>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registered
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verified
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map(user => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {user.avatar ? (
                              <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                            ) : (
                              <FaUser className="text-gray-500" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${user.balance?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.isVerified ? (
                          <FaCheckCircle className="text-green-500" />
                        ) : (
                          <button
                            onClick={() => handleVerifyUser(user._id)}
                            className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                          >
                            <FaTimesCircle className="text-red-500 mr-1" /> Verify Now
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                            onClick={() => openDetailsModal(user)}
                          >
                            <FaEye className="mr-1" /> View
                          </button>
                          <button
                            className={`${
                              user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                            } flex items-center`}
                            onClick={() => toggleUserActive(user._id)}
                            disabled={toggleLoading}
                          >
                            {user.isActive ? (
                              <>
                                <FaLock className="mr-1" /> Disable
                              </>
                            ) : (
                              <>
                                <FaLockOpen className="mr-1" /> Enable
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            
            <form onSubmit={handleUpdateUser}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={currentUserData?.name || ''}
                  onChange={(e) => setCurrentUserData({...currentUserData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={currentUserData?.email || ''}
                  onChange={(e) => setCurrentUserData({...currentUserData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={currentUserData?.phone || ''}
                  onChange={(e) => setCurrentUserData({...currentUserData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={currentUserData?.status || ''}
                  onChange={(e) => setCurrentUserData({...currentUserData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title="User Details"
      >
        {selectedUser && (
          <div className="p-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                {selectedUser.avatar ? (
                  <img className="h-16 w-16 rounded-full" src={selectedUser.avatar} alt="" />
                ) : (
                  <FaUser className="text-gray-500 text-2xl" />
                )}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
                <p className="text-gray-600">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="text-sm font-medium">{selectedUser._id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Registered On</p>
                <p className="text-sm font-medium">{formatDate(selectedUser.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className="flex items-center">
                  {selectedUser.isActive ? (
                    <FaToggleOn className="text-green-500 mr-1" />
                  ) : (
                    <FaToggleOff className="text-red-500 mr-1" />
                  )}
                  <span className={selectedUser.isActive ? 'text-green-600' : 'text-red-600'}>
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-sm font-medium">{selectedUser.isAdmin ? 'Administrator' : 'Regular User'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Verified Email</p>
                <p className="text-sm font-medium">{selectedUser.isVerified ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-sm font-medium">{selectedUser.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-2">
              <h3 className="text-lg font-semibold mb-2">Financial Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Available Balance</p>
                  <p className="text-lg font-bold text-green-600">${selectedUser.balance?.toFixed(2) || "0.00"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Invested</p>
                  <p className="text-lg font-bold text-blue-600">${selectedUser.totalInvested?.toFixed(2) || "0.00"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Withdrawn</p>
                  <p className="text-lg font-bold text-purple-600">${selectedUser.totalWithdrawn?.toFixed(2) || "0.00"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Earned</p>
                  <p className="text-lg font-bold text-indigo-600">${selectedUser.totalEarned?.toFixed(2) || "0.00"}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="text-lg font-semibold mb-2">Referral Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Referral Code</p>
                  <p className="text-md font-medium">{selectedUser.referralCode || 'Not generated'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Referred By</p>
                  <p className="text-md font-medium">
                    {selectedUser.referredBy ? selectedUser.referredBy.name || selectedUser.referredBy.email : 'None'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Referrals</p>
                  <p className="text-lg font-bold text-blue-600">{selectedUser.referrals?.length || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Referral Earnings</p>
                  <p className="text-lg font-bold text-green-600">${selectedUser.referralEarnings?.toFixed(2) || "0.00"}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Close
              </button>
              <button
                onClick={() => {
                  toggleUserActive(selectedUser._id);
                  setDetailsModalOpen(false);
                }}
                className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                  selectedUser.isActive
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                } focus:outline-none`}
                disabled={toggleLoading}
              >
                {selectedUser.isActive ? 'Disable Account' : 'Enable Account'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default Users;