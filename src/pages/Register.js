import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import { FaUserPlus, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });
  const [registerError, setRegisterError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register, error, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { name, email, password, confirmPassword, referralCode } = formData;
  
  // Check for referral code in URL
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const ref = query.get('ref');
    
    if (ref) {
      setFormData(prevState => ({
        ...prevState,
        referralCode: ref
      }));
    }
  }, [location.search]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setRegisterError('');
    setError(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (password !== confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setRegisterError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const userData = {
        name,
        email,
        password,
        referralCode: referralCode || undefined
      };
      
      await register(userData);
      
      setSuccess(true);
      setLoading(false);
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        referralCode: referralCode // Keep referral code
      });
      
      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login');
      }, 5000);
      
    } catch (err) {
      setRegisterError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {success ? (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <div>
                    <p className="text-sm text-green-700 font-medium">
                      Registration successful!
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Please check your email to verify your account. You will be redirected to the login page.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              (registerError || error) && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex items-center">
                    <FaExclamationCircle className="text-red-400 mr-3" />
                    <p className="text-sm text-red-700">
                      {registerError || error}
                    </p>
                  </div>
                </div>
              )
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="label">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="input"
                    value={name}
                    onChange={handleChange}
                    disabled={success}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="label">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="input"
                    value={email}
                    onChange={handleChange}
                    disabled={success}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="label">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="input"
                    value={password}
                    onChange={handleChange}
                    disabled={success}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="label">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="input"
                    value={confirmPassword}
                    onChange={handleChange}
                    disabled={success}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="referralCode" className="label">
                  Referral Code (Optional)
                </label>
                <div className="mt-1">
                  <input
                    id="referralCode"
                    name="referralCode"
                    type="text"
                    className="input"
                    value={referralCode}
                    onChange={handleChange}
                    disabled={success}
                  />
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="btn btn-primary w-full flex justify-center items-center"
                  disabled={loading || success}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                      Processing...
                    </span>
                  ) : (
                    <>
                      <FaUserPlus className="mr-2" />
                      Create Account
                    </>
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-6">
              <p className="text-xs text-gray-500 text-center">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="font-medium text-primary hover:text-primary-dark">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="font-medium text-primary hover:text-primary-dark">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register; 