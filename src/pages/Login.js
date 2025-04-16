import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import { FaSignInAlt, FaExclamationCircle } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';
  
  const { email, password } = formData;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLoginError('');
    setError(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setLoginError('Please provide both email and password');
      return;
    }
    
    try {
      const user = await login(email, password);
      // Redirect to admin dashboard if user is admin, otherwise to user dashboard
      if (user && user.isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Login failed');
    }
  };
  
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
              create a new account
            </Link>
          </p>
        </div>
        
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {(loginError || error) && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex items-center">
                  <FaExclamationCircle className="text-red-400 mr-3" />
                  <p className="text-sm text-red-700">
                    {loginError || error}
                  </p>
                </div>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                    autoComplete="current-password"
                    required
                    className="input"
                    value={password}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
                
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-dark">
                    Forgot your password?
                  </Link>
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="btn btn-primary w-full flex justify-center items-center"
                >
                  <FaSignInAlt className="mr-2" />
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login; 