import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { FaExclamationTriangle, FaInfoCircle, FaSpinner } from 'react-icons/fa';
import { withdrawalAPI } from '../../services/api';
import { formatCurrency } from './formatters';

const WithdrawalForm = ({ 
  balance = 0, 
  referralBalance = 0, 
  onSuccess, 
  initialType = 'combined',
  initialAmount = ''
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const totalWithdrawable = (balance || 0) + (referralBalance || 0);

  // Simplified validation schema
  const validationSchema = Yup.object({
    amount: Yup.number()
      .required('Amount is required')
      .positive('Amount must be positive')
      .max(totalWithdrawable, `Cannot exceed your available balance of $${totalWithdrawable.toFixed(2)}`)
      .test(
        'min-withdrawal',
        'Minimum withdrawal amount depends on payment method',
        function(value) {
          const paymentMethod = this.parent.method;
          // Minimum amounts based on payment method
          const minAmounts = {
            'USDT': 20,
            'BankTransfer': 50,
            'JazzCash': 10,
            'EasyPaisa': 10
          };
          
          const minimumAmount = minAmounts[paymentMethod] || 10; // Default to 10
          
          if (value < minimumAmount) {
            return this.createError({
              message: `Minimum withdrawal for ${paymentMethod} is $${minimumAmount}`
            });
          }
          
          return true;
        }
      ),
    method: Yup.string().required('Payment method is required'),
    withdrawalType: Yup.string().required('Withdrawal type is required'),
    paymentDetails: Yup.string().required('Payment details are required')
  });

  // Submit handler
  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      // Create the submission payload
      const payload = {
        amount: values.amount,
        method: values.method,
        withdrawalType: values.withdrawalType,
      };
      
      // Parse the paymentDetails if it's a string
      if (typeof values.paymentDetails === 'string') {
        let details = JSON.parse(values.paymentDetails);
        
        // Fix field names if needed based on method
        if (values.method === 'JazzCash' || values.method === 'EasyPaisa') {
          // Make sure to convert number to phoneNumber if it exists
          if (details.number && !details.phoneNumber) {
            details.phoneNumber = details.number;
            delete details.number;
          }
        } else if (values.method === 'USDT') {
          // Make sure we have both walletAddress and network
          if (!details.walletAddress && details.address) {
            details.walletAddress = details.address;
            delete details.address;
          }
          if (!details.network) {
            details.network = 'TRC20'; // Default to TRC20 if not specified
          }
        }
        
        payload.paymentDetails = details;
      } else {
        payload.paymentDetails = values.paymentDetails;
      }
      
      await withdrawalAPI.requestWithdrawal(payload);
      resetForm();
      if (onSuccess) onSuccess();
      toast.success('Withdrawal request submitted successfully!');
    } catch (err) {
      console.error('Withdrawal request error:', err);
      setError(err.response?.data?.message || err.response?.data?.amount || 
        err.response?.data?.paymentDetails ||
        'Failed to process withdrawal request. Please try again.');
      toast.error('Withdrawal request failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6">
      <h2 className="text-xl font-semibold mb-6 text-center">Request Withdrawal</h2>
      
      <div className="mb-6 border-b pb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="pb-2 text-left font-medium">Your Available Balances</th>
              <th className="pb-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-3">Main Balance</td>
              <td className="py-3 text-right">{formatCurrency(balance)}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-3">Referral Earnings</td>
              <td className="py-3 text-right text-blue-600">{formatCurrency(referralBalance)}</td>
            </tr>
            <tr className="font-semibold">
              <td className="py-3">Total Available</td>
              <td className="py-3 text-right text-green-600">{formatCurrency(totalWithdrawable)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 border border-red-200 rounded">
          <div className="flex items-start">
            <FaExclamationTriangle className="mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}
      
      <Formik
        initialValues={{
          amount: initialAmount,
          method: 'USDT',
          withdrawalType: initialType,
          paymentDetails: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form>
            <fieldset className="mb-6 border border-gray-200 p-4 rounded">
              <legend className="font-medium px-2">Withdraw From</legend>
              
              <div className="space-y-2 mt-2">
                <label className="flex items-start">
                  <Field
                    type="radio"
                    name="withdrawalType"
                    value="combined"
                    className="mt-0.5 mr-2"
                  />
                  <div>
                    <span className="block font-medium">Combined Balance ({formatCurrency(totalWithdrawable)})</span>
                    <span className="block text-xs text-gray-500">Withdraw from both main & referral balances</span>
                  </div>
                </label>
                
                <label className={`flex items-start ${balance <= 0 ? 'opacity-50' : ''}`}>
                  <Field
                    type="radio"
                    name="withdrawalType"
                    value="main"
                    className="mt-0.5 mr-2"
                    disabled={balance <= 0}
                  />
                  <div>
                    <span className="block font-medium">Main Balance Only ({formatCurrency(balance)})</span>
                    <span className="block text-xs text-gray-500">Withdraw only from your main balance</span>
                  </div>
                </label>
                
                <label className={`flex items-start ${referralBalance <= 0 ? 'opacity-50' : ''}`}>
                  <Field
                    type="radio"
                    name="withdrawalType"
                    value="referral"
                    className="mt-0.5 mr-2"
                    disabled={referralBalance <= 0}
                  />
                  <div>
                    <span className="block font-medium">Referral Earnings Only ({formatCurrency(referralBalance)})</span>
                    <span className="block text-xs text-gray-500">Withdraw only from your referral earnings</span>
                  </div>
                </label>
              </div>
              
              <ErrorMessage name="withdrawalType" component="div" className="mt-2 text-sm text-red-600" />
            </fieldset>
            
            <div className="mb-6">
              <label className="block font-medium mb-2" htmlFor="amount">
                Amount to Withdraw
              </label>
              <div className="flex">
                <div className="w-full relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Field
                    type="number"
                    name="amount"
                    id="amount"
                    className="block w-full border border-gray-300 rounded px-8 py-2 focus:border-blue-500 focus:outline-none"
                    placeholder="0.00"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (values.withdrawalType === 'main') {
                      setFieldValue('amount', balance);
                    } else if (values.withdrawalType === 'referral') {
                      setFieldValue('amount', referralBalance);
                    } else {
                      setFieldValue('amount', totalWithdrawable);
                    }
                  }}
                  className="border border-gray-300 border-l-0 rounded-r px-3 bg-gray-50 hover:bg-gray-100 text-sm font-medium"
                >
                  MAX
                </button>
              </div>
              <ErrorMessage name="amount" component="div" className="mt-1 text-sm text-red-600" />
              
              <div className="mt-2 text-xs text-gray-500 flex items-center">
                <FaInfoCircle className="mr-1" />
                <span>Minimum withdrawal amount varies by payment method</span>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block font-medium mb-2" htmlFor="method">
                Payment Method
              </label>
              <Field
                as="select"
                name="method"
                id="method"
                className="block w-full border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none"
                onChange={(e) => {
                  const method = e.target.value;
                  setFieldValue('method', method);
                  setFieldValue('paymentDetails', ''); // Reset payment details when method changes
                }}
              >
                <option value="USDT">Cryptocurrency (USDT)</option>
                <option value="BankTransfer">Bank Transfer</option>
                <option value="JazzCash">JazzCash</option>
                <option value="EasyPaisa">EasyPaisa</option>
              </Field>
              <ErrorMessage name="method" component="div" className="mt-1 text-sm text-red-600" />
            </div>
            
            <fieldset className="mb-6 border border-gray-200 p-4 rounded">
              <legend className="font-medium px-2">Payment Details</legend>
              
              {/* Cryptocurrency Details */}
              {values.method === 'USDT' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium mb-2">Network</label>
                    <select 
                      className="block w-full border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none"
                      required
                      defaultValue="TRC20"
                      onChange={(e) => {
                        const network = e.target.value;
                        let details = {};
                        try {
                          details = values.paymentDetails ? JSON.parse(values.paymentDetails) : {};
                        } catch (e) {
                          details = {};
                        }
                        details.network = network;
                        setFieldValue('paymentDetails', JSON.stringify(details));
                      }}
                    >
                      <option value="TRC20">USDT (TRC20)</option>
                      <option value="ERC20">USDT (ERC20)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-2">
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      className="block w-full border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter your USDT wallet address"
                      required
                      onChange={(e) => {
                        const walletAddress = e.target.value;
                        let details = {};
                        try {
                          details = values.paymentDetails ? JSON.parse(values.paymentDetails) : {};
                        } catch (e) {
                          details = {};
                        }
                        details.walletAddress = walletAddress;
                        setFieldValue('paymentDetails', JSON.stringify(details));
                      }}
                    />
                  </div>
                </div>
              )}
              
              {/* Bank Transfer Details */}
              {values.method === 'BankTransfer' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium mb-2">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      className="block w-full border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter your bank name"
                      required
                      onChange={(e) => {
                        const bankName = e.target.value;
                        let details = {};
                        try {
                          details = values.paymentDetails ? JSON.parse(values.paymentDetails) : {};
                        } catch (e) {
                          details = {};
                        }
                        details.bankName = bankName;
                        setFieldValue('paymentDetails', JSON.stringify(details));
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      className="block w-full border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter your account number"
                      required
                      onChange={(e) => {
                        const accountNumber = e.target.value;
                        let details = {};
                        try {
                          details = values.paymentDetails ? JSON.parse(values.paymentDetails) : {};
                        } catch (e) {
                          details = {};
                        }
                        details.accountNo = accountNumber;
                        setFieldValue('paymentDetails', JSON.stringify(details));
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-2">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      className="block w-full border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter account holder's name"
                      required
                      onChange={(e) => {
                        const accountHolderName = e.target.value;
                        let details = {};
                        try {
                          details = values.paymentDetails ? JSON.parse(values.paymentDetails) : {};
                        } catch (e) {
                          details = {};
                        }
                        details.accountName = accountHolderName;
                        setFieldValue('paymentDetails', JSON.stringify(details));
                      }}
                    />
                  </div>
                </div>
              )}
              
              {/* JazzCash Details */}
              {values.method === 'JazzCash' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium mb-2">
                      JazzCash Mobile Number
                    </label>
                    <input
                      type="text"
                      className="block w-full border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter your JazzCash mobile number"
                      required
                      onChange={(e) => {
                        const phoneNumber = e.target.value;
                        let details = {};
                        try {
                          details = values.paymentDetails ? JSON.parse(values.paymentDetails) : {};
                        } catch (e) {
                          details = {};
                        }
                        details.phoneNumber = phoneNumber;
                        setFieldValue('paymentDetails', JSON.stringify(details));
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="block w-full border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter the account holder's full name"
                      required
                      onChange={(e) => {
                        const fullName = e.target.value;
                        let details = {};
                        try {
                          details = values.paymentDetails ? JSON.parse(values.paymentDetails) : {};
                        } catch (e) {
                          details = {};
                        }
                        details.fullName = fullName;
                        setFieldValue('paymentDetails', JSON.stringify(details));
                      }}
                    />
                  </div>
                </div>
              )}
              
              {/* EasyPaisa Details */}
              {values.method === 'EasyPaisa' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium mb-2">
                      EasyPaisa Mobile Number
                    </label>
                    <input
                      type="text"
                      className="block w-full border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter your EasyPaisa mobile number"
                      required
                      onChange={(e) => {
                        const phoneNumber = e.target.value;
                        let details = {};
                        try {
                          details = values.paymentDetails ? JSON.parse(values.paymentDetails) : {};
                        } catch (e) {
                          details = {};
                        }
                        details.phoneNumber = phoneNumber;
                        setFieldValue('paymentDetails', JSON.stringify(details));
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="block w-full border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter the account holder's full name"
                      required
                      onChange={(e) => {
                        const fullName = e.target.value;
                        let details = {};
                        try {
                          details = values.paymentDetails ? JSON.parse(values.paymentDetails) : {};
                        } catch (e) {
                          details = {};
                        }
                        details.fullName = fullName;
                        setFieldValue('paymentDetails', JSON.stringify(details));
                      }}
                    />
                  </div>
                </div>
              )}
              
              <ErrorMessage name="paymentDetails" component="div" className="mt-1 text-sm text-red-600" />
            </fieldset>
            
            <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded text-sm">
              <div className="flex items-start">
                <FaInfoCircle className="mr-2 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <p className="font-medium mb-1">Important Notes</p>
                  <p className="mb-1">• Withdrawal requests are processed within 24-48 hours</p>
                  <p className="mb-1">• Referral earnings are available for immediate withdrawal</p>
                  <p>• ROI earnings are now immediately available for withdrawal</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting || totalWithdrawable <= 0}
                className={`px-6 py-2 font-medium rounded 
                  ${totalWithdrawable <= 0 || isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" /> Processing...
                  </span>
                ) : (
                  'Submit Withdrawal Request'
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default WithdrawalForm;