import axios from 'axios';
import { USER_API_END_POINT } from './constant';

class AuthUtils {
  constructor() {
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
   
    localStorage.setItem('token', accessToken);
  }

  getAccessToken() {
    return this.accessToken || localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return this.refreshToken || localStorage.getItem('refreshToken');
  }


  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token'); // Remove old format
    localStorage.removeItem('user');
  }


  async refreshAccessToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${USER_API_END_POINT}/refresh-token`, {
        refreshToken: refreshToken
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        this.setTokens(response.data.accessToken, response.data.refreshToken || refreshToken);
        return response.data.accessToken;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
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

  
  isAuthenticated() {
    const token = this.getAccessToken();
    return !!(token && token !== 'null' && token !== 'undefined');
  }

  getUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  }

  
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  
  isTokenExpired(token) {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  
  async validateToken() {
    const token = this.getAccessToken();
    if (!token || this.isTokenExpired(token)) {
      try {
        await this.refreshAccessToken();
        return true;
      } catch (error) {
        this.clearTokens();
        return false;
      }
    }
    return true;
  }
}

export const authUtils = new AuthUtils();
export default authUtils;
