// src/services/api.js - Complete with enhanced error handling and debugging
import axios from 'axios';

// Use environment variable or fallback to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

console.log('🔧 API Configuration:', {
  baseURL: API_BASE_URL,
  environment: process.env.NODE_ENV
});

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout for admin operations
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
        headers: {
          ...config.headers,
          Authorization: token ? 'Token [PRESENT]' : '[MISSING]'
        }
      });
    }
    
    return config;
  },
  (error) => {
    console.error('🔴 Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle responses and errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
        dataLength: Array.isArray(response.data) ? response.data.length : undefined
      });
    }
    return response;
  },
  (error) => {
    // Enhanced error logging
    console.error('🔴 API Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    // Handle different error types
    if (error.response?.status === 401) {
      console.warn('🔐 Authentication failed - redirecting to login');
      // Only redirect to auth if we're not already there
      if (!window.location.pathname.includes('/auth')) {
        localStorage.removeItem('auth_token');
        window.location.href = '/auth';
      }
    } else if (error.response?.status === 403) {
      console.warn('🚫 Access forbidden - insufficient permissions');
    } else if (error.response?.status === 404) {
      console.warn('🔍 Resource not found');
    } else if (error.response?.status >= 500) {
      console.error('🔥 Server error occurred');
    } else if (error.message === 'Network Error') {
      console.error('🌐 Network connectivity issue');
    } else if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout');
    }
    
    return Promise.reject(error);
  }
);

// Add some utility methods for debugging
api.testConnection = async () => {
  try {
    console.log('🔍 Testing API connection...');
    const response = await api.get('/');
    console.log('✅ API connection successful');
    return true;
  } catch (error) {
    console.error('❌ API connection failed:', error.message);
    return false;
  }
};

api.checkAuth = async () => {
  try {
    console.log('🔍 Checking authentication...');
    const response = await api.get('/auth/user/');
    console.log('✅ Authentication valid:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Authentication check failed:', error.message);
    return null;
  }
};

export default api;
