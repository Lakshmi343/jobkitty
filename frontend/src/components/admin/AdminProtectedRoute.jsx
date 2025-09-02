import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { tokenManager } from '../../utils/tokenManager';

const AdminProtectedRoute = ({ children }) => {
  const { user } = useSelector(store => store.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is logged in via Redux and has admin role
        if (user && user.role === 'admin') {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
        
        // Check localStorage for admin data (persists on refresh)
        const adminData = localStorage.getItem('admin');
        const adminRole = localStorage.getItem('adminRole');
        if (adminData && adminRole === 'admin') {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
        
        // Fallback to token-based authentication
        if (!tokenManager.accessToken) {
          tokenManager.accessToken = localStorage.getItem('adminAccessToken');
          tokenManager.refreshToken = localStorage.getItem('adminRefreshToken');
        }
        
        if (tokenManager.isAuthenticated()) {
          // Setup interceptors for token management
          tokenManager.setupInterceptors();
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

export default AdminProtectedRoute; 