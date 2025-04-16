import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaArrowUp, FaArrowDown, FaClock } from 'react-icons/fa';
import { investmentAPI } from '../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Investments = () => {
  const { currentUser } = useAuth();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchInvestments = async () => {
      setLoading(true);
      try {
        const response = await investmentAPI.getUserInvestments();
        
        if (response.data.success) {
          setInvestments(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to load investments');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load investment data';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  const filteredInvestments = activeFilter === 'all' 
    ? investments 
    : investments.filter(inv => inv.status === activeFilter);

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalProfit = investments.reduce((sum, inv) => {
    // Only count profit for active and completed investments
    if (inv.status === 'active' || inv.status === 'completed') {
      return sum + (inv.expectedReturn - inv.amount);
    }
    return sum;
  }, 0);
  const activeInvestments = investments.filter(inv => inv.status === 'active').length;

  const getStatusIcon = (status) => {
    if (status === 'active') return <FaArrowUp className="text-green-500" />;
    if (status === 'completed') return <FaArrowDown className="text-blue-500" />;
    if (status === 'pending') return <FaClock className="text-yellow-500" />;
    return <FaClock className="text-red-500" />;
  };

  const calculateProgress = (investment) => {
    if (!investment || !investment.startDate || !investment.endDate) return 0;
    
    // Calculate time-based progress
    const startDate = new Date(investment.startDate);
    const endDate = new Date(investment.endDate);
    const currentDate = new Date();
    
    if (currentDate < startDate) return 0;
    if (currentDate > endDate) return 100;
    
    const totalDuration = endDate - startDate;
    const elapsed = currentDate - startDate;
    const timeProgress = Math.round((elapsed / totalDuration) * 100);
    
    // Calculate earnings-based progress
    // Assuming the investment earns linearly over time
    const totalProfit = investment.expectedReturn - investment.amount;
    const earnedProfit = (totalProfit * timeProgress) / 100;
    const earningsProgress = Math.round((earnedProfit / totalProfit) * 100);
    
    return {
      timeProgress,
      earningsProgress,
      earnedProfit
    };
  };

  const getDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    
    const end = new Date(endDate);
    const current = new Date();
    const diffTime = end - current;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getPaymentStatusBadge = (status) => {
    if (status === 'confirmed') return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Confirmed</span>;
    if (status === 'rejected') return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
    return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Investments</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Total Invested</h2>
          <p className="text-3xl font-bold text-gray-800">${totalInvested.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">Across all plans</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Expected Profit</h2>
          <p className="text-3xl font-bold text-green-600">+${totalProfit.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">Potential earnings</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Active Investments</h2>
          <p className="text-3xl font-bold text-blue-600">{activeInvestments}</p>
          <p className="text-sm text-gray-500 mt-1">Currently running plans</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Investment History</h2>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 text-sm rounded-md ${
                activeFilter === 'all' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveFilter('active')}
              className={`px-3 py-1 text-sm rounded-md ${
                activeFilter === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button 
              onClick={() => setActiveFilter('pending')}
              className={`px-3 py-1 text-sm rounded-md ${
                activeFilter === 'pending' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button 
              onClick={() => setActiveFilter('completed')}
              className={`px-3 py-1 text-sm rounded-md ${
                activeFilter === 'completed' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : filteredInvestments.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No investments found with the selected filter.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredInvestments.map(investment => (
              <div key={investment._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{investment.plan?.name || "Investment Plan"}</h3>
                    <p className="text-sm text-gray-500">
                      {investment.startDate ? new Date(investment.startDate).toLocaleDateString() : 'Pending'} 
                      {investment.endDate && ` - ${new Date(investment.endDate).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(investment.status)}
                    <span className={`text-sm ${
                      investment.status === 'active' ? 'text-green-600' : 
                      investment.status === 'completed' ? 'text-blue-600' : 
                      investment.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="text-sm font-medium">${investment.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Returns</p>
                    <p className="text-sm font-medium">{investment.returns}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Payment Method</p>
                    <p className="text-sm font-medium">{investment.paymentMethod}</p>
                  </div>
                </div>
                
                {investment.status === 'pending' && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Payment Status</p>
                    <div>{getPaymentStatusBadge(investment.paymentStatus)}</div>
                  </div>
                )}
                
                {investment.status === 'active' && (
                  <>
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Progress</p>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Earnings Progress</span>
                        <span>
                          ${calculateProgress(investment).earnedProfit.toFixed(2)} / 
                          ${(investment.expectedReturn - investment.amount || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${calculateProgress(investment).earningsProgress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2 mb-1">
                        <span>Time Progress</span>
                        <span>{calculateProgress(investment).timeProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${calculateProgress(investment).timeProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {getDaysRemaining(investment.endDate)} days remaining
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Expected Return</p>
                        <p className="text-sm font-medium text-green-600">
                          ${investment.expectedReturn.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Profit</p>
                        <p className="text-sm font-medium text-green-600">
                          +${(investment.expectedReturn - investment.amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </>
                )}
                
                {investment.status === 'completed' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Final Return</p>
                      <p className="text-sm font-medium text-green-600">
                        ${investment.expectedReturn.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Profit</p>
                      <p className="text-sm font-medium text-green-600">
                        +${(investment.expectedReturn - investment.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Investments; 