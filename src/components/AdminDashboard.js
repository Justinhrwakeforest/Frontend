// src/components/AdminDashboard.js - Complete Fixed Version
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import {
  Shield, CheckCircle, XCircle, Clock, Star, Users, Building,
  Eye, Edit, Trash2, Search, Filter, Calendar, MapPin,
  AlertCircle, CheckSquare, X, RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('pending'); // 'all', 'pending', 'approved', 'featured'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStartups, setSelectedStartups] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchStartups();
  }, [filter]);

  const fetchStartups = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Fetching startups with params:', { filter, searchTerm });
      console.log('🔗 Making request to:', '/startups/admin/');
      console.log('🔑 Auth token:', localStorage.getItem('auth_token') ? 'Present' : 'Missing');
      console.log('👤 Current user:', user);
      
      // Fetch all startups (both approved and unapproved)
      const response = await api.get('/startups/admin/', {
        params: {
          filter: filter,
          search: searchTerm
        }
      });
      
      console.log('✅ Response received:', response.data);
      console.log('📊 Startups count:', response.data.results?.length || response.data.length || 0);
      
      const startupsData = response.data.results || response.data;
      setStartups(Array.isArray(startupsData) ? startupsData : []);
      
      // Log each startup's approval status
      if (Array.isArray(startupsData)) {
        startupsData.forEach(startup => {
          console.log(`📝 Startup: ${startup.name} | Approved: ${startup.is_approved} | Featured: ${startup.is_featured} | Submitted by: ${startup.submitted_by?.username || 'Unknown'}`);
        });
      }
      
    } catch (error) {
      console.error('❌ Error fetching startups:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      let errorMessage = 'Failed to load startups. Please try again.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. You need admin permissions to view this page.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Admin endpoint not found. Please check your server configuration.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalAction = async (startupId, action) => {
    setActionLoading(true);
    try {
      console.log(`🔄 Performing action '${action}' on startup ${startupId}`);
      
      await api.patch(`/startups/${startupId}/admin/`, {
        action: action // 'approve', 'reject', 'feature', 'unfeature'
      });
      
      console.log(`✅ Action '${action}' completed successfully`);
      
      // Refresh the list
      fetchStartups();
      
      // Clear selection if startup was in selected list
      setSelectedStartups(prev => prev.filter(id => id !== startupId));
    } catch (error) {
      console.error(`❌ Error performing action '${action}':`, error);
      setError(`Failed to ${action} startup. Please try again.`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedStartups.length === 0) return;
    
    setActionLoading(true);
    try {
      console.log(`🔄 Performing bulk action '${action}' on ${selectedStartups.length} startups`);
      
      await api.post('/startups/bulk-admin/', {
        startup_ids: selectedStartups,
        action: action
      });
      
      console.log(`✅ Bulk action '${action}' completed successfully`);
      
      // Refresh the list
      fetchStartups();
      setSelectedStartups([]);
    } catch (error) {
      console.error(`❌ Error with bulk action '${action}':`, error);
      setError(`Failed to ${action} selected startups. Please try again.`);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStartupSelection = (startupId) => {
    setSelectedStartups(prev => 
      prev.includes(startupId) 
        ? prev.filter(id => id !== startupId)
        : [...prev, startupId]
    );
  };

  const selectAllVisible = () => {
    setSelectedStartups(startups.map(startup => startup.id));
  };

  const clearSelection = () => {
    setSelectedStartups([]);
  };

  const filteredStartups = startups.filter(startup =>
    startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    startup.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (startup) => {
    if (startup.is_approved) {
      return startup.is_featured ? 
        <Star className="w-5 h-5 text-yellow-500" /> : 
        <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <Clock className="w-5 h-5 text-orange-500" />;
  };

  const getStatusText = (startup) => {
    if (startup.is_approved) {
      return startup.is_featured ? 'Featured' : 'Approved';
    }
    return 'Pending';
  };

  const getStatusColor = (startup) => {
    if (startup.is_approved) {
      return startup.is_featured ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
    }
    return 'bg-orange-100 text-orange-800';
  };

  // Check if user is admin/staff
  if (!user?.is_staff && !user?.is_superuser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
          <div className="mt-4 text-sm text-gray-500 bg-gray-100 rounded-lg p-4">
            <p><strong>Debug Info:</strong></p>
            <p>User: {user?.username || user?.email || 'Not logged in'}</p>
            <p>Is Staff: {user?.is_staff ? 'Yes' : 'No'}</p>
            <p>Is Superuser: {user?.is_superuser ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-blue-600" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Manage startup submissions and approvals</p>
              <div className="mt-2 text-sm text-gray-500">
                Total startups: {startups.length} | Filter: {filter} | Selected: {selectedStartups.length}
              </div>
            </div>
            
            <button
              onClick={fetchStartups}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <details>
              <summary className="text-yellow-800 font-medium cursor-pointer">🐛 Debug Info (Dev Only)</summary>
              <div className="mt-2 text-sm text-yellow-700">
                <p><strong>API Base URL:</strong> {process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api'}</p>
                <p><strong>Auth Token:</strong> {localStorage.getItem('auth_token') ? '✅ Present' : '❌ Missing'}</p>
                <p><strong>User:</strong> {user ? `${user.username || user.email} (Staff: ${user.is_staff}, Super: ${user.is_superuser})` : '❌ Not logged in'}</p>
                <p><strong>Current Filter:</strong> {filter}</p>
                <p><strong>Startups Loaded:</strong> {startups.length}</p>
                <p><strong>Request URL:</strong> /startups/admin/?filter={filter}&search={searchTerm}</p>
              </div>
            </details>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Startups</option>
                  <option value="pending">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="featured">Featured</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search startups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedStartups.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedStartups.length} selected
                </span>
                <button
                  onClick={() => handleBulkAction('approve')}
                  disabled={actionLoading}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleBulkAction('reject')}
                  disabled={actionLoading}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  onClick={clearSelection}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Startups List */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Startup Submissions ({filteredStartups.length})
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={selectAllVisible}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Select All
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={clearSelection}
                  className="text-sm text-gray-600 hover:text-gray-700"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedStartups.length === filteredStartups.length && filteredStartups.length > 0}
                      onChange={selectedStartups.length === filteredStartups.length ? clearSelection : selectAllVisible}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Startup
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStartups.map((startup) => (
                  <tr key={startup.id} className={selectedStartups.includes(startup.id) ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedStartups.includes(startup.id)}
                        onChange={() => toggleStartupSelection(startup.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                            {startup.logo}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{startup.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {startup.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{startup.industry_name || startup.industry?.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(startup)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(startup)}`}>
                          {getStatusText(startup)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(startup.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {startup.submitted_by?.username || startup.submitted_by?.email || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {!startup.is_approved && (
                          <button
                            onClick={() => handleApprovalAction(startup.id, 'approve')}
                            disabled={actionLoading}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        
                        {startup.is_approved && !startup.is_featured && (
                          <button
                            onClick={() => handleApprovalAction(startup.id, 'feature')}
                            disabled={actionLoading}
                            className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                            title="Feature"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        )}
                        
                        {startup.is_featured && (
                          <button
                            onClick={() => handleApprovalAction(startup.id, 'unfeature')}
                            disabled={actionLoading}
                            className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                            title="Remove Featured"
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                        )}
                        
                        {startup.is_approved && (
                          <button
                            onClick={() => handleApprovalAction(startup.id, 'reject')}
                            disabled={actionLoading}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        
                        <a
                          href={`/startups/${startup.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredStartups.length === 0 && !loading && (
            <div className="text-center py-12">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No startups found</h3>
              <p className="text-gray-500">
                {startups.length === 0 
                  ? "No startups have been submitted yet." 
                  : "No startups match your current filter criteria."
                }
              </p>
              {filter === 'pending' && startups.length === 0 && (
                <p className="text-sm text-gray-400 mt-2">
                  Try switching to "All Startups" to see if any have been submitted.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
