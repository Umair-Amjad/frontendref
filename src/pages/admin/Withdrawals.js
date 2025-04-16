import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/layout/AdminLayout';
import { FaEye, FaSearch, FaFilter, FaCheck, FaTimes, FaSpinner, FaMoneyBillWave, FaUser, FaExclamationCircle } from 'react-icons/fa';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal';

const Withdrawals = () => {
  const { currentUser } = useAuth();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [processModalOpen, setProcessModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processAction, setProcessAction] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      setLoading(true);
      try {
        const response = await adminAPI.getAllWithdrawals();
        if (response.data.success) {
          setWithdrawals(response.data.data);
        } else {
          throw new Error(response.data.message || 'Error fetching withdrawals');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error fetching withdrawals');
        toast.error('Failed to load withdrawals');
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesSearch = 
      withdrawal.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      withdrawal.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.wallet.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && withdrawal.status === filter;
  });

  const viewWithdrawalDetails = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedWithdrawal(null);
  };

  const approveWithdrawal = (withdrawalId) => {
    if (window.confirm('Are you sure you want to approve this withdrawal?')) {
      // In a real application, this would make an API call
      const updatedWithdrawals = withdrawals.map(withdrawal => 
        withdrawal.id === withdrawalId 
          ? { 
              ...withdrawal, 
              status: 'completed', 
              processDate: new Date().toISOString().split('T')[0] 
            } 
          : withdrawal
      );
      setWithdrawals(updatedWithdrawals);
      if (selectedWithdrawal && selectedWithdrawal.id === withdrawalId) {
        setSelectedWithdrawal({
          ...selectedWithdrawal,
          status: 'completed',
          processDate: new Date().toISOString().split('T')[0]
        });
      }
    }
  };

  const rejectWithdrawal = (withdrawalId) => {
    if (window.confirm('Are you sure you want to reject this withdrawal?')) {
      // In a real application, this would make an API call
      const updatedWithdrawals = withdrawals.map(withdrawal => 
        withdrawal.id === withdrawalId 
          ? { 
              ...withdrawal, 
              status: 'rejected', 
              processDate: new Date().toISOString().split('T')[0] 
            } 
          : withdrawal
      );
      setWithdrawals(updatedWithdrawals);
      if (selectedWithdrawal && selectedWithdrawal.id === withdrawalId) {
        setSelectedWithdrawal({
          ...selectedWithdrawal,
          status: 'rejected',
          processDate: new Date().toISOString().split('T')[0]
        });
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'completed') return 'bg-green-100 text-green-800';
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
    if (status === 'rejected') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const openProcessModal = (withdrawal, action) => {
    setSelectedWithdrawal(withdrawal);
    setProcessAction(action);
    setRejectionReason('');
    setProcessModalOpen(true);
  };

  const handleProcessWithdrawal = async () => {
    if (!selectedWithdrawal) return;

    setProcessing(true);
    try {
      const response = await adminAPI.processWithdrawal(selectedWithdrawal._id, {
        status: processAction,
        rejectionReason: processAction === 'rejected' ? rejectionReason : undefined
      });

      if (response.data.success) {
        // Update withdrawal in state
        setWithdrawals(prevWithdrawals => 
          prevWithdrawals.map(withdrawal => 
            withdrawal._id === selectedWithdrawal._id 
              ? { ...withdrawal, status: processAction, rejectionReason: processAction === 'rejected' ? rejectionReason : withdrawal.rejectionReason } 
              : withdrawal
          )
        );
        
        toast.success(`Withdrawal ${processAction === 'completed' ? 'approved' : 'rejected'} successfully`);
        setProcessModalOpen(false);
      } else {
        throw new Error(response.data.message || 'Failed to process withdrawal');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to process withdrawal');
    } finally {
      setProcessing(false);
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
          <h1 className="text-2xl font-bold">Withdrawal Management</h1>
          
          <div className="flex space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search withdrawals..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        {loading ? (
          <p className="text-center py-4">Loading withdrawals...</p>
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
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredWithdrawals.map(withdrawal => (
                    <tr key={withdrawal.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{withdrawal.user.name}</div>
                        <div className="text-sm text-gray-500">{withdrawal.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        ${withdrawal.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {withdrawal.method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(withdrawal.requestDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(withdrawal.status)}`}>
                          {withdrawal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => viewWithdrawalDetails(withdrawal)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FaEye className="inline mr-1" /> View
                        </button>
                        
                        {withdrawal.status === 'pending' && (
                          <>
                            <button
                              onClick={() => openProcessModal(withdrawal, 'completed')}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              <FaCheck className="inline mr-1" /> Approve
                            </button>
                            
                            <button
                              onClick={() => openProcessModal(withdrawal, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTimes className="inline mr-1" /> Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Withdrawal Details Modal */}
      {showModal && selectedWithdrawal && (
        <Modal
          isOpen={showModal}
          onClose={closeModal}
          title="Withdrawal Details"
        >
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">User</h3>
                <p className="text-sm text-gray-900">{selectedWithdrawal.user.name}</p>
                <p className="text-sm text-gray-500">{selectedWithdrawal.user.email}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                <p className="text-sm text-gray-900">${selectedWithdrawal.amount.toFixed(2)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Method</h3>
                <p className="text-sm text-gray-900">{selectedWithdrawal.method}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className={`text-sm ${
                  selectedWithdrawal.status === 'completed' ? 'text-green-600' : 
                  selectedWithdrawal.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {selectedWithdrawal.status.charAt(0).toUpperCase() + selectedWithdrawal.status.slice(1)}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Request Date</h3>
                <p className="text-sm text-gray-900">{new Date(selectedWithdrawal.requestDate).toLocaleDateString()}</p>
              </div>
              
              {selectedWithdrawal.processDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Process Date</h3>
                  <p className="text-sm text-gray-900">{new Date(selectedWithdrawal.processDate).toLocaleDateString()}</p>
                </div>
              )}
              
              <div className="col-span-2">
                {selectedWithdrawal.paymentDetails ? (
                  <>
                    <h3 className="text-sm font-medium text-gray-500">Payment Details</h3>
                    {selectedWithdrawal.method === 'USDT' && (
                      <div>
                        <p className="text-sm text-gray-900 break-all">Wallet: {selectedWithdrawal.paymentDetails.walletAddress}</p>
                        <p className="text-sm text-gray-900">Network: {selectedWithdrawal.paymentDetails.network}</p>
                      </div>
                    )}
                    {(selectedWithdrawal.method === 'JazzCash' || selectedWithdrawal.method === 'EasyPaisa') && (
                      <div>
                        <p className="text-sm text-gray-900">Phone: {selectedWithdrawal.paymentDetails.phoneNumber}</p>
                        <p className="text-sm text-gray-900">Account Name: {selectedWithdrawal.paymentDetails.accountName}</p>
                      </div>
                    )}
                    {(selectedWithdrawal.method === 'Bitcoin' || selectedWithdrawal.method === 'Ethereum') && (
                      <p className="text-sm text-gray-900 break-all">Wallet: {selectedWithdrawal.paymentDetails.walletAddress}</p>
                    )}
                  </>
                ) : (
                  <>
                    <h3 className="text-sm font-medium text-gray-500">Wallet Address</h3>
                    <p className="text-sm text-gray-900 break-all">{selectedWithdrawal.wallet}</p>
                  </>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 flex justify-end space-x-3">
              {selectedWithdrawal.status === 'pending' && (
                <>
                  <button
                    onClick={() => openProcessModal(selectedWithdrawal, 'completed')}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Approve Withdrawal
                  </button>
                  
                  <button
                    onClick={() => openProcessModal(selectedWithdrawal, 'rejected')}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Reject Withdrawal
                  </button>
                </>
              )}
              
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Process Withdrawal Modal */}
      <Modal
        isOpen={processModalOpen}
        onClose={() => !processing && setProcessModalOpen(false)}
        title={processAction === 'completed' ? 'Approve Withdrawal' : 'Reject Withdrawal'}
      >
        {selectedWithdrawal && (
          <div className="p-4">
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <FaExclamationCircle className={`mr-2 ${processAction === 'completed' ? 'text-green-500' : 'text-red-500'}`} />
                <h3 className="text-lg font-medium">
                  {processAction === 'completed' ? 'Approve Withdrawal' : 'Reject Withdrawal'}
                </h3>
              </div>
              <p className="text-gray-600">
                {processAction === 'completed' 
                  ? 'Are you sure you want to approve this withdrawal request? This action cannot be undone.' 
                  : 'Are you sure you want to reject this withdrawal request? Please provide a reason for rejection.'}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="text-lg font-bold">${selectedWithdrawal.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User</p>
                  <p className="text-sm font-medium">{selectedWithdrawal.user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="text-sm font-medium">{selectedWithdrawal.method}</p>
                  {selectedWithdrawal.type && (
                    <p className="text-xs text-gray-500">Type: {selectedWithdrawal.type}</p>
                  )}
                </div>
              </div>
            </div>

            {processAction === 'rejected' && (
              <div className="mb-4">
                <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-1">
                  Rejection Reason (Required)
                </label>
                <textarea
                  id="rejectionReason"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please provide a reason for rejecting this withdrawal"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                ></textarea>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setProcessModalOpen(false)}
                disabled={processing}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessWithdrawal}
                disabled={processing || (processAction === 'rejected' && !rejectionReason)}
                className={`px-4 py-2 rounded-md text-white ${
                  processAction === 'completed' 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-red-500 hover:bg-red-600'
                } disabled:opacity-50 flex items-center`}
              >
                {processing ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : processAction === 'completed' ? (
                  <>
                    <FaCheck className="mr-2" />
                    Approve Withdrawal
                  </>
                ) : (
                  <>
                    <FaTimes className="mr-2" />
                    Reject Withdrawal
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default Withdrawals; 