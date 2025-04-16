import React, { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../layout/Layout';

// Memoize the Layout component to prevent unnecessary rerenders
const MemoizedLayout = memo(Layout);

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  // If loading, return loading spinner or similar
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // If user is admin, redirect to admin dashboard
  if (currentUser.isAdmin) {
    return <Navigate to="/admin/dashboard" />;
  }
  
  // If authenticated and not admin, render the component wrapped in Layout
  return <MemoizedLayout>{children}</MemoizedLayout>;
};

export default PrivateRoute; 