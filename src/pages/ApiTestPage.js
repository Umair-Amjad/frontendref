import React, { useState, useEffect } from 'react';
import api from '../services/api';
import axios from 'axios';
import { toast } from 'react-toastify';
import ENV from '../utils/env';

const ApiTestPage = () => {
  const [apiStatus, setApiStatus] = useState('Checking connection...');
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [manualEndpoint, setManualEndpoint] = useState('/investment/plans');
  const [manualLoading, setManualLoading] = useState(false);
  const [manualResponse, setManualResponse] = useState(null);
  const [manualError, setManualError] = useState(null);

  const apiUrl = ENV.API_URL;

  useEffect(() => {
    // Test the API connection on component mount
    const testApiConnection = async () => {
      try {
        // Try to get investment plans as a simple test
        const response = await api.getInvestmentPlans();
        setApiResponse(response.data);
        setApiStatus('Connected successfully to the backend API!');
        toast.success('API connection established!');
      } catch (error) {
        console.error('API connection error:', error);
        setApiStatus(`Connection failed: ${error.message || 'Unknown error'}`);
        toast.error(`API connection failed: ${error.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    testApiConnection();
  }, []);

  const handleManualTest = async () => {
    setManualLoading(true);
    setManualError(null);
    setManualResponse(null);
    
    try {
      const fullUrl = `${apiUrl}${manualEndpoint}`;
      const response = await axios.get(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      setManualResponse(response.data);
      toast.success('API request successful!');
    } catch (error) {
      console.error('Manual API test error:', error);
      setManualError(error.response?.data || error.message || 'Unknown error');
      toast.error(`API request failed: ${error.message}`);
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Connection Status</h2>
        <div className={`p-4 rounded-md ${apiStatus.includes('failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {loading ? (
            <div className="flex items-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Testing connection...</span>
            </div>
          ) : (
            <span>{apiStatus}</span>
          )}
        </div>
      </div>

      {apiResponse && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Automatic API Test Response</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Manual API Test</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endpoint">
            API Endpoint (e.g., /investment/plans)
          </label>
          <div className="flex">
            <div className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-md border border-gray-300">
              {apiUrl}
            </div>
            <input
              id="endpoint"
              type="text"
              className="shadow appearance-none border rounded-r-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={manualEndpoint}
              onChange={(e) => setManualEndpoint(e.target.value)}
            />
          </div>
        </div>
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${manualLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleManualTest}
          disabled={manualLoading}
        >
          {manualLoading ? 'Testing...' : 'Test Endpoint'}
        </button>
      </div>

      {manualResponse && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Manual Test Response</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
            {JSON.stringify(manualResponse, null, 2)}
          </pre>
        </div>
      )}

      {manualError && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Manual Test Error</h2>
          <div className="bg-red-100 text-red-700 p-4 rounded-md">
            <pre className="overflow-auto">
              {typeof manualError === 'object' ? JSON.stringify(manualError, null, 2) : manualError}
            </pre>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">API Configuration</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <p><strong>API URL:</strong> {apiUrl}</p>
        </div>
      </div>
    </div>
  );
};

export default ApiTestPage; 