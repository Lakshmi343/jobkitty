import axios from 'axios';
import { authUtils } from './authUtils';
import { tokenManager } from './tokenManager';

class AxiosInterceptor {
  constructor() {
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    axios.interceptors.request.use(
      async (config) => {
        // Only handle API calls that need authentication
        if (config.url?.includes('/api/v1/')) {
          // Handle admin routes - only for admin API endpoints
          if (config.url.includes('/admin/')) {
            const adminToken = tokenManager.getAccessToken() || localStorage.getItem('adminToken');
            if (adminToken && adminToken !== 'null' && adminToken !== 'undefined') {
              config.headers.Authorization = `Bearer ${adminToken}`;
            }
          } 
          // Handle regular user routes - for user endpoints that need auth
          else {
            // Only add user token for protected endpoints
            const protectedEndpoints = ['/profile', '/application', '/company', '/job'];
            const needsAuth = protectedEndpoints.some(endpoint => config.url.includes(endpoint));
            
            if (needsAuth) {
              const userToken = authUtils.getAccessToken();
              if (userToken && userToken !== 'null' && userToken !== 'undefined') {
                config.headers.Authorization = `Bearer ${userToken}`;
              }
            }
          }
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle blocked account for regular users only
        if (error.response?.status === 403 && error.response?.data?.blocked && !originalRequest.url?.includes('/admin/')) {
          authUtils.clearTokens();
          window.location.href = '/blocked-account';
          return Promise.reject(error);
        }

        // Handle 401 errors (unauthorized) - only for API calls
        if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url?.includes('/api/v1/')) {
          originalRequest._retry = true;

          // Handle admin routes
          if (originalRequest.url.includes('/admin/')) {
            try {
              const newToken = await tokenManager.refreshAccessToken();
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return axios(originalRequest);
            } catch (refreshError) {
              tokenManager.clearTokens();
              window.location.href = '/admin/login';
              return Promise.reject(refreshError);
            }
          } 
          // Handle regular user routes - only for protected endpoints
          else {
            const protectedEndpoints = ['/profile', '/application', '/company', '/job'];
            const needsAuth = protectedEndpoints.some(endpoint => originalRequest.url.includes(endpoint));
            
            if (needsAuth) {
              try {
                const newToken = await authUtils.refreshAccessToken();
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axios(originalRequest);
              } catch (refreshError) {
                authUtils.clearTokens();
                window.location.href = '/login';
                return Promise.reject(refreshError);
              }
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }
}

// Create and export singleton instance
export const axiosInterceptor = new AxiosInterceptor();
export default axiosInterceptor;
