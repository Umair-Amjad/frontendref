import axios from 'axios';
import ENV from '../utils/env';

// Create axios instance with base URL
const API = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 seconds timeout
});

// Add request interceptor to add auth token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Request to:', config.url);
    console.log('Token from localStorage:', token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Added Authorization header:', config.headers['Authorization']);
    } else {
      console.log('No token available, request will proceed without auth');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response || {};

    // Handle token expiration
    if (status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (email, password) => API.post('/auth/login', { email, password }),
  verifyToken: () => API.get('/auth/verify'),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => API.post(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token) => API.get(`/auth/verify-email/${token}`)
};

// User API
export const userAPI = {
  getProfile: () => API.get('/user/profile'),
  updateProfile: (userData) => API.put('/user/profile', userData),
  getDashboardStats: () => API.get('/user/dashboard'),
  getReferralInfo: () => API.get('/user/referral'),
  getReferralEarnings: () => API.get('/user/referral-earnings'),
  getEarningHistory: () => API.get('/user/earning-history'),
  changePassword: (data) => API.post('/user/change-password', data),
  getReferrals: () => API.get('/user/referrals'),
  getReferralTree: () => API.get('/user/referral-tree')
};

// Investment API
export const investmentAPI = {
  getPlans: () => API.get('/investment/plans'),
  createInvestment: (investmentData, formData = false) => {
    if (formData) {
      return API.post('/investment', investmentData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return API.post('/investment', investmentData);
  },
  getUserInvestments: () => API.get('/investment/user'),
  getInvestmentById: (id) => API.get(`/investment/${id}`)
};

// Withdrawal API
export const withdrawalAPI = {
  getWithdrawableBalance: () => API.get('/withdrawal/balance'),
  requestWithdrawal: (withdrawalData) => API.post('/withdrawal', withdrawalData),
  getUserWithdrawals: () => API.get('/withdrawal'),
  getWithdrawalById: (id) => API.get(`/withdrawal/${id}`)
};

// Admin API
export const adminAPI = {
  // Users
  getAllUsers: () => API.get('/admin/users'),
  toggleUserActive: (userId) => API.put(`/admin/user/toggle-active/${userId}`),
  
  // Investments
  getAllInvestments: () => API.get('/admin/investments'),
  updateInvestmentStatus: (id, data) => API.put(`/admin/investment/${id}`, data),
  verifyInvestmentPayment: (id, data) => API.put(`/admin/investment/verify/${id}`, data),
  
  // Withdrawals
  getAllWithdrawals: () => API.get('/admin/withdrawals'),
  processWithdrawal: (id, data) => API.put(`/admin/withdrawal/${id}`, data),
  
  // Dashboard
  getDashboardStats: () => API.get('/admin/dashboard'),
  
  // Plans
  updateInvestmentPlan: (name, data) => API.put(`/admin/plans/${name}`, data),
  
  // System Settings
  getSystemSettings: () => API.get('/admin/settings'),
  updateSystemSettings: (data) => API.put('/admin/settings', data),
  
  // Activity Logs
  getUserActivities: (params) => API.get('/admin/activities', { params }),
  
  // Referrals
  getReferrals: () => API.get('/admin/referrals'),
  getReferralsByUser: (userId) => API.get(`/admin/referrals/${userId}`)
};

// Create a simplified API for common operations
const api = {
  // Auth methods
  login: (email, password) => authAPI.login(email, password),
  register: (userData) => authAPI.register(userData),
  
  // User profile
  getUserProfile: () => userAPI.getProfile(),
  updateUserProfile: (data) => userAPI.updateProfile(data),
  
  // Dashboard
  getDashboardStats: () => userAPI.getDashboardStats(),
  
  // Referrals
  getReferralInfo: () => userAPI.getReferralInfo(),
  getUserReferralEarnings: () => userAPI.getReferralEarnings(),
  getUserReferrals: () => userAPI.getReferrals(),
  
  // Investments
  getInvestmentPlans: () => investmentAPI.getPlans(),
  getUserInvestments: () => investmentAPI.getUserInvestments(),
  createInvestment: (data, formData) => investmentAPI.createInvestment(data, formData),
  
  // Withdrawals
  getWithdrawableBalance: () => withdrawalAPI.getWithdrawableBalance(),
  requestWithdrawal: (data) => withdrawalAPI.requestWithdrawal(data),
  getUserWithdrawals: () => withdrawalAPI.getUserWithdrawals()
};

export default api; 