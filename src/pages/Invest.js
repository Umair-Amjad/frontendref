import React, { useState, useEffect } from 'react';
import PlanCard from '../components/ui/PlanCard';
import { 
  FaExclamationCircle, 
  FaInfoCircle, 
  FaCheckCircle, 
  FaCoins
} from 'react-icons/fa';
import { investmentAPI } from '../services/api';

const Invest = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState('');
  const [calculatedReturn, setCalculatedReturn] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionFile, setTransactionFile] = useState(null);
  
  // Fetch investment plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await investmentAPI.getPlans();
        if (response.data.success) {
          setPlans(response.data.data);
        } else {
          setError('Error fetching investment plans');
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching investment plans');
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, []);
  
  // Calculate expected return when amount or selected plan changes
  useEffect(() => {
    if (selectedPlan && amount && !isNaN(amount) && amount > 0) {
      const roi = selectedPlan.roi / 100;
      const expectedReturn = parseFloat(amount) + (parseFloat(amount) * roi);
      setCalculatedReturn(expectedReturn);
    } else {
      setCalculatedReturn(0);
    }
  }, [selectedPlan, amount]);
  
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    
    // Set default amount to minimum if not set or below the plan minimum
    if (!amount || parseFloat(amount) < plan.minAmount) {
      setAmount(plan.minAmount.toString());
    } else if (parseFloat(amount) > plan.maxAmount) {
      // Cap amount to maximum if above the plan maximum
      setAmount(plan.maxAmount.toString());
    }
    
    setError(null);
  };
  
  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    
    if (selectedPlan) {
      // Validate amount against selected plan
      if (parseFloat(value) < selectedPlan.minAmount) {
        setError(`Minimum investment for ${selectedPlan.name} plan is $${selectedPlan.minAmount}`);
      } else if (parseFloat(value) > selectedPlan.maxAmount) {
        setError(`Maximum investment for ${selectedPlan.name} plan is $${selectedPlan.maxAmount}`);
      } else {
        setError(null);
      }
    }
  };
  
  const handleFileChange = (e) => {
    setTransactionFile(e.target.files[0]);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPlan) {
      setError('Please select an investment plan');
      return;
    }
    
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid investment amount');
      return;
    }
    
    // Validate amount against selected plan
    if (parseFloat(amount) < selectedPlan.minAmount || parseFloat(amount) > selectedPlan.maxAmount) {
      setError(`Investment amount must be between $${selectedPlan.minAmount} and $${selectedPlan.maxAmount} for ${selectedPlan.name} plan`);
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      let response;
      // If using local payment methods, use FormData
      if (paymentMethod === 'JazzCash' || paymentMethod === 'Easypaisa') {
        if (!transactionFile) {
          setError(`Please upload your ${paymentMethod} transaction screenshot`);
          setSubmitting(false);
          return;
        }
        
        const formData = new FormData();
        formData.append('amount', parseFloat(amount));
        formData.append('paymentMethod', paymentMethod);
        formData.append('transactionScreenshot', transactionFile);
        
        response = await investmentAPI.createInvestment(formData, true);
      } else {
        // For crypto payments
        response = await investmentAPI.createInvestment({
          amount: parseFloat(amount),
          paymentMethod
        });
      }
      
      if (response.data.success) {
        setSuccess(`Investment initiated successfully! Please complete the payment.`);
        setPaymentData(response.data.data.payment);
      } else {
        setError(response.data.message || 'Failed to create investment');
      }
      setSubmitting(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create investment');
      setSubmitting(false);
    }
  };
  
  // Show loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Choose an Investment Plan</h1>
        <p className="text-gray-600">Select a plan that matches your investment goals</p>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex items-center">
            <FaExclamationCircle className="text-red-400 mr-3" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {success && !paymentData && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex items-center">
            <FaCheckCircle className="text-green-500 mr-3" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}
      
      {paymentData ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="text-center mb-6">
            <FaCoins className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Payment</h2>
            <p className="text-gray-600">
              Please send exactly <span className="font-semibold">${parseFloat(amount).toFixed(2)}</span> to the payment gateway.
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Payment ID:</span>
              <span className="font-medium">{paymentData.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">${parseFloat(amount).toFixed(2)}</span>
            </div>
            
            {/* Show payment recipient details for JazzCash and Easypaisa */}
            {(paymentMethod === 'JazzCash' || paymentMethod === 'Easypaisa') && (
              <>
                <div className="border-t border-gray-200 mt-3 pt-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Account Number:</span>
                    <span className="font-medium">0312094180</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Account Name:</span>
                    <span className="font-medium">Umair Amjad</span>
                  </div>
                </div>
                <div className="mt-3 text-sm text-red-600">
                  Please send payment to the account above and keep your transaction ID for verification.
                </div>
              </>
            )}
          </div>
          
          <div className="text-center">
            <a
              href={paymentData.paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary inline-block mb-4"
            >
              Proceed to Payment
            </a>
            <p className="text-sm text-gray-500">
              You will be redirected to our secure payment gateway to complete your transaction.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Investment plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {plans.map((plan) => (
              <PlanCard
                key={plan.name}
                plan={plan}
                isSelected={selectedPlan?.name === plan.name}
                onSelect={handlePlanSelect}
              />
            ))}
          </div>
          
          {/* Investment amount form */}
          {selectedPlan && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Customize Your Investment
              </h2>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <div className="flex items-start">
                  <FaInfoCircle className="text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-700 font-medium">
                      You have selected the {selectedPlan.name} plan
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Min: ${selectedPlan.minAmount} | Max: ${selectedPlan.maxAmount} | ROI: {selectedPlan.roi}%
                    </p>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="amount" className="label">
                    Investment Amount
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="amount"
                      id="amount"
                      className="input pl-7"
                      placeholder="0.00"
                      step="0.01"
                      min={selectedPlan.minAmount}
                      max={selectedPlan.maxAmount}
                      value={amount}
                      onChange={handleAmountChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="paymentMethod" className="label">Payment Method</label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    className="input"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                  >
                    <option value="">Select Payment Method</option>
                    <option value="Bitcoin">Bitcoin</option>
                    <option value="Ethereum">Ethereum</option>
                    <option value="USDT">USDT</option>
                    <option value="JazzCash">JazzCash</option>
                    <option value="Easypaisa">Easypaisa</option>
                  </select>
                </div>
                
                {(paymentMethod === 'JazzCash' || paymentMethod === 'Easypaisa') && (
                  <div className="mb-4">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                      <div className="flex items-start">
                        <FaInfoCircle className="text-yellow-500 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-yellow-700 font-medium">
                            Please send your payment to the following {paymentMethod} account:
                          </p>
                          <p className="text-sm text-yellow-700 mt-1">
                            <span className="font-bold">Number:</span> 0312094180
                          </p>
                          <p className="text-sm text-yellow-700">
                            <span className="font-bold">Account Name:</span> Umair Amjad
                          </p>
                          <p className="text-sm text-yellow-700 mt-2">
                            After payment, please upload the transaction screenshot below.
                          </p>
                        </div>
                      </div>
                    </div>
                    <label htmlFor="transactionScreenshot" className="label">
                      Upload {paymentMethod} Transaction Screenshot
                    </label>
                    <input
                      type="file"
                      id="transactionScreenshot"
                      name="transactionScreenshot"
                      className="input"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                )}
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Initial Investment:</span>
                    <span className="font-medium">${parseFloat(amount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-600">Expected Return:</span>
                    <span className="font-semibold text-primary">${calculatedReturn.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-600">Profit:</span>
                    <span className="font-semibold text-green-600">
                      ${(calculatedReturn - parseFloat(amount || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                      Processing...
                    </span>
                  ) : (
                    'Invest Now'
                  )}
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Invest; 