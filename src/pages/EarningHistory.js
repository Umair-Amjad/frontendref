import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaFilter, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Layout from '../components/layout/Layout';
import PageHeader from '../components/ui/PageHeader';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { userAPI, withdrawalAPI } from '../services/api';

const EarningHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalEarned: 0,
    totalWithdrawn: 0,
    pendingWithdrawals: 0,
    referralEarnings: 0
  });
  
  const ITEMS_PER_PAGE = 10;
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        
        // In a real application, get all data from backend
        const withdrawalsResponse = await withdrawalAPI.getUserWithdrawals();
        const withdrawals = withdrawalsResponse.data.success ? 
          withdrawalsResponse.data.data.map(w => ({
            ...w,
            type: 'withdrawal',
            date: w.createdAt,
            amount: -w.amount // Negative for withdrawals
          })) : [];
          
        // Get referral earnings
        const referralsResponse = await userAPI.getReferralInfo();
        const referrals = referralsResponse.data?.success ?
          referralsResponse.data.data.referralEarnings.map(r => ({
            ...r,
            type: 'referral',
            date: r.date || r.createdAt
          })) : [];
          
        // Get dashboard stats for investment returns
        const dashboardResponse = await userAPI.getDashboardStats();
        const investmentData = dashboardResponse.data?.success ? 
          dashboardResponse.data.data.recentInvestments.map(i => ({
            ...i,
            type: 'investment',
            date: i.createdAt,
            amount: i.amount,
            returns: i.expectedReturn,
            plan: i.plan
          })) : [];
        
        // Calculate stats
        const totalEarned = dashboardResponse.data?.success ? 
          dashboardResponse.data.data.totalEarned : 0;
          
        const totalReferralEarned = dashboardResponse.data?.success ?
          dashboardResponse.data.data.totalReferralEarned : 0;
          
        const totalWithdrawn = withdrawals.reduce((total, w) => 
          w.status === 'completed' ? total + Math.abs(w.amount) : total, 0);
          
        const pendingWithdrawals = withdrawals.reduce((total, w) => 
          w.status === 'pending' ? total + Math.abs(w.amount) : total, 0);
        
        setStats({
          totalEarned,
          totalWithdrawn,
          pendingWithdrawals,
          referralEarnings: totalReferralEarned
        });
        
        // Combine all transactions
        const allTransactions = [
          ...investmentData,
          ...referrals,
          ...withdrawals
        ].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setTransactions(allTransactions);
      } catch (err) {
        console.error('Error fetching transaction history:', err);
        setError('Failed to load transaction history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);
  
  // Filter and paginate transactions
  useEffect(() => {
    // Apply filters
    let filtered = [...transactions];
    
    if (filter !== 'all') {
      filtered = filtered.filter(t => t.type === filter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.plan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredTransactions(filtered);
    setTotalPages(Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE)));
    setCurrentPage(1); // Reset to first page on filter change
  }, [filter, searchTerm, transactions]);
  
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredTransactions.slice(startIndex, endIndex);
  };
  
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }
  
  const getTransactionStatusColor = (transaction) => {
    const { type, status } = transaction;
    
    if (type === 'withdrawal') {
      if (status === 'completed') return 'text-green-600 bg-green-50';
      if (status === 'pending') return 'text-yellow-600 bg-yellow-50';
      if (status === 'rejected') return 'text-red-600 bg-red-50';
      return 'text-gray-600 bg-gray-50';
    } else if (type === 'referral') {
      return 'text-purple-600 bg-purple-50';
    } else if (type === 'investment') {
      if (status === 'active') return 'text-blue-600 bg-blue-50';
      if (status === 'completed') return 'text-green-600 bg-green-50';
      return 'text-gray-600 bg-gray-50';
    }
    
    return 'text-gray-600 bg-gray-50';
  };
  
  const formatTransactionType = (transaction) => {
    const { type, status } = transaction;
    
    if (type === 'withdrawal') return 'Withdrawal';
    if (type === 'referral') return 'Referral Bonus';
    if (type === 'investment') {
      if (status === 'completed') return 'Investment Return';
      return 'Investment';
    }
    
    return type;
  };
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Earnings & Transaction History"
          description="View your complete transaction history and earnings"
          icon={<FaChartLine className="text-primary" />}
        />
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Earned</h3>
            <p className="text-xl font-bold text-green-600">${stats.totalEarned.toFixed(2)}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Referral Earnings</h3>
            <p className="text-xl font-bold text-purple-600">${stats.referralEarnings.toFixed(2)}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Withdrawn</h3>
            <p className="text-xl font-bold text-blue-600">${stats.totalWithdrawn.toFixed(2)}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Pending Withdrawals</h3>
            <p className="text-xl font-bold text-yellow-600">${stats.pendingWithdrawals.toFixed(2)}</p>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
              <div className="flex space-x-2">
                <button 
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filter === 'investment' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setFilter('investment')}
                >
                  Investments
                </button>
                <button 
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filter === 'referral' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setFilter('referral')}
                >
                  Referrals
                </button>
                <button 
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filter === 'withdrawal' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setFilter('withdrawal')}
                >
                  Withdrawals
                </button>
              </div>
              
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getCurrentPageData().length > 0 ? (
                  getCurrentPageData().map((transaction, index) => (
                    <motion.tr 
                      key={transaction.id || transaction._id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0, 
                        transition: { delay: index * 0.05 } 
                      }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {formatTransactionType(transaction)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}>
                          {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.plan || transaction.paymentMethod || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTransactionStatusColor(transaction)}`}>
                          {transaction.status || 'Completed'}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500">
                      No transactions found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredTransactions.length > 0 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredTransactions.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === i + 1
                            ? 'z-10 bg-primary border-primary text-white'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EarningHistory; 