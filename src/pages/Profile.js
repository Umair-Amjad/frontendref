import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import { FaUser, FaEnvelope, FaPhone, FaWallet, FaChartLine, FaStar, FaUsers, FaDollarSign } from 'react-icons/fa';
import { userAPI } from '../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FaEdit } from 'react-icons/fa';

const Profile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [stats, setStats] = useState({
    totalInvested: 0,
    totalEarned: 0,
    balance: 0,
    referralCount: 0,
    referralEarnings: 0,
    activeInvestments: [],
    withdrawableBalance: 0
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await userAPI.getDashboardStats();
        if (response.data && response.data.success) {
          // Ensure all properties have default values if they're missing
          setStats({
            totalInvested: response.data.data?.totalInvested || 0,
            totalEarned: response.data.data?.totalEarned || 0,
            balance: response.data.data?.balance || 0,
            referralCount: response.data.data?.referralCount || 0,
            referralEarnings: response.data.data?.referralEarnings || 0,
            activeInvestments: response.data.data?.activeInvestments || [],
            withdrawableBalance: response.data.data?.withdrawableBalance || 
                                 (currentUser?.balance || 0)
          });
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call API to update user profile
      const response = await userAPI.updateProfile({
        name: formData.name,
        phone: formData.phone
      });

      if (response.data.success) {
        // Update context with new user data
        updateUserProfile(response.data.data);
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  // Calculate ROI percentage
  const roi = stats.totalInvested > 0 
    ? Math.round((stats.totalEarned / stats.totalInvested) * 100) 
    : 0;

  // Get investor level based on total invested
  const getInvestorLevel = () => {
    if (stats.totalInvested >= 1000) return "Elite Investor";
    if (stats.totalInvested >= 500) return "Diamond Investor";
    if (stats.totalInvested >= 200) return "Platinum Investor";
    if (stats.totalInvested >= 50) return "Gold Investor";
    if (stats.totalInvested >= 10) return "Silver Investor";
    if (stats.totalInvested > 0) return "Bronze Investor";
    return "New Investor";
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Calculate total active investment returns
  const calculateActiveReturns = () => {
    if (!stats.activeInvestments || stats.activeInvestments.length === 0) return 0;
    
    return stats.activeInvestments.reduce((total, investment) => {
      const earned = investment.expectedReturn ? investment.expectedReturn - investment.amount : 0;
      return total + earned;
    }, 0);
  };

  const activeReturns = calculateActiveReturns();

  if (!currentUser) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8 text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600 mx-auto border-4 border-white shadow-xl">
                    {getInitials(currentUser?.name)}
                  </div>
                  <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                    <FaStar className="text-white text-xs" />
                  </div>
                </div>
                <h2 className="mt-4 text-xl font-bold text-white">{currentUser?.name}</h2>
                <p className="text-indigo-100 mb-1">{getInvestorLevel()}</p>
                <div className="inline-flex items-center px-3 py-1 bg-indigo-700 bg-opacity-50 rounded-full text-xs text-white mt-2">
                  <FaUsers className="mr-1" /> {stats.referralCount} Referrals
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <FaEnvelope className="mr-3 text-indigo-500" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p>{currentUser?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <FaPhone className="mr-3 text-indigo-500" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p>{currentUser?.phone || "Not set"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <FaWallet className="mr-3 text-indigo-500" />
                    <div>
                      <p className="text-xs text-gray-500">Withdrawable Balance</p>
                      <p className="font-semibold">${stats.withdrawableBalance.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <FaDollarSign className="mr-3 text-green-500" />
                    <div>
                      <p className="text-xs text-gray-500">Active Investment Returns</p>
                      <p className="font-semibold text-green-600">+${activeReturns.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Investment Progress */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Return on Investment</span>
                    <span className="text-sm font-medium text-indigo-600">{roi}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(roi, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Total Invested</p>
                      <p className="text-lg font-semibold text-gray-800">${stats.totalInvested.toFixed(2)}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Total Earned</p>
                      <p className="text-lg font-semibold text-gray-800">${stats.totalEarned.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Update Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Update Your Information</h2>
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center text-sm font-medium text-primary hover:text-primary-dark"
                >
                  <FaEdit className="mr-1" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="text-gray-400" />
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        loading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? <LoadingSpinner sm /> : 'Update Profile'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex border-b pb-3">
                    <div className="w-1/3 text-gray-600">Name:</div>
                    <div className="w-2/3 font-medium">{currentUser.name}</div>
                  </div>
                  <div className="flex border-b pb-3">
                    <div className="w-1/3 text-gray-600">Email:</div>
                    <div className="w-2/3 font-medium">{currentUser.email}</div>
                  </div>
                  <div className="flex border-b pb-3">
                    <div className="w-1/3 text-gray-600">Phone:</div>
                    <div className="w-2/3 font-medium">{currentUser.phone || 'Not set'}</div>
                  </div>
                  <div className="flex border-b pb-3">
                    <div className="w-1/3 text-gray-600">Member since:</div>
                    <div className="w-2/3 font-medium">
                      {new Date(currentUser.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex pb-3">
                    <div className="w-1/3 text-gray-600">Referral Code:</div>
                    <div className="w-2/3 font-medium">{currentUser.referralCode}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile; 