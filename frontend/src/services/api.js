import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error for debugging
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error: No response from server. Is the backend running?', error.request);
      // Only show alert if it's not a timeout (timeout errors are handled differently)
      if (!error.code || error.code !== 'ECONNABORTED') {
        // Don't show alert on every request failure, just log it
        console.error('Backend connection failed. Make sure backend is running on http://localhost:5000');
      }
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't use window.location.href - it causes full page reload
      // Instead, dispatch logout action or let the component handle it
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        // Only redirect if not already on login/register page
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

