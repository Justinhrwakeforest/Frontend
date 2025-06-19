// src/App.js - Updated for debugging StartupUploadForm issue
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { NotificationProvider } from './components/NotificationSystem';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Startups from './components/Startups';
import StartupDetail from './components/StartupDetail';
import StartupUploadForm from './components/StartupUploadForm';
import AdminDashboard from './components/AdminDashboard';
import Jobs from './components/Jobs';
import Profile from './components/Profile';
import Bookmarks from './components/Bookmarks';
import Settings from './components/Settings';
import Activity from './components/Activity';
import Help from './components/Help';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Test component to verify routing works
const TestUploadForm = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>🎉 Test Upload Form Works!</h1>
      <p>If you see this, the routing is working perfectly.</p>
      <p>This means the issue is specifically with the StartupUploadForm component.</p>
      <div style={{ 
        background: '#f0f8ff', 
        padding: '15px', 
        border: '1px solid #0066cc',
        borderRadius: '5px',
        marginTop: '20px'
      }}>
        <strong>Next steps:</strong>
        <ol>
          <li>Check browser console for JavaScript errors</li>
          <li>Verify StartupUploadForm.js file exists and has correct syntax</li>
          <li>Check for import/export issues</li>
        </ol>
      </div>
    </div>
  );
};

// Loading Component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
    <div className="text-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="text-gray-600 font-medium text-lg">Loading StartupHub...</p>
      <p className="text-gray-500 text-sm mt-2">Connecting you to innovation</p>
    </div>
  </div>
);

// Error Fallback Component
const ErrorFallback = ({ error, resetError }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center max-w-md mx-auto p-6">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4">
        We're sorry, but something unexpected happened. Please try refreshing the page.
      </p>
      <div className="space-y-3">
        <button 
          onClick={resetError}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
        <button 
          onClick={() => window.location.href = '/'}
          className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Go to Homepage
        </button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 text-left">
          <summary className="text-sm text-gray-500 cursor-pointer">Error Details (Development Only)</summary>
          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
            {error?.stack || error?.message || 'Unknown error'}
          </pre>
        </details>
      )}
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const authContextValue = useContext(AuthContext);
  
  if (!authContextValue) {
    return <LoadingScreen />;
  }

  const { isAuthenticated, loading } = authContextValue;
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

// DEBUG: Component wrapper to catch errors in StartupUploadForm specifically
const StartupUploadFormWrapper = () => {
  try {
    return (
      <div>
        <div style={{ 
          background: '#fff3cd', 
          color: '#856404',
          padding: '10px',
          margin: '10px',
          borderRadius: '5px',
          border: '1px solid #ffeaa7'
        }}>
          <strong>DEBUG MODE:</strong> Loading StartupUploadForm...
        </div>
        <StartupUploadForm />
      </div>
    );
  } catch (error) {
    console.error('StartupUploadForm Error:', error);
    return (
      <div style={{ padding: '20px' }}>
        <h2 style={{ color: 'red' }}>StartupUploadForm Error Caught:</h2>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '5px',
          overflow: 'auto',
          fontSize: '12px'
        }}>
          {error.toString()}
          {error.stack && '\n\nStack trace:\n' + error.stack}
        </pre>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginTop: '10px',
            cursor: 'pointer'
          }}
        >
          Reload Page
        </button>
      </div>
    );
  }
};

// App Routes Component
const AppRoutes = () => {
  const authContextValue = useContext(AuthContext);

  if (!authContextValue) {
    return <LoadingScreen />;
  }

  const { isAuthenticated, loading } = authContextValue;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
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
                <ErrorBoundary fallback={ErrorFallback}>
                  <Dashboard />
                </ErrorBoundary>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/startups" 
            element={
              <ProtectedRoute>
                <ErrorBoundary fallback={ErrorFallback}>
                  <Startups />
                </ErrorBoundary>
              </ProtectedRoute>
            } 
          />
          
          {/* DEBUG VERSION: Multiple options for startup upload form */}
          <Route 
            path="/startups/new" 
            element={
              <ProtectedRoute>
                {/* OPTION 1: Test if routing works with simple component */}
                {/* <TestUploadForm /> */}
                
                {/* OPTION 2: Try without ErrorBoundary to see raw errors */}
                <StartupUploadForm />
                
                {/* OPTION 3: With ErrorBoundary (current setup) */}
                {/* 
                <ErrorBoundary fallback={ErrorFallback}>
                  <StartupUploadFormWrapper />
                </ErrorBoundary>
                */}
                
                {/* OPTION 4: For extreme debugging - comment out all above and use this: */}
                {/* 
                <div style={{ padding: '20px' }}>
                  <h1>Route Test</h1>
                  <p>If you see this, routing works but StartupUploadForm has issues.</p>
                </div>
                */}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <ErrorBoundary fallback={ErrorFallback}>
                  <AdminDashboard />
                </ErrorBoundary>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/startups/:id" 
            element={
              <ProtectedRoute>
                <ErrorBoundary fallback={ErrorFallback}>
                  <StartupDetail />
                </ErrorBoundary>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/jobs" 
            element={
              <ProtectedRoute>
                <ErrorBoundary fallback={ErrorFallback}>
                  <Jobs />
                </ErrorBoundary>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ErrorBoundary fallback={ErrorFallback}>
                  <Profile />
                </ErrorBoundary>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bookmarks" 
            element={
              <ProtectedRoute>
                <ErrorBoundary fallback={ErrorFallback}>
                  <Bookmarks />
                </ErrorBoundary>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <ErrorBoundary fallback={ErrorFallback}>
                  <Settings />
                </ErrorBoundary>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/activity" 
            element={
              <ProtectedRoute>
                <ErrorBoundary fallback={ErrorFallback}>
                  <Activity />
                </ErrorBoundary>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/help" 
            element={
              <ProtectedRoute>
                <ErrorBoundary fallback={ErrorFallback}>
                  <Help />
                </ErrorBoundary>
              </ProtectedRoute>
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

// Main App Component
function App() {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
