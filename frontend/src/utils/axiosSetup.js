import axios from 'axios';

export const setupGlobalInterceptors = () => {
  // Request interceptor to add admin token
  axios.interceptors.request.use(
    (config) => {
      // Add admin token if exists and URL contains admin
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken && adminToken !== 'null' && adminToken !== 'undefined' && config.url?.includes('/admin/')) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
      
      // Add regular user token if exists and URL doesn't contain admin
      const userToken = localStorage.getItem('token');
      if (userToken && userToken !== 'null' && userToken !== 'undefined' && !config.url?.includes('/admin/')) {
        config.headers.Authorization = `Bearer ${userToken}`;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle blocked account
      if (error.response?.status === 403 && error.response?.data?.blocked) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/blocked-account';
        return Promise.reject(error);
      }
      
      // Handle admin auth errors
      if (error.response?.status === 401 && error.config?.url?.includes('/admin/')) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        window.location.href = '/admin/login';
        return Promise.reject(error);
      }
      
      return Promise.reject(error);
    }
  );
};

export default setupGlobalInterceptors;
