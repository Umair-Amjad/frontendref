import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';
import { FaCheck, FaTimes, FaSpinner, FaEye, FaMoneyBillWave, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import Modal from '../../components/Modal';
import { imageErrorHandler } from '../../services/api';

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [verificationAction, setVerificationAction] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  
  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllInvestments();
      
      if (response.data.success) {
        setInvestments(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to load investments');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load investments';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInvestments();
  }, []);
  
  const filteredInvestments = investments.filter(investment => {
    if (activeTab === 'pending') {
      return investment.paymentStatus === 'pending';
    } else if (activeTab === 'active') {
      return investment.status === 'active';
    } else if (activeTab === 'completed') {
      return investment.status === 'completed';
    } else if (activeTab === 'cancelled') {
      return investment.status === 'cancelled';
    } else if (activeTab === 'rejected') {
      return investment.paymentStatus === 'rejected';
    }
    return true;
  });
  
  const handleVerify = async () => {
    if (!selectedInvestment) return;
    
    setVerifyLoading(true);
    try {
      const response = await adminAPI.verifyInvestmentPayment(selectedInvestment._id, {
        status: verificationAction,
        rejectionReason: verificationAction === 'rejected' ? rejectionReason : undefined
      });
      
      if (response.data.success) {
        toast.success(`Investment ${verificationAction === 'confirmed' ? 'verified' : 'rejected'} successfully`);
        fetchInvestments();
        setVerifyModalOpen(false);
      } else {
        throw new Error(response.data.message || 'Failed to verify investment');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to verify investment';
      toast.error(errorMessage);
    } finally {
      setVerifyLoading(false);
    }
  };
  
  const openVerifyModal = (investment, action) => {
    setSelectedInvestment(investment);
    setVerificationAction(action);
    setRejectionReason('');
    setVerifyModalOpen(true);
  };
  
  const openDetailsModal = (investment) => {
    setSelectedInvestment(investment);
    setDetailsModalOpen(true);
  };
  
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };
  
  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString();
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Completed</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Cancelled</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };
  
  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Confirmed</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Rejected</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Investments</h1>
          <button
            onClick={fetchInvestments}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-4">
            <button
              className={`px-3 py-2 text-sm font-medium ${activeTab === 'pending' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Verification
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">
                {investments.filter(inv => inv.paymentStatus === 'pending').length}
              </span>
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium ${activeTab === 'active' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('active')}
            >
              Active
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium ${activeTab === 'completed' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium ${activeTab === 'rejected' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('rejected')}
            >
              Rejected
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
          </nav>
        </div>
        
        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
        ) : filteredInvestments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500">No investments found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredInvestments.map(investment => (
              <div
                key={investment._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center">
                        <h2 className="text-lg font-semibold">{investment.plan?.name || 'Investment Plan'}</h2>
                        <span className="ml-2 text-sm text-gray-500">#{investment._id.substring(0, 8)}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Created {formatDistanceToNow(new Date(investment.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {getStatusBadge(investment.status)}
                      {getPaymentStatusBadge(investment.paymentStatus)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">User</p>
                      <div className="flex items-center">
                        <FaUser className="text-gray-400 mr-1" />
                        <p className="text-sm font-medium">
                          {investment.user?.name || 'Unknown'}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">{investment.user?.email || ''}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <div className="flex items-center">
                        <FaMoneyBillWave className="text-green-500 mr-1" />
                        <p className="text-sm font-medium">${investment.amount.toFixed(2)}</p>
                      </div>
                      <p className="text-xs text-gray-500">ROI: {investment.returns}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Payment Method</p>
                      <p className="text-sm font-medium">{investment.paymentMethod}</p>
                    </div>
                  </div>
                  
                  {/* Transaction Screenshot Preview */}
                  {(investment.paymentMethod === 'Easypaisa' || investment.paymentMethod === 'JazzCash') && investment.transactionScreenshot && (
                    <div className="mt-2 mb-4">
                      <p className="text-xs text-gray-500 mb-1 font-semibold">Transaction Screenshot</p>
                      <div className="flex items-center">
                        <div className="relative">
                          <img 
                            src={`${process.env.REACT_APP_API_URL || 'https://web-production-989cb.up.railway.app'}/uploads/${investment.transactionScreenshot?.split('/').pop().replace('uploads/transactions/', '')}`} 
                            alt="Transaction Screenshot" 
                            className="h-24 w-auto border-2 border-blue-300 rounded cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                            onClick={() => openDetailsModal(investment)}
                            onError={(e) => {
                              console.error('Investment image load error:', investment.transactionScreenshot);
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/800x600?text=Image+Error';
                              if (imageErrorHandler.trackError(`Failed to load ${investment.transactionScreenshot}`)) {
                                toast.error('Error loading full size transaction image. Please check server configuration.');
                              }
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <div className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                              Click to view details
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => openDetailsModal(investment)}
                          className="ml-2 px-3 py-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md"
                        >
                          View Full Size
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'pending' && (
                    <div className="flex justify-end space-x-3 border-t pt-4 mt-2">
                      <button
                        onClick={() => openDetailsModal(investment)}
                        className="px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 flex items-center text-sm"
                      >
                        <FaEye className="mr-1" /> View Details
                      </button>
                      <button
                        onClick={() => openVerifyModal(investment, 'confirmed')}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center text-sm"
                      >
                        <FaCheck className="mr-1" /> Verify
                      </button>
                      <button
                        onClick={() => openVerifyModal(investment, 'rejected')}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center text-sm"
                      >
                        <FaTimes className="mr-1" /> Reject
                      </button>
                    </div>
                  )}
                  
                  {investment.paymentStatus === 'rejected' && investment.rejectionReason && (
                    <div className="mt-4 p-3 bg-red-50 rounded-md">
                      <p className="text-xs font-medium text-red-800">Rejection Reason:</p>
                      <p className="text-sm text-red-700">{investment.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Details Modal */}
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title="Investment Details"
        >
          {selectedInvestment && (
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Investment Information</h3>
              <div className="mb-4 grid grid-cols-2 gap-2">
                <div className="text-gray-600">User:</div>
                <div className="font-medium">{selectedInvestment.user?.name || 'Unknown'}</div>
                
                <div className="text-gray-600">Amount:</div>
                <div className="font-medium">${selectedInvestment.amount.toFixed(2)}</div>
                
                <div className="text-gray-600">Payment Method:</div>
                <div className="font-medium">{selectedInvestment.paymentMethod}</div>
                
                <div className="text-gray-600">Status:</div>
                <div className="font-medium">{selectedInvestment.status}</div>
                
                <div className="text-gray-600">Payment Status:</div>
                <div className="font-medium">{selectedInvestment.paymentStatus}</div>
                
                <div className="text-gray-600">Created At:</div>
                <div className="font-medium">{formatDate(selectedInvestment.createdAt)}</div>
                
                {/* Display payment recipient details for JazzCash and Easypaisa if available */}
                {(selectedInvestment.paymentMethod === 'JazzCash' || selectedInvestment.paymentMethod === 'Easypaisa') && 
                  selectedInvestment.paymentRecipient && (
                  <>
                    <div className="col-span-2 border-t border-gray-200 mt-2 pt-2 mb-1">
                      <div className="font-medium">Payment Recipient Details:</div>
                    </div>
                    
                    <div className="text-gray-600">Account Number:</div>
                    <div className="font-medium">{selectedInvestment.paymentRecipient.phoneNumber}</div>
                    
                    <div className="text-gray-600">Account Name:</div>
                    <div className="font-medium">{selectedInvestment.paymentRecipient.accountName}</div>
                  </>
                )}
              </div>
              
              {selectedInvestment.transactionScreenshot && (
                <>
                  <h3 className="text-lg font-semibold mt-4 mb-2">Transaction Screenshot</h3>
                  <div className="border rounded overflow-hidden">
                    <img 
                      src={`${process.env.REACT_APP_API_URL || 'https://web-production-989cb.up.railway.app'}/uploads/${selectedInvestment.transactionScreenshot?.split('/').pop().replace('uploads/transactions/', '')}`}
                      alt="Transaction Screenshot"
                      className="max-w-full"
                    />
                  </div>
                </>
              )}
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setDetailsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>
        
        {/* Verification Modal */}
        <Modal
          isOpen={verifyModalOpen}
          onClose={() => !verifyLoading && setVerifyModalOpen(false)}
          title={verificationAction === 'confirmed' ? 'Verify Investment' : 'Reject Investment'}
        >
          {selectedInvestment && (
            <div className="p-4">
              <p className="mb-4">
                Are you sure you want to {verificationAction === 'confirmed' ? 'verify' : 'reject'} this investment of ${selectedInvestment.amount.toFixed(2)} by {selectedInvestment.user?.name}?
              </p>
              
              {verificationAction === 'rejected' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rejection Reason (Required)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Please provide a reason for rejection"
                    required
                  />
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => !verifyLoading && setVerifyModalOpen(false)}
                  disabled={verifyLoading}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerify}
                  disabled={verifyLoading || (verificationAction === 'rejected' && !rejectionReason)}
                  className={`px-4 py-2 rounded text-white flex items-center ${
                    verificationAction === 'confirmed' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-red-500 hover:bg-red-600'
                  } disabled:opacity-50`}
                >
                  {verifyLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {verificationAction === 'confirmed' ? <FaCheck className="mr-2" /> : <FaTimes className="mr-2" />}
                      {verificationAction === 'confirmed' ? 'Verify' : 'Reject'}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default Investments;