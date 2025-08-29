import axios from 'axios';
import { ADMIN_API_END_POINT } from './constant';

class TokenManager {
  constructor() {
    this.accessToken = localStorage.getItem('adminAccessToken');
    this.refreshToken = localStorage.getItem('adminRefreshToken');
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('adminAccessToken', accessToken);
    localStorage.setItem('adminRefreshToken', refreshToken);
  }

  getAccessToken() {
    return this.accessToken;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('admin');
    localStorage.removeItem('adminRole');
  }

  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${ADMIN_API_END_POINT}/refresh-token`, {
        refreshToken: this.refreshToken
      });

      if (response.data.success) {
        this.setTokens(response.data.accessToken, response.data.refreshToken);
        return response.data.accessToken;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  processQueue(error, token = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  setupInterceptors() {
    // Clear existing interceptors to prevent duplicates
    axios.interceptors.request.clear();
    axios.interceptors.response.clear();
    
    // Request interceptor to add token
    axios.interceptors.request.use(
      (config) => {
        // Add token to all admin API requests
        const token = this.accessToken || localStorage.getItem('adminAccessToken');
        if (token && (config.url?.includes('/admin/') || config.url?.includes('admin'))) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axios(originalRequest);
            }).catch(err => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshAccessToken();
            this.processQueue(null, newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            this.clearTokens();
            window.location.href = '/admin/login';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  isAuthenticated() {
    // Check both memory and localStorage
    return !!(this.accessToken || localStorage.getItem('adminAccessToken'));
  }
}

export const tokenManager = new TokenManager();
export default tokenManager;
