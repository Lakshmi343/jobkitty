import axios from 'axios';

// Global axios interceptor to handle blocked accounts
export const setupGlobalInterceptors = () => {
  // Response interceptor to handle blocked accounts
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Check if user account is blocked
      if (error.response?.status === 403 && error.response?.data?.blocked) {
        // Clear user data from localStorage and redirect to blocked page
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Redirect to blocked account page
        window.location.href = '/blocked-account';
        return Promise.reject(error);
      }
      
      return Promise.reject(error);
    }
  );
};

export default setupGlobalInterceptors;
