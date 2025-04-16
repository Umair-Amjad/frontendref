// API Configuration
import ENV from '../utils/env';

const API_URL = ENV.API_URL;

export const API = {
  BASE_URL: API_URL,
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      VERIFY_EMAIL: '/auth/verify-email',
      RESET_PASSWORD: '/auth/reset-password',
      FORGOT_PASSWORD: '/auth/forgot-password',
      REFRESH_TOKEN: '/auth/refresh-token'
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE_PROFILE: '/user/profile',
      DASHBOARD: '/user/dashboard'
    },
    INVESTMENT: {
      CREATE: '/investment',
      GET_ALL: '/investment',
      GET_ONE: '/investment/:id',
      GET_PLANS: '/investment/plans'
    },
    WITHDRAWAL: {
      REQUEST: '/withdrawal',
      GET_ALL: '/withdrawal',
      GET_ONE: '/withdrawal/:id',
      GET_BALANCE: '/withdrawal/balance'
    },
    REFERRAL: {
      GET_ALL: '/referral',
      STATS: '/referral/stats'
    }
  },
  TIMEOUT: 30000 // 30 seconds
};

export default API; 