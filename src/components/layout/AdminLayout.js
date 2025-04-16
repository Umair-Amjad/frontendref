import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaTachometerAlt, FaUsers, FaMoneyBillWave, FaExchangeAlt, 
  FaCogs, FaSignOutAlt, FaBars, FaTimes 
} from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white';
  };

  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-700">You do not have permission to access the admin area.</p>
          <div className="mt-6">
            <Link to="/" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 overflow-y-auto transition duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:h-screen`}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800">
          <div className="flex items-center">
            <span className="text-white text-xl font-bold">Admin Panel</span>
          </div>
          <button
            onClick={closeSidebar}
            className="text-gray-300 hover:text-white md:hidden"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <nav className="px-2 py-4">
          <Link 
            to="/admin/dashboard" 
            className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/admin/dashboard')}`}
            onClick={closeSidebar}
          >
            <FaTachometerAlt className="mr-3 h-5 w-5" />
            Dashboard
          </Link>

          <Link 
            to="/admin/users" 
            className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/admin/users')}`}
            onClick={closeSidebar}
          >
            <FaUsers className="mr-3 h-5 w-5" />
            Users
          </Link>

          <Link 
            to="/admin/investments" 
            className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/admin/investments')}`}
            onClick={closeSidebar}
          >
            <FaMoneyBillWave className="mr-3 h-5 w-5" />
            Investments
          </Link>

          <Link 
            to="/admin/withdrawals" 
            className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/admin/withdrawals')}`}
            onClick={closeSidebar}
          >
            <FaExchangeAlt className="mr-3 h-5 w-5" />
            Withdrawals
          </Link>

          <Link 
            to="/admin/settings" 
            className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/admin/settings')}`}
            onClick={closeSidebar}
          >
            <FaCogs className="mr-3 h-5 w-5" />
            Settings
          </Link>

          <hr className="my-4 border-gray-700" />

          <button 
            onClick={handleLogout}
            className="w-full mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <FaSignOutAlt className="mr-3 h-5 w-5" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 focus:outline-none md:hidden"
            >
              <FaBars className="h-6 w-6" />
            </button>

            <div className="flex items-center">
              <div className="relative ml-3">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 mr-2">
                    {currentUser.name || currentUser.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 