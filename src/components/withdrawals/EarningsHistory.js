import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartLine, FaSort, FaSortUp, FaSortDown, FaSearch } from 'react-icons/fa';
import { formatCurrency, getStatusClass, formatDate } from './formatters';

const EarningsHistory = ({ earnings = [], loading }) => {
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Ensure earnings is an array
  const earningsArray = Array.isArray(earnings) ? earnings : [];
  
  // Filter based on search term
  const filteredEarnings = earningsArray.filter(earning => 
    (earning.source?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (earning.type?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );
  
  // Sort data
  const sortedEarnings = [...filteredEarnings].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'createdAt' || sortField === 'date') {
      comparison = new Date(a[sortField] || a.createdAt || 0) - new Date(b[sortField] || b.createdAt || 0);
    } else if (sortField === 'amount') {
      comparison = (parseFloat(a.amount) || 0) - (parseFloat(b.amount) || 0);
    } else if (sortField === 'source') {
      comparison = (a.source || '').localeCompare(b.source || '');
    } else if (sortField === 'type') {
      comparison = (a.type || '').localeCompare(b.type || '');
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  // Only show first 5 items by default
  const displayEarnings = isExpanded ? sortedEarnings : sortedEarnings.slice(0, 5);
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="text-gray-400" />;
    return sortDirection === 'asc' ? <FaSortUp className="text-blue-500" /> : <FaSortDown className="text-blue-500" />;
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <FaChartLine className="text-blue-500 mr-2" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">Earnings History</h3>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search earnings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('createdAt')}>
                <div className="flex items-center">
                  <span>Date</span>
                  <span className="ml-1">{getSortIcon('createdAt')}</span>
                </div>
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('amount')}>
                <div className="flex items-center">
                  <span>Amount</span>
                  <span className="ml-1">{getSortIcon('amount')}</span>
                </div>
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('type')}>
                <div className="flex items-center">
                  <span>Type</span>
                  <span className="ml-1">{getSortIcon('type')}</span>
                </div>
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('source')}>
                <div className="flex items-center">
                  <span>Source</span>
                  <span className="ml-1">{getSortIcon('source')}</span>
                </div>
              </th>
              <th className="px-4 py-3">
                <div className="flex items-center">
                  <span>Status</span>
                </div>
              </th>
            </tr>
          </thead>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {displayEarnings.length > 0 ? (
                displayEarnings.map((earning, index) => (
                  <motion.tr 
                    key={earning._id || index}
                    variants={itemVariants}
                    className="border-b hover:bg-gray-50"
                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                  >
                    <td className="px-4 py-3">
                      {formatDate(earning.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-green-600 font-medium">
                      {formatCurrency(earning.amount)}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {earning.type || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      {earning.source || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(earning.status)}`}>
                        {earning.status || 'Unknown'}
                      </span>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    No earnings found. Start investing or refer friends to earn!
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </motion.tbody>
        </table>
      </div>
      
      {sortedEarnings.length > 5 && (
        <div className="mt-4 flex justify-center">
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500 hover:text-blue-700 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isExpanded ? 'Show Less' : `Show All (${sortedEarnings.length})`}
            <motion.span 
              className="ml-1"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              ▼
            </motion.span>
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default EarningsHistory; 