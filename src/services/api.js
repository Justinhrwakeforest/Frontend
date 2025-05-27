import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Don't redirect automatically, let components handle it
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register/', userData),
  login: (credentials) => api.post('/auth/login/', credentials),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.patch('/auth/profile/', data),
  getUserActivity: () => api.get('/auth/activity/'),
};

// Startups API
export const startupsAPI = {
  getAll: (params) => api.get('/startups/', { params }),
  getFeatured: () => api.get('/startups/featured/'),
  getById: (id) => api.get(`/startups/${id}/`),
  rate: (id, rating) => api.post(`/startups/${id}/rate/`, { rating }),
  comment: (id, text) => api.post(`/startups/${id}/comment/`, { text }),
  bookmark: (id) => api.post(`/startups/${id}/bookmark/`),
  like: (id) => api.post(`/startups/${id}/like/`),
};

// Industries API
export const industriesAPI = {
  getAll: () => api.get('/startups/industries/'),
};

// Jobs API
export const jobsAPI = {
  getAll: (params) => api.get('/jobs/', { params }),
  getById: (id) => api.get(`/jobs/${id}/`),
  apply: (id, coverLetter) => api.post(`/jobs/${id}/apply/`, { cover_letter: coverLetter }),
};

// Stats API
export const statsAPI = {
  getDashboard: () => api.get('/stats/'),
};

export default api;