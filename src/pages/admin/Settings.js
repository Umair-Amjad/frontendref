import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/layout/AdminLayout';
import { FaSave, FaExclamationTriangle, FaLock, FaMoneyBillWave, FaExchangeAlt, FaUserCheck, FaToggleOn, FaToggleOff, FaInfoCircle } from 'react-icons/fa';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';

const Settings = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generalSettings, setGeneralSettings] = useState({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    supportPhone: ''
  });
  const [investmentSettings, setInvestmentSettings] = useState({
    minInvestment: 0,
    maxInvestment: 0,
    referralCommission: 0,
    withdrawalFee: 0,
    maintenanceModeEnabled: false
  });
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    allowUserLogin: true,
    verifyTransactions: true,
    withdrawalsEnabled: true,
    registrationEnabled: true,
    minimumWithdrawal: 10,
    maintenanceMode: false,
    referralPercentage: 5
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        // In a real application, this would be an API call
        // Mock data for demonstration
        setGeneralSettings({
          siteName: 'Referral Investment Platform',
          siteDescription: 'A platform for cryptocurrency investments with referral benefits',
          contactEmail: 'support@refplatform.com',
          supportPhone: '+1-234-567-8900'
        });

        setInvestmentSettings({
          minInvestment: 100,
          maxInvestment: 10000,
          referralCommission: 5,
          withdrawalFee: 2,
          maintenanceModeEnabled: false
        });

        const response = await adminAPI.getSystemSettings();
        if (response.data.success) {
          setSettings(response.data.data);
        } else {
          throw new Error(response.data.message || 'Error fetching system settings');
        }
      } catch (err) {
        setError('Failed to load settings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleGeneralSettingsChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleInvestmentSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value;
    setInvestmentSettings(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // In a real application, this would make an API call to save settings
      // Simulated delay for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Settings saved successfully');
    } catch (err) {
      setError('Failed to save settings');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Handle toggle changes
  const handleToggle = async (setting) => {
    const updatedSettings = { 
      ...settings, 
      [setting]: !settings[setting] 
    };
    
    try {
      setSaving(true);
      const response = await adminAPI.updateSystemSettings({
        [setting]: !settings[setting]
      });
      
      if (response.data.success) {
        setSettings(updatedSettings);
        toast.success(`Setting "${setting}" updated successfully`);
      } else {
        throw new Error(response.data.message || 'Failed to update setting');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update setting');
    } finally {
      setSaving(false);
    }
  };

  // Handle number input changes
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: parseFloat(value)
    });
  };

  // Save number settings
  const handleSaveNumber = async (setting) => {
    try {
      setSaving(true);
      const response = await adminAPI.updateSystemSettings({
        [setting]: settings[setting]
      });
      
      if (response.data.success) {
        toast.success(`Setting "${setting}" updated successfully`);
      } else {
        throw new Error(response.data.message || 'Failed to update setting');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update setting');
    } finally {
      setSaving(false);
    }
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
        <h1 className="text-2xl font-bold mb-6">Platform Settings</h1>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
            <p>{success}</p>
          </div>
        )}
        
        {loading ? (
          <p className="text-center py-4">Loading settings...</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === 'general'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  General Settings
                </button>
                <button
                  onClick={() => setActiveTab('investment')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === 'investment'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Investment Settings
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'general' ? (
                <form onSubmit={handleSaveSettings}>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                        Site Name
                      </label>
                      <input
                        type="text"
                        id="siteName"
                        name="siteName"
                        value={generalSettings.siteName}
                        onChange={handleGeneralSettingsChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        id="contactEmail"
                        name="contactEmail"
                        value={generalSettings.contactEmail}
                        onChange={handleGeneralSettingsChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="supportPhone" className="block text-sm font-medium text-gray-700 mb-1">
                        Support Phone
                      </label>
                      <input
                        type="tel"
                        id="supportPhone"
                        name="supportPhone"
                        value={generalSettings.supportPhone}
                        onChange={handleGeneralSettingsChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        Site Description
                      </label>
                      <textarea
                        id="siteDescription"
                        name="siteDescription"
                        value={generalSettings.siteDescription}
                        onChange={handleGeneralSettingsChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FaSave className="mr-2" />
                      {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSaveSettings}>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="minInvestment" className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Investment ($)
                      </label>
                      <input
                        type="number"
                        id="minInvestment"
                        name="minInvestment"
                        value={investmentSettings.minInvestment}
                        onChange={handleInvestmentSettingsChange}
                        min="0"
                        step="10"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="maxInvestment" className="block text-sm font-medium text-gray-700 mb-1">
                        Maximum Investment ($)
                      </label>
                      <input
                        type="number"
                        id="maxInvestment"
                        name="maxInvestment"
                        value={investmentSettings.maxInvestment}
                        onChange={handleInvestmentSettingsChange}
                        min="0"
                        step="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="referralCommission" className="block text-sm font-medium text-gray-700 mb-1">
                        Referral Commission (%)
                      </label>
                      <input
                        type="number"
                        id="referralCommission"
                        name="referralCommission"
                        value={investmentSettings.referralCommission}
                        onChange={handleInvestmentSettingsChange}
                        min="0"
                        max="20"
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="withdrawalFee" className="block text-sm font-medium text-gray-700 mb-1">
                        Withdrawal Fee (%)
                      </label>
                      <input
                        type="number"
                        id="withdrawalFee"
                        name="withdrawalFee"
                        value={investmentSettings.withdrawalFee}
                        onChange={handleInvestmentSettingsChange}
                        min="0"
                        max="10"
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="maintenanceModeEnabled"
                            name="maintenanceModeEnabled"
                            type="checkbox"
                            checked={investmentSettings.maintenanceModeEnabled}
                            onChange={handleInvestmentSettingsChange}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="maintenanceModeEnabled" className="font-medium text-gray-700">
                            Enable Maintenance Mode
                          </label>
                          <p className="text-gray-500">When enabled, only administrators can access the platform.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {investmentSettings.maintenanceModeEnabled && (
                    <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            Warning: Maintenance mode will prevent normal users from accessing the platform.
                            Only use this when necessary.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FaSave className="mr-2" />
                      {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* User Access Settings */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <div className="flex items-center">
              <FaLock className="text-gray-500 mr-2" />
              <h2 className="text-lg font-semibold">User Access Controls</h2>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                <div>
                  <h3 className="font-medium">Allow User Login</h3>
                  <p className="text-sm text-gray-500">Enable or disable user login functionality</p>
                </div>
                <button
                  onClick={() => handleToggle('allowUserLogin')}
                  disabled={saving}
                  className={`text-2xl focus:outline-none ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {settings.allowUserLogin ? (
                    <FaToggleOn className="text-green-500" />
                  ) : (
                    <FaToggleOff className="text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                <div>
                  <h3 className="font-medium">Registration Enabled</h3>
                  <p className="text-sm text-gray-500">Allow new users to register</p>
                </div>
                <button
                  onClick={() => handleToggle('registrationEnabled')}
                  disabled={saving}
                  className={`text-2xl focus:outline-none ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {settings.registrationEnabled ? (
                    <FaToggleOn className="text-green-500" />
                  ) : (
                    <FaToggleOff className="text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                <div>
                  <h3 className="font-medium">Maintenance Mode</h3>
                  <p className="text-sm text-gray-500">Put the entire system in maintenance mode</p>
                </div>
                <button
                  onClick={() => handleToggle('maintenanceMode')}
                  disabled={saving}
                  className={`text-2xl focus:outline-none ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {settings.maintenanceMode ? (
                    <FaToggleOn className="text-green-500" />
                  ) : (
                    <FaToggleOff className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Settings */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <div className="flex items-center">
              <FaMoneyBillWave className="text-gray-500 mr-2" />
              <h2 className="text-lg font-semibold">Transaction Settings</h2>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                <div>
                  <h3 className="font-medium">Transaction Verification</h3>
                  <p className="text-sm text-gray-500">Require admin approval for transactions</p>
                </div>
                <button
                  onClick={() => handleToggle('verifyTransactions')}
                  disabled={saving}
                  className={`text-2xl focus:outline-none ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {settings.verifyTransactions ? (
                    <FaToggleOn className="text-green-500" />
                  ) : (
                    <FaToggleOff className="text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                <div>
                  <h3 className="font-medium">Withdrawals Enabled</h3>
                  <p className="text-sm text-gray-500">Allow users to withdraw funds</p>
                </div>
                <button
                  onClick={() => handleToggle('withdrawalsEnabled')}
                  disabled={saving}
                  className={`text-2xl focus:outline-none ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {settings.withdrawalsEnabled ? (
                    <FaToggleOn className="text-green-500" />
                  ) : (
                    <FaToggleOff className="text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                <div>
                  <h3 className="font-medium">Minimum Withdrawal Amount</h3>
                  <p className="text-sm text-gray-500">Set the minimum amount users can withdraw</p>
                </div>
                <div className="flex items-center">
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="minimumWithdrawal"
                      min="0"
                      step="1"
                      value={settings.minimumWithdrawal}
                      onChange={handleNumberChange}
                      className="pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => handleSaveNumber('minimumWithdrawal')}
                    disabled={saving}
                    className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Settings */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <div className="flex items-center">
              <FaUserCheck className="text-gray-500 mr-2" />
              <h2 className="text-lg font-semibold">Referral Settings</h2>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                <div>
                  <h3 className="font-medium">Referral Percentage</h3>
                  <p className="text-sm text-gray-500">Percentage of referred user's investment earned by referrer</p>
                </div>
                <div className="flex items-center">
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="number"
                      name="referralPercentage"
                      min="0"
                      max="100"
                      step="0.1"
                      value={settings.referralPercentage}
                      onChange={handleNumberChange}
                      className="pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">%</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveNumber('referralPercentage')}
                    disabled={saving}
                    className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaInfoCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Important Note</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Changes to system settings take effect immediately and may impact user experience.</p>
                <p className="mt-1">Be cautious when disabling critical features like user login or withdrawals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings; 