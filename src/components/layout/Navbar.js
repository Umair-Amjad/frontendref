import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaEnvelope, FaStar, FaWallet, FaServer } from 'react-icons/fa';
import Modal from '../Modal';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setShowLogoutModal(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary">
                InvestPro
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              
              {currentUser ? (
                <>
                  <Link
                    to="/dashboard"
                    className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/invest"
                    className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Invest
                  </Link>
                  <Link
                    to="/referrals"
                    className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Referrals
                  </Link>
                  <Link
                    to="/withdrawals"
                    className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Withdrawals
                  </Link>
                  <Link
                    to="/api-test"
                    className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    <FaServer className="mr-1" /> API Test
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* User Dropdown Menu - Desktop */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {currentUser && (
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  {currentUser.isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="bg-primary text-white px-3 py-1 rounded text-sm"
                    >
                      Admin
                    </Link>
                  )}
                  <Link 
                    to="/profile" 
                    className="flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 px-3 py-2 rounded-full shadow-sm transition-all"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white">
                        {getInitials(currentUser.name)}
                      </div>
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-medium text-gray-700">{currentUser.name}</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="flex items-center text-gray-500 hover:text-red-500 transition-colors duration-200"
                  >
                    <FaSignOutAlt className="mr-1" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <FaTimes className="block h-6 w-6" /> : <FaBars className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="text-gray-600 hover:bg-gray-50 hover:text-primary block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          
          {currentUser ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-600 hover:bg-gray-50 hover:text-primary block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/invest"
                className="text-gray-600 hover:bg-gray-50 hover:text-primary block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Invest
              </Link>
              <Link
                to="/referrals"
                className="text-gray-600 hover:bg-gray-50 hover:text-primary block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Referrals
              </Link>
              <Link
                to="/withdrawals"
                className="text-gray-600 hover:bg-gray-50 hover:text-primary block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Withdrawals
              </Link>
              <Link
                to="/api-test"
                className="text-gray-600 hover:bg-gray-50 hover:text-primary block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                <FaServer className="inline mr-1" /> API Test
              </Link>
              <Link
                to="/profile"
                className="text-gray-600 hover:bg-gray-50 hover:text-primary block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              {currentUser.isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="text-gray-600 hover:bg-gray-50 hover:text-primary block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowLogoutModal(true);
                }}
                className="text-gray-600 hover:bg-gray-50 hover:text-primary block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:bg-gray-50 hover:text-primary block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-600 hover:bg-gray-50 hover:text-primary block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
        size="sm"
      >
        <div className="text-center py-4">
          <FaSignOutAlt className="mx-auto text-red-500 text-4xl mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Are you sure you want to log out?</h3>
          <p className="text-sm text-gray-500 mb-6">You will need to log in again to access your account.</p>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </nav>
  );
};

export default Navbar; 