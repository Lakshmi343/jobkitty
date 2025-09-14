import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check for admin token and data (check both new and legacy formats)
        const adminToken = localStorage.getItem('adminAccessToken') || localStorage.getItem('adminToken');
        const adminData = localStorage.getItem('adminData');
        
        console.log('AdminProtectedRoute - Auth check:', {
          adminAccessToken: localStorage.getItem('adminAccessToken'),
          adminToken: localStorage.getItem('adminToken'),
          adminData: adminData ? 'Present' : 'Missing',
          finalToken: adminToken
        });
        
        if (adminToken && adminToken !== 'null' && adminToken !== 'undefined' && adminData) {
          const admin = JSON.parse(adminData);
          console.log('AdminProtectedRoute - Admin data:', admin);
          
          // Check if role is allowed (if allowedRoles is specified)
          if (allowedRoles.length > 0 && !allowedRoles.includes(admin.role)) {
            console.log('AdminProtectedRoute - Role not allowed:', { userRole: admin.role, allowedRoles });
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
          }
          
          console.log('AdminProtectedRoute - Authentication successful');
          setIsAuthenticated(true);
        } else {
          console.log('AdminProtectedRoute - Authentication failed:', {
            hasToken: !!adminToken,
            hasData: !!adminData,
            tokenValue: adminToken
          });
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('AdminProtectedRoute - Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [allowedRoles]);

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