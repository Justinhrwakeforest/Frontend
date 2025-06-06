import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Home from './components/Home'; // Import the new Home component
import Startups from './components/Startups';
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
        {isAuthenticated && <Navbar />}
        <Routes>
          {/* Public route for the new landing page */}
          <Route path="/welcome" element={<Home />} />
          
          {/* Auth route - redirects to dashboard if already authenticated */}
          <Route 
            path="/auth" 
            element={isAuthenticated ? <Navigate to="/" /> : <Auth />} 
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
          
          {/* Catch-all redirect to dashboard if authenticated, otherwise to welcome page */}
          <Route 
            path="*" 
            element={
              isAuthenticated ? <Navigate to="/" /> : <Navigate to="/welcome" />
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
