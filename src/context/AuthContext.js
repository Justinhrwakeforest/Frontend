// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api'; // Use the api service instead of axios directly

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);

  // Fetch user data when token is available
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      // Use the api service instead of axios directly
      const response = await api.get('/auth/profile/');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      // Only logout if it's an auth error, not a network error
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = (authToken, userData) => {
    localStorage.setItem('auth_token', authToken);
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
