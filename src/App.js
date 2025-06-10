// src/App.js - Complete fixed version with proper syntax
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Startups from './components/Startups';
import StartupDetail from './components/StartupDetail';
import Jobs from './components/Jobs';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AppRoutes = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Debug logging
  console.log('Auth status:', { isAuthenticated, loading });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading StartupHub...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {/* Only show authenticated navbar when user is logged in and not on welcome page */}
        {isAuthenticated && <Navbar />}
        
        <Routes>
          {/* Public welcome page - shows when not authenticated */}
          <Route 
            path="/welcome" 
            element={!isAuthenticated ? <Home /> : <Navigate to="/" />} 
          />
          
          {/* Auth route - redirects to dashboard if already authenticated */}
          <Route 
            path="/auth" 
            element={!isAuthenticated ? <Auth /> : <Navigate to="/" />} 
          />
          
          {/* Protected routes - require authentication */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/startups" 
            element={
              <ProtectedRoute>
                <Startups />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/startups/:id" 
            element={
              <ProtectedRoute>
                <StartupDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/jobs" 
            element={
              <ProtectedRoute>
                <Jobs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Default route - redirects based on auth status */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              ) : (
                <Navigate to="/welcome" replace />
              )
            } 
          />
          
          {/* Catch-all redirect */}
          <Route 
            path="*" 
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/welcome" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
