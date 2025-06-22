// src/App.js - Complete App Component with All Routes
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
import StartupEditForm from './components/StartupEditForm';
import AdminDashboard from './components/AdminDashboard';
import Jobs from './components/Jobs';
import JobDetailPage from './components/JobDetailPage';
import JobEditForm from './components/JobEditForm';
import JobAdminDashboard from './components/JobAdminDashboard';
import Profile from './components/Profile';
import Bookmarks from './components/Bookmarks';
import Settings from './components/Settings';
import Activity from './components/Activity';
import Help from './components/Help';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

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

// Admin Route Component
const AdminRoute = ({ children }) => {
  const authContextValue = useContext(AuthContext);
  
  if (!authContextValue) {
    return <LoadingScreen />;
  }

  const { isAuthenticated, loading, user } = authContextValue;
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  if (!user?.is_staff && !user?.is_superuser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this admin area.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return children;
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
        <Routes>
          {/* Public welcome page - shows when not authenticated (no navbar/footer) */}
          <Route 
            path="/welcome" 
            element={!isAuthenticated ? <Home /> : <Navigate to="/" />} 
          />
          
          {/* Auth route - redirects to dashboard if already authenticated (no navbar/footer) */}
          <Route 
            path="/auth" 
            element={!isAuthenticated ? <Auth /> : <Navigate to="/" />} 
          />
          
          {/* Protected routes - require authentication (WITH navbar/footer via Layout) */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ErrorBoundary fallback={ErrorFallback}>
                    <Dashboard />
                  </ErrorBoundary>
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Startup Routes */}
          <Route 
            path="/startups" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ErrorBoundary fallback={ErrorFallback}>
                    <Startups />
                  </ErrorBoundary>
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/startups/new" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ErrorBoundary fallback={ErrorFallback}>
                    <StartupUploadForm />
                  </ErrorBoundary>
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/startups/:id/edit" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ErrorBoundary fallback={ErrorFallback}>
                    <StartupEditForm />
                  </ErrorBoundary>
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/startups/:id" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ErrorBoundary fallback={ErrorFallback}>
                    <StartupDetail />
                  </ErrorBoundary>
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Job Routes */}
          <Route 
            path="/jobs" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ErrorBoundary fallback={ErrorFallback}>
                    <Jobs />
                  </ErrorBoundary>
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/jobs/:id" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ErrorBoundary fallback={ErrorFallback}>
                    <JobDetailPage />
                  </ErrorBoundary>
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/jobs/:id/edit" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ErrorBoundary fallback={ErrorFallback}>
                    <JobEditForm />
                  </ErrorBoundary>
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <Layout>
                  <ErrorBoundary fallback={ErrorFallback}>
                    <AdminDashboard />
                  </ErrorBoundary>
                </Layout>
              </AdminRoute>
            } 
          />
          
          <Route 
            path="/job-admin" 
            element={
              <AdminRoute>
                <Layout>
                  <ErrorBoundary fallback={ErrorFallback}>
                    <JobAdminDashboard />
                  </ErrorBoundary>
                </Layout>
              </AdminRoute>
            } 
          />
          
          {/* User Profile and Settings Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ErrorBoundary fallback={ErrorFallback}>
                    <Profile />
                  </ErrorBoundary>
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/bookmarks" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ErrorBoundary fallback={ErrorFallback}>
                    <Bookmarks />
                  </ErrorBoundary>
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ErrorBoundary fallback={ErrorFallback}>
                    <Settings />
                  </ErrorBoundary>
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/activity" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ErrorBoundary fallback={ErrorFallback}>
                    <Activity />
                  </ErrorBoundary>
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/help" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ErrorBoundary fallback={ErrorFallback}>
                    <Help />
                  </ErrorBoundary>
                </Layout>
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
