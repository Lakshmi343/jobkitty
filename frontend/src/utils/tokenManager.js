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
    if (refreshToken) {
      localStorage.setItem('adminRefreshToken', refreshToken);
    } else {
      // Remove refresh token if null (backend doesn't provide it)
      localStorage.removeItem('adminRefreshToken');
    }
    // Also store in legacy format for backward compatibility
    localStorage.setItem('adminToken', accessToken);
    
    console.log('TokenManager: Tokens set:', {
      accessToken: accessToken ? 'Present' : 'Missing',
      refreshToken: refreshToken ? 'Present' : 'Missing'
    });
  }

  getAccessToken() {
    // Always sync with localStorage to handle external updates
    this.accessToken = localStorage.getItem('adminAccessToken');
    return this.accessToken;
  }

  getRefreshToken() {
    // Always sync with localStorage to handle external updates
    this.refreshToken = localStorage.getItem('adminRefreshToken');
    return this.refreshToken;
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('adminToken'); // Remove legacy format
    localStorage.removeItem('adminData');
    localStorage.removeItem('adminRole');
  }

  async refreshAccessToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      console.log('TokenManager: No refresh token available, cannot refresh');
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${ADMIN_API_END_POINT}/refresh-token`, {
        refreshToken: refreshToken
      });

      if (response.data.success) {
        this.setTokens(response.data.accessToken, response.data.refreshToken || refreshToken);
        return response.data.accessToken;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('TokenManager: Token refresh failed:', error);
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

  // Removed setupInterceptors() - using axiosInterceptor.js instead to prevent conflicts

  isAuthenticated() {
    // Check both memory and localStorage
    return !!(this.accessToken || localStorage.getItem('adminAccessToken'));
  }
}

export const tokenManager = new TokenManager();
export default tokenManager;
