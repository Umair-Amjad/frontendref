import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EnvIndicator from './components/EnvIndicator';

// Public Pages of user side
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ApiTestPage from './pages/ApiTestPage';

// Private Pages
import Dashboard from './pages/Dashboard';
import Invest from './pages/Invest';
import Profile from './pages/Profile';
import Withdrawals from './pages/Withdrawals';
import Referrals from './pages/Referrals';
import ReferralEarnings from './pages/ReferralEarnings';
import Investments from './pages/Investments';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminInvestments from './pages/admin/Investments';
import AdminWithdrawals from './pages/admin/Withdrawals';
import AdminSettings from './pages/admin/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/api-test" element={<ApiTestPage />} />
            
            {/* Private Routes */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/invest" 
              element={
                <PrivateRoute>
                  <Invest />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/withdrawals" 
              element={
                <PrivateRoute>
                  <Withdrawals />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/referrals" 
              element={
                <PrivateRoute>
                  <Referrals />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/referral-earnings" 
              element={
                <PrivateRoute>
                  <ReferralEarnings />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/investments" 
              element={
                <PrivateRoute>
                  <Investments />
                </PrivateRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/investments" 
              element={
                <AdminRoute>
                  <AdminInvestments />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/withdrawals" 
              element={
                <AdminRoute>
                  <AdminWithdrawals />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <AdminRoute>
                  <AdminSettings />
                </AdminRoute>
              } 
            />
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer />
          <EnvIndicator />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 