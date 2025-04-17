/**
 * Environment variables utility
 * 
 * This utility provides safer access to environment variables with fallbacks
 * and better environment detection
 */

/**
 * Get an environment variable with a fallback value
 * @param {string} key - The environment variable key
 * @param {string} fallback - Fallback value if the environment variable is not set
 * @returns {string} The environment variable value or fallback
 */
export const getEnv = (key, fallback = '') => {
  return process.env[key] || fallback;
};

/**
 * Detect if we are in a production environment
 * Checks both explicit environment variables and hostname
 */
export const isProduction = () => {
  // Check if we're on Vercel or other production hosting
  const isProductionHost = 
    window.location.hostname === 'frontendref.vercel.app' || 
    !window.location.hostname.includes('localhost');
  
  // Check if we have an explicit environment variable
  const hasProductionFlag = getEnv('REACT_APP_ENV') === 'production';
  
  return hasProductionFlag || isProductionHost;
};

/**
 * Common environment variables with smart defaults
 */
export const ENV = {
  // For API_URL: use environment variable, or detect based on hostname
  API_URL: getEnv('REACT_APP_API_URL', 
    isProduction() 
      ? 'https://web-production-989cb.up.railway.app/api'
      : 'http://localhost:8000/api'
  ),
  
  // Environment flags
  ENVIRONMENT: getEnv('REACT_APP_ENV', isProduction() ? 'production' : 'development'),
  IS_DEVELOPMENT: !isProduction(),
  IS_PRODUCTION: isProduction(),
  
  // Frontend URL for reference
  FRONTEND_URL: isProduction() 
    ? 'https://frontendref.vercel.app'
    : 'http://localhost:3000'
};

export default ENV; 