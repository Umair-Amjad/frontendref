import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaHome, FaChartLine, FaMoneyBillWave, FaUsers, FaCog, FaSignOutAlt, FaWallet } from 'react-icons/fa';
import Footer from './Footer';

const Layout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-700';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">Referral Platform</Link>
          
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <span className="text-sm hidden md:inline-block">
                  Welcome, {currentUser.name || currentUser.email}
                </span>
                <button 
                  onClick={logout}
                  className="bg-blue-700 hover:bg-blue-800 py-1 px-3 rounded text-sm flex items-center"
                >
                  <FaSignOutAlt className="mr-1" /> Logout
                </button>
              </>
            ) : (
              <div className="space-x-2">
                <Link to="/login" className="bg-blue-700 hover:bg-blue-800 py-1 px-3 rounded text-sm">
                  Login
                </Link>
                <Link to="/register" className="bg-white text-blue-600 hover:bg-blue-50 py-1 px-3 rounded text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {currentUser && !location.pathname.startsWith('/admin') && (
        <div className="bg-blue-700 text-white shadow-md">
          <div className="container mx-auto px-4">
            <nav className="flex overflow-x-auto">
              <Link to="/dashboard" className={`py-3 px-4 text-sm font-medium flex items-center ${isActive('/dashboard')}`}>
                <FaHome className="mr-2" /> Dashboard
              </Link>
              <Link to="/invest" className={`py-3 px-4 text-sm font-medium flex items-center ${isActive('/invest')}`}>
                <FaChartLine className="mr-2" /> Invest
              </Link>
              <Link to="/investments" className={`py-3 px-4 text-sm font-medium flex items-center ${isActive('/investments')}`}>
                <FaMoneyBillWave className="mr-2" /> My Investments
              </Link>
              <Link to="/withdrawals" className={`py-3 px-4 text-sm font-medium flex items-center ${isActive('/withdrawals')}`}>
                <FaWallet className="mr-2" /> Withdrawals
              </Link>
              <Link to="/referrals" className={`py-3 px-4 text-sm font-medium flex items-center ${isActive('/referrals')}`}>
                <FaUsers className="mr-2" /> Referrals
              </Link>
              <Link to="/profile" className={`py-3 px-4 text-sm font-medium flex items-center ${isActive('/profile')}`}>
                <FaCog className="mr-2" /> Profile
              </Link>
            </nav>
          </div>
        </div>
      )}
      
      <main className="flex-grow bg-gray-50">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout; 