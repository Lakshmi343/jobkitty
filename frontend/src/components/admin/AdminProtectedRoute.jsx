import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { tokenManager } from '../../utils/tokenManager';

const AdminProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Ensure tokenManager has loaded tokens from localStorage
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
  }, []);

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