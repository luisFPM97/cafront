/**
 * API Service Configuration
 * 
 * Configures Axios instance with:
 * - Base URL setup
 * - Request interceptors for authentication
 * - Response interceptors for error handling
 * - Token management
 * 
 * @module
 */
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.16.0.60:8080/',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userToken');
    }
    
    // Extract the error message
    const errorMessage = error.response?.data?.error || error.message || 'An unexpected error occurred';
    console.error('Error en la petición:', errorMessage);
    return Promise.reject(errorMessage);
  }
);

export default api;