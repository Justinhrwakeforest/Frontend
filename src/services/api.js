// src/services/api.js - Enhanced API service with better error handling and startup-specific methods
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
        dataLength: Array.isArray(response.data) ? response.data.length : undefined,
        data: response.data // Log the actual data in development
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
      console.error('🌐 Network connectivity issue - is the backend running?');
      // Check if it's likely a CORS issue
      if (error.config?.url && !error.response) {
        console.error('💡 This might be a CORS issue. Check if your backend allows requests from:', window.location.origin);
      }
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
    if (error.message === 'Network Error') {
      console.error('💡 Make sure your Django backend is running at:', API_BASE_URL);
    }
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

// Startup-specific helper methods
api.startups = {
  // Get all industries
  getIndustries: async () => {
    try {
      const response = await api.get('/startups/industries/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch industries:', error);
      throw error;
    }
  },

  // Create a new startup
  create: async (startupData) => {
    try {
      console.log('📤 Creating startup with data:', startupData);
      const response = await api.post('/startups/', startupData);
      console.log('✅ Startup created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create startup:', error);
      // Log specific validation errors if available
      if (error.response?.data) {
        console.error('Validation errors:', error.response.data);
      }
      throw error;
    }
  },

  // Upload cover image for a startup
  uploadCoverImage: async (startupId, imageFile) => {
    try {
      console.log(`📤 Uploading cover image for startup ${startupId}`);
      const formData = new FormData();
      formData.append('cover_image', imageFile);

      const response = await api.post(
        `/startups/${startupId}/upload_cover_image/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('✅ Cover image uploaded successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to upload cover image:', error);
      throw error;
    }
  },

  // Get a single startup
  get: async (id) => {
    try {
      const response = await api.get(`/startups/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch startup ${id}:`, error);
      throw error;
    }
  },

  // List startups with filters
  list: async (params = {}) => {
    try {
      const response = await api.get('/startups/', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch startups:', error);
      throw error;
    }
  },

  // Submit edit request for a startup
  submitEdit: async (startupId, changes) => {
    try {
      console.log(`📤 Submitting edit request for startup ${startupId}:`, changes);
      const response = await api.post(`/startups/${startupId}/submit_edit/`, { changes });
      console.log('✅ Edit request submitted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to submit edit request:', error);
      throw error;
    }
  },

  // Claim a startup
  claim: async (startupId, claimData) => {
    try {
      console.log(`📤 Claiming startup ${startupId}:`, claimData);
      const response = await api.post(`/startups/${startupId}/claim/`, claimData);
      console.log('✅ Claim request submitted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to claim startup:', error);
      throw error;
    }
  },

  // Rate a startup
  rate: async (startupId, rating) => {
    try {
      const response = await api.post(`/startups/${startupId}/rate/`, { rating });
      return response.data;
    } catch (error) {
      console.error('Failed to rate startup:', error);
      throw error;
    }
  },

  // Toggle bookmark
  toggleBookmark: async (startupId) => {
    try {
      const response = await api.post(`/startups/${startupId}/bookmark/`);
      return response.data;
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
      throw error;
    }
  },

  // Toggle like
  toggleLike: async (startupId) => {
    try {
      const response = await api.post(`/startups/${startupId}/like/`);
      return response.data;
    } catch (error) {
      console.error('Failed to toggle like:', error);
      throw error;
    }
  },

  // Add comment
  addComment: async (startupId, text) => {
    try {
      const response = await api.post(`/startups/${startupId}/comment/`, { text });
      return response.data;
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  },

  // Get user's startups
  myStartups: async () => {
    try {
      const response = await api.get('/startups/my-startups/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch my startups:', error);
      throw error;
    }
  },

  // Get featured startups
  featured: async () => {
    try {
      const response = await api.get('/startups/featured/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch featured startups:', error);
      throw error;
    }
  },

  // Get trending startups
  trending: async () => {
    try {
      const response = await api.get('/startups/trending/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch trending startups:', error);
      throw error;
    }
  },
};

// Authentication helper methods
api.auth = {
  // Login
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login/', credentials);
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        console.log('✅ Login successful, token saved');
      }
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout/');
      localStorage.removeItem('auth_token');
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails on server, clear local token
      localStorage.removeItem('auth_token');
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register/', userData);
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        console.log('✅ Registration successful, token saved');
      }
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/user/');
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  },
};

// Admin-specific methods
api.admin = {
  // Get all startups (including unapproved)
  getStartups: async (filter = 'all', search = '') => {
    try {
      const response = await api.get('/startups/admin/', {
        params: { filter, search }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch admin startups:', error);
      throw error;
    }
  },

  // Perform admin action on a startup
  performAction: async (startupId, action) => {
    try {
      const response = await api.patch(`/startups/${startupId}/admin/`, { action });
      console.log(`✅ Admin action '${action}' performed on startup ${startupId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to perform admin action '${action}':`, error);
      throw error;
    }
  },

  // Bulk admin actions
  bulkAction: async (startupIds, action) => {
    try {
      const response = await api.post('/startups/bulk-admin/', {
        startup_ids: startupIds,
        action
      });
      console.log(`✅ Bulk admin action '${action}' performed on ${startupIds.length} startups`);
      return response.data;
    } catch (error) {
      console.error(`Failed to perform bulk admin action '${action}':`, error);
      throw error;
    }
  },

  // Get edit requests
  getEditRequests: async (status = 'pending') => {
    try {
      const response = await api.get('/startups/edit-requests/', {
        params: { status }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch edit requests:', error);
      throw error;
    }
  },

  // Approve edit request
  approveEditRequest: async (requestId) => {
    try {
      const response = await api.post(`/startups/edit-requests/${requestId}/approve/`);
      console.log(`✅ Edit request ${requestId} approved`);
      return response.data;
    } catch (error) {
      console.error('Failed to approve edit request:', error);
      throw error;
    }
  },

  // Reject edit request
  rejectEditRequest: async (requestId, notes = '') => {
    try {
      const response = await api.post(`/startups/edit-requests/${requestId}/reject/`, { notes });
      console.log(`✅ Edit request ${requestId} rejected`);
      return response.data;
    } catch (error) {
      console.error('Failed to reject edit request:', error);
      throw error;
    }
  },

  // Get claim requests
  getClaimRequests: async (status = 'pending') => {
    try {
      const response = await api.get('/startups/admin/claim-requests/', {
        params: { status }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch claim requests:', error);
      throw error;
    }
  },

  // Approve claim request
  approveClaimRequest: async (requestId, notes = '') => {
    try {
      const response = await api.post(`/startups/admin/claim-requests/${requestId}/approve/`, { notes });
      console.log(`✅ Claim request ${requestId} approved`);
      return response.data;
    } catch (error) {
      console.error('Failed to approve claim request:', error);
      throw error;
    }
  },

  // Reject claim request
  rejectClaimRequest: async (requestId, notes = '') => {
    try {
      const response = await api.post(`/startups/admin/claim-requests/${requestId}/reject/`, { notes });
      console.log(`✅ Claim request ${requestId} rejected`);
      return response.data;
    } catch (error) {
      console.error('Failed to reject claim request:', error);
      throw error;
    }
  },
};

// Export the enhanced API instance
export default api;
