import axios from 'axios';
import { authUtils } from './authUtils';
import { tokenManager } from './tokenManager';

class AxiosInterceptor {
  constructor() {
    this.setupInterceptors();
  }

  setupInterceptors() {

    axios.interceptors.request.use(
      async (config) => {
     
        if (config.url?.includes('/api/v1/')) {
          
          if (config.url.includes('/admin/')) {
            const adminToken = tokenManager.getAccessToken() || localStorage.getItem('adminAccessToken');
            if (adminToken && adminToken !== 'null' && adminToken !== 'undefined') {
              config.headers.Authorization = `Bearer ${adminToken}`;
            }
          } 
        
          else {
          
            // Endpoints that require user auth and should include Authorization + support refresh
            const protectedEndpoints = [
              '/profile',
              '/profile/update',
              '/profile/photo',
              '/upload-resume',
              '/application',
              '/company',
              '/job'
            ];
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

    
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 403 && error.response?.data?.blocked && !originalRequest.url?.includes('/admin/')) {
          authUtils.clearTokens();
          window.location.href = '/blocked-account';
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url?.includes('/api/v1/')) {
          originalRequest._retry = true;

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
    
          else {
            const protectedEndpoints = [
              '/profile',
              '/profile/update',
              '/profile/photo',
              '/upload-resume',
              '/application',
              '/company',
              '/job'
            ];
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


export const axiosInterceptor = new AxiosInterceptor();
export default axiosInterceptor;
