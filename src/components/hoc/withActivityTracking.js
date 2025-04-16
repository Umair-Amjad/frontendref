import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import activityLogger from '../../services/activityLogger';

// Higher-order component that tracks page visits
const withActivityTracking = (Component, pageName) => {
  const WithActivityTracking = (props) => {
    const location = useLocation();
    
    useEffect(() => {
      // Log page view when component mounts
      activityLogger.logPageView(pageName || location.pathname);
      
      // Return cleanup function
      return () => {
        // Optionally log page exit
        activityLogger.logAction('page_exit', { 
          page: pageName || location.pathname,
          duration: new Date() - new Date(sessionStorage.getItem(`pageEnter_${location.pathname}`))
        });
      };
    }, [location.pathname]);
    
    // Set page enter timestamp
    useEffect(() => {
      sessionStorage.setItem(`pageEnter_${location.pathname}`, new Date().toISOString());
    }, [location.pathname]);
    
    return <Component {...props} logAction={activityLogger.logAction} />;
  };
  
  return WithActivityTracking;
};

export default withActivityTracking; 