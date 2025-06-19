// src/services/api.js
import axios from 'axios';

// Use 127.0.0.1 to match your Django server
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error for debugging
    console.error('API Error:', error);
    
    // Handle different error types
    if (error.response?.status === 401) {
      // Only redirect to auth if we're not already there
      if (!window.location.pathname.includes('/auth')) {
        localStorage.removeItem('auth_token');
        window.location.href = '/auth';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
