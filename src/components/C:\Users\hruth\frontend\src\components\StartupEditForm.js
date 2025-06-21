import React, { useState, useEffect } from 'react';
import {
  Building, Save, X, AlertCircle, CheckCircle, Edit,
  Globe, Mail, Phone, Users, DollarSign, TrendingUp,
  Calendar, MapPin, Briefcase, Tag, Lock
} from 'lucide-react';

const StartupEditForm = ({ 
  startupId, 
  user, 
  onNavigate, 
  apiBaseUrl = 'http://127.0.0.1:8000/api' 
}) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [startup, setStartup] = useState(null);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // API helper function
  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Token ${token}` }),
      ...options.headers
    };

    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  };

  useEffect(() => {
    if (startupId) {
      fetchStartup();
    }
  }, [startupId]);

  useEffect(() => {
    // Check if user is admin
    if (user) {
      setIsAdmin(user.is_staff || user.is_superuser);
    }
  }, [user]);

  useEffect(() => {
    // Check if there are any changes
    const changed = Object.keys(formData).some(
      key => formData[key] !== originalData[key]
    );
    setHasChanges(changed);
  }, [formData, originalData]);

  const fetchStartup = async () => {
    try {
      const startupData = await apiCall(`/startups/${startupId}/`);
      
      setStartup(startupData);
      setCanEdit(startupData.can_edit);
      
      // Initialize form data with current values
      const initialData = {
        name: startupData.name || '',
        description: startupData.description || '',
        location: startupData.location || '',
        website: startupData.website || '',
        funding_amount: startupData.funding_amount || '',
        valuation: startupData.valuation || '',
        employee_count: startupData.employee_count || '',
        revenue: startupData.revenue || '',
        user_count: startupData.user_count || '',
        growth_rate: startupData.growth_rate || '',
        contact_email: startupData.contact_email || '',
        contact_phone: startupData.contact_phone || '',
        business_model: startupData.business_model || '',
        target_market: startupData.target_market || ''
      };
      
      setFormData(initialData);
      setOriginalData(initialData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching startup:', error);
      setErrors({ general: 'Failed to load startup details' });
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Company name is required';
    }
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    if (formData.description && formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }
    if (!formData.location?.trim()) {
      newErrors.location = 'Location is required';
    }
    if (formData.employee_count && formData.employee_count < 1) {
      newErrors.employee_count = 'Employee count must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!hasChanges) {
      setMessage({ type: 'info', text: 'No changes to save' });
      return;
    }
    
    setSaving(true);
    setErrors({});
    
    try {
      // Prepare only the changed fields
      const changes = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== originalData[key]) {
          changes[key] = formData[key];
        }
      });
      
      const response = await apiCall(`/startups/${startupId}/submit_edit/`, {
        method: 'POST',
        body: JSON.stringify({ changes })
      });
      
      if (response.direct_update) {
        // Admin direct update
        setMessage({
          type: 'success',
          text: 'Startup updated successfully!'
        });
        
        // Update original data to reflect saved changes
        setOriginalData({ ...formData });
        
        // Redirect after a short delay
        setTimeout(() => {
          if (onNavigate) {
            onNavigate(`/startups/${startupId}`);
          }
        }, 2000);
      } else {
        // Premium member edit request
        setMessage({
          type: 'success',
          text: 'Edit request submitted successfully! Your changes will be reviewed by an admin.'
        });
        
        // Redirect after a longer delay
        setTimeout(() => {
          if (onNavigate) {
            onNavigate(`/startups/${startupId}`);
          }
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      
      if (error.error) {
        setErrors({ general: error.error });
      } else if (error.detail) {
        setErrors({ general: error.detail });
      } else {
        setErrors({ general: 'Failed to save changes. Please try again.' });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        if (onNavigate) {
          onNavigate(`/startups/${startupId}`);
        }
      }
    } else {
      if (onNavigate) {
        onNavigate(`/startups/${startupId}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading startup details...</p>
        </div>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to edit this startup. Only premium members who submitted the startup or admins can edit.
          </p>
          <button
            onClick={() => onNavigate && onNavigate(`/startups/${startupId}`)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Edit className="w-6 h-6 mr-2 text-blue-600" />
                Edit Startup: {startup?.name}
              </h1>
              <p className="text-gray-600 mt-1">
                {isAdmin ? 
                  'As an admin, your changes will be applied immediately.' :
                  'Your changes will be submitted for admin review.'}
              </p>
            </div>
            
            {!isAdmin && startup?.has_pending_edits && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
                <p className="text-sm text-yellow-800">
                  This startup has pending edit requests
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success' ? 'bg-green-50 border border-green-200' :
            message.type === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-blue-50 border border-blue-200'
          }`}>
            {message.type === 'success' ? 
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" /> :
              <AlertCircle className={`w-5 h-5 mr-2 ${
                message.type === 'error' ? 'text-red-600' : 'text-blue-600'
              }`} />
            }
            <span className={
              message.type === 'success' ? 'text-green-800' :
              message.type === 'error' ? 'text-red-800' :
              'text-blue-800'
            }>
              {message.text}
            </span>
          </div>
        )}

        {/* Error Messages */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{errors.general}</span>
            </div>
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-600" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.location ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://your-startup.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description * ({formData.description.length}/2000)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  maxLength={2000}
                  required
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
              Company Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Employee Count
                </label>
                <input
                  type="number"
                  name="employee_count"
                  value={formData.employee_count}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.employee_count ? 'border-red-300' : 'border-gray-300'
                  }`}
                  min="1"
                />
                {errors.employee_count && (
                  <p className="mt-1 text-sm text-red-600">{errors.employee_count}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Funding Amount
                </label>
                <input
                  type="text"
                  name="funding_amount"
                  value={formData.funding_amount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., $2M Seed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  Valuation
                </label>
                <input
                  type="text"
                  name="valuation"
                  value={formData.valuation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., $50M"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revenue
                </label>
                <input
                  type="text"
                  name="revenue"
                  value={formData.revenue}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., $1M ARR"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Count
                </label>
                <input
                  type="text"
                  name="user_count"
                  value={formData.user_count}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 50K active users"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Growth Rate
                </label>
                <input
                  type="text"
                  name="growth_rate"
                  value={formData.growth_rate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 20% MoM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Model
                </label>
                <select
                  name="business_model"
                  value={formData.business_model}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select business model</option>
                  <option value="saas">SaaS</option>
                  <option value="marketplace">Marketplace</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="subscription">Subscription</option>
                  <option value="freemium">Freemium</option>
                  <option value="advertising">Advertising</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Market
                </label>
                <input
                  type="text"
                  name="target_market"
                  value={formData.target_market}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Small businesses"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="contact@yourcompany.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {hasChanges ? (
                  <span className="text-orange-600 font-medium">
                    You have unsaved changes
                  </span>
                ) : (
                  <span>No changes made</span>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || !hasChanges}
                  className={`flex items-center px-6 py-2 rounded-lg font-medium ${
                    saving || !hasChanges
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isAdmin ? 'Save Changes' : 'Submit for Review'}
                    </>
                  )}
                </button>
              </div>
            </div>

            {!isAdmin && (
              <div className="mt-4 text-sm text-gray-500 bg-blue-50 rounded-lg p-4">
                <p className="font-medium mb-1">📝 Note for Premium Members:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Your changes will be submitted as an edit request</li>
                  <li>• An admin will review and approve your changes</li>
                  <li>• You'll be notified once your changes are approved</li>
                  <li>• You can only have one pending edit request at a time</li>
                </ul>
              </div>
            )}
          </div>
        </form>

        {/* Pending Edit Requests (if any) */}
        {startup?.pending_edit_requests && startup.pending_edit_requests.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Pending Edit Requests
            </h3>
            <div className="space-y-3">
              {startup.pending_edit_requests.map((request) => (
                <div key={request.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      By {request.requested_by_username}
                    </span>
                    <span className="text-sm text-gray-500">
                      {request.time_ago}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {request.changes_display.length} field(s) changed
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupEditForm;
