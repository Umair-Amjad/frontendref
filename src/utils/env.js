/**
 * Environment variables utility
 * 
 * This utility provides safer access to environment variables with fallbacks
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
 * Common environment variables
 */
export const ENV = {
  API_URL: getEnv('REACT_APP_API_URL', 'https://web-production-989cb.up.railway.app/api'),
  ENVIRONMENT: getEnv('REACT_APP_ENV', 'production'),
  IS_DEVELOPMENT: getEnv('REACT_APP_ENV', 'production') === 'development',
  IS_PRODUCTION: getEnv('REACT_APP_ENV', 'production') === 'production',
};

export default ENV; 