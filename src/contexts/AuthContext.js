import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI, userAPI } from '../services/api';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Verify token with API
          const response = await authAPI.verifyToken();
          
          if (response.data && response.data.success) {
            setCurrentUser(response.data.user);
          } else {
            // If verification fails, remove token
            localStorage.removeItem('token');
          }
        }
      } catch (err) {
        console.error('Authentication error:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.register(userData);
      
      // If registration is successful but requires email verification
      // we don't automatically log the user in
      if (response.data.success) {
        toast.success(response.data.message || 'Registration successful! Please check your email for verification.');
        return response.data;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      console.log('Login attempt for:', email);
      const response = await authAPI.login(email, password);
      
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        // Check if user login is disabled by admin settings
        if (response.data.user.isAdmin === false && response.data.settings && response.data.settings.allowUserLogin === false) {
          throw new Error('User login is currently disabled by the administrator.');
        }
        
        console.log('Setting token in localStorage:', response.data.token);
        localStorage.setItem('token', response.data.token);
        setCurrentUser(response.data.user);
        toast.success('Login successful!');
        return response.data.user;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    toast.info('You have been logged out');
  };

  // Forgot password
  const forgotPassword = async (email) => {
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.forgotPassword(email);
      if (response.data.success) {
        toast.success('Password reset instructions sent to your email');
      }
      return response.data.success;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send password reset email';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.resetPassword(token, newPassword);
      if (response.data.success) {
        toast.success('Password has been reset successfully');
      }
      return response.data.success;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to reset password';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify email
  const verifyEmail = async (verificationToken) => {
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.verifyEmail(verificationToken);
      if (response.data.success) {
        toast.success('Email verified successfully');
      }
      return response.data.success;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to verify email';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true);
    setError('');
    try {
      const response = await userAPI.updateProfile(userData);
      
      if (response.data.success) {
        setCurrentUser(prev => ({
          ...prev,
          ...response.data.data
        }));
        toast.success('Profile updated successfully');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile used by the Profile component
  const updateUserProfile = async (userData) => {
    setLoading(true);
    setError('');
    try {
      const response = await userAPI.updateProfile(userData);
      
      if (response.data.success) {
        setCurrentUser(prev => ({
          ...prev,
          ...response.data.data
        }));
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    setError,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    updateProfile,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 