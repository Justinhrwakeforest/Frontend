// src/components/StartupEditForm.js - Component for editing startups
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import {
  Building, Save, X, ArrowLeft, AlertCircle, CheckCircle,
  Calendar, Users, DollarSign, Briefcase, Target, TrendingUp,
  Globe, Mail, Phone, Tag, Image as ImageIcon
} from 'lucide-react';

const StartupEditForm = () => {
  const { id } = useParams();
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startup, setStartup] = useState(null);
  const [formData, setFormData] = useState({});
  const [industries, setIndustries] = useState([]);
  const [industriesLoading, setIndustriesLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (id) {
      fetchStartupData();
      fetchIndustries();
    }
  }, [id]);

  useEffect(() => {
    if (authContext?.user) {
      setIsAdmin(authContext.user.is_staff || authContext.user.is_superuser);
    }
  }, [authContext]);

  const fetchStartupData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/startups/${id}/`);
      const startupData = response.data;
      
      setStartup(startupData);
      
      // Initialize form data with current startup values
      setFormData({
        name: startupData.name || '',
        description: startupData.description || '',
        industry: startupData.industry || '',
        location: startupData.location || '',
        website: startupData.website || '',
        logo: startupData.logo || '🚀',
        funding_amount: startupData.funding_amount || '',
        valuation: startupData.valuation || '',
        employee_count: startupData.employee_count || '',
        founded_year: startupData.founded_year || new Date().getFullYear(),
        revenue: startupData.revenue || '',
        user_count: startupData.user_count || '',
        growth_rate: startupData.growth_rate || '',
        contact_email: startupData.contact_email || '',
        contact_phone: startupData.contact_phone || '',
        business_model: startupData.business_model || '',
        target_market: startupData.target_market || '',
        cover_image_url: startupData.cover_image_url || ''
      });
      
      console.log('Startup data loaded for editing:', startupData);
    } catch (error) {
      console.error('Error fetching startup data:', error);
      if (error.response?.status === 404) {
        navigate('/startups');
      } else if (error.response?.status === 403) {
        setErrors({ general: 'You do not have permission to edit this startup' });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchIndustries = async () => {
    try {
      setIndustriesLoading(true);
      const response = await api.get('/startups/industries/');
      console.log('Industries API response:', response.data);
      
      // Handle different response formats
      let industriesData = response.data;
      
      // If response.data has a results property (paginated response)
      if (industriesData && industriesData.results) {
        industriesData = industriesData.results;
      }
      
      // Ensure it's an array
      if (Array.isArray(industriesData) && industriesData.length > 0) {
        setIndustries(industriesData);
        console.log('✅ Industries loaded from API:', industriesData.length);
      } else {
        throw new Error('Invalid industries data format');
      }
    } catch (error) {
      console.error('❌ Error fetching industries, using defaults:', error);
      // Use default industries if API fails
      const defaultIndustries = [
        { id: 1, name: 'Technology', icon: '💻' },
        { id: 2, name: 'Healthcare', icon: '🏥' },
        { id: 3, name: 'Finance', icon: '💰' },
        { id: 4, name: 'E-commerce', icon: '🛒' },
        { id: 5, name: 'Education', icon: '📚' },
        { id: 6, name: 'Food & Beverage', icon: '🍕' },
        { id: 7, name: 'Travel & Tourism', icon: '✈️' },
        { id: 8, name: 'Real Estate', icon: '🏠' },
        { id: 9, name: 'Entertainment', icon: '🎬' },
        { id: 10, name: 'Transportation', icon: '🚗' },
        { id: 11, name: 'Energy', icon: '⚡' },
        { id: 12, name: 'Agriculture', icon: '🌱' },
        { id: 13, name: 'Manufacturing', icon: '🏭' },
        { id: 14, name: 'Media', icon: '📺' },
        { id: 15, name: 'Gaming', icon: '🎮' },
        { id: 16, name: 'AI/Machine Learning', icon: '🤖' },
        { id: 17, name: 'Blockchain/Crypto', icon: '⛓️' },
        { id: 18, name: 'SaaS', icon: '☁️' },
        { id: 19, name: 'Social Media', icon: '📱' },
        { id: 20, name: 'Other', icon: '🔧' }
      ];
      setIndustries(defaultIndustries);
      console.log('✅ Using default industries:', defaultIndustries.length);
    } finally {
      setIndustriesLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.name?.trim()) {
      newErrors.name = 'Company name is required';
    }
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }
    if (!formData.location?.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.employee_count) {
      newErrors.employee_count = 'Employee count is required';
    }
    if (!formData.founded_year) {
      newErrors.founded_year = 'Founded year is required';
    }

    // Length validations
    if (formData.description && formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters long';
    }
    if (formData.description && formData.description.length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
    }

    // Number validations
    if (formData.employee_count && (formData.employee_count < 1 || formData.employee_count > 100000)) {
      newErrors.employee_count = 'Employee count must be between 1 and 100,000';
    }

    const currentYear = new Date().getFullYear();
    if (formData.founded_year && (formData.founded_year < 1800 || formData.founded_year > currentYear)) {
      newErrors.founded_year = `Founded year must be between 1800 and ${currentYear}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      // Prepare the changes object - only include fields that have changed
      const changes = {};
      
      Object.keys(formData).forEach(key => {
        const originalValue = startup[key] || '';
        const newValue = formData[key] || '';
        
        if (originalValue !== newValue) {
          changes[key] = newValue;
        }
      });

      if (Object.keys(changes).length === 0) {
        setErrors({ general: 'No changes detected' });
        setSubmitting(false);
        return;
      }

      console.log('Submitting changes:', changes);

      // Submit edit request
      const response = await api.post(`/startups/${id}/submit_edit/`, {
        changes: changes
      });

      console.log('Edit response:', response.data);

      if (response.data.direct_update) {
        // Admin made direct update
        setSuccess(true);
        setTimeout(() => {
          navigate(`/startups/${id}`);
        }, 2000);
      } else {
        // Premium user - edit request submitted
        setSuccess(true);
        setTimeout(() => {
          navigate(`/startups/${id}`);
        }, 3000);
      }

    } catch (error) {
      console.error('Error submitting edit:', error);
      
      if (error.response?.status === 401) {
        setErrors({ general: 'Please log in to edit this startup' });
        navigate('/auth');
      } else if (error.response?.status === 403) {
        setErrors({ general: 'You do not have permission to edit this startup. Only premium members who submitted the startup or admins can edit.' });
      } else if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          setErrors({ general: error.response.data });
        } else if (error.response.data.error) {
          setErrors({ general: error.response.data.error });
        } else {
          setErrors(error.response.data);
        }
      } else {
        setErrors({ general: 'Failed to submit edit request. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/startups/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">Loading startup details</h3>
          <p className="text-slate-500">Please wait while we fetch the information...</p>
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Startup not found</h3>
          <p className="text-slate-600 mb-6">The startup you're trying to edit doesn't exist or you don't have permission to edit it.</p>
          <button 
            onClick={() => navigate('/startups')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Startups
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isAdmin ? 'Startup Updated Successfully!' : 'Edit Request Submitted!'}
          </h2>
          <p className="text-gray-600 mb-6">
            {isAdmin 
              ? 'Your changes have been applied to the startup immediately.'
              : 'Your edit request has been submitted for review. You\'ll be notified once it\'s approved.'
            }
          </p>
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-300 border-t-green-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Building className="w-8 h-8 mr-3 text-blue-600" />
                Edit {startup.name}
              </h1>
              <p className="text-gray-600 mt-2">
                {isAdmin 
                  ? 'As an admin, your changes will be applied immediately.'
                  : 'Your edit request will be reviewed by our team before being published.'
                }
              </p>
            </div>
            
            <button
              onClick={handleCancel}
              className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>

        {/* Debug Info - Only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <details>
              <summary className="text-yellow-800 font-medium cursor-pointer">🐛 Debug Info (Dev Only)</summary>
              <div className="mt-2 text-sm text-yellow-700">
                <p><strong>Industries Type:</strong> {typeof industries}</p>
                <p><strong>Industries Length:</strong> {Array.isArray(industries) ? industries.length : 'Not an array'}</p>
                <p><strong>Industries Loading:</strong> {industriesLoading ? 'Yes' : 'No'}</p>
                <p><strong>Industries Sample:</strong> {JSON.stringify(industries.slice(0, 2), null, 2)}</p>
                <p><strong>Form Data Industry:</strong> {formData.industry || 'Not set'}</p>
              </div>
            </details>
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
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-600" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Company Name */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your company name"
                  maxLength={100}
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo Emoji
                </label>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                    {formData.logo}
                  </div>
                  <input
                    type="text"
                    name="logo"
                    value={formData.logo}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="🚀"
                    maxLength={10}
                  />
                </div>
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry *
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.industry ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                  disabled={industriesLoading}
                >
                  <option value="">
                    {industriesLoading ? 'Loading industries...' : 'Select an industry'}
                  </option>
                  {Array.isArray(industries) && industries.map(industry => (
                    <option key={industry.id} value={industry.id}>
                      {industry.icon} {industry.name}
                    </option>
                  ))}
                </select>
                {errors.industry && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.industry}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.location ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., San Francisco, CA"
                  required
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.location}
                  </p>
                )}
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.website ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="https://your-startup.com"
                />
                {errors.website && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.website}
                  </p>
                )}
              </div>

              {/* Cover Image URL */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon className="w-4 h-4 inline mr-1" />
                  Cover Image URL
                </label>
                <input
                  type="url"
                  name="cover_image_url"
                  value={formData.cover_image_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/your-cover-image.jpg"
                />
                <p className="mt-1 text-sm text-gray-500">
                  URL to your startup's cover image. Recommended size: 1200x400px
                </p>
              </div>

              {/* Description */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description * ({formData.description?.length || 0}/2000)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describe your startup, what problem you solve, and what makes you unique..."
                  maxLength={2000}
                  required
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
              Company Details
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Employee Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Employee Count *
                </label>
                <input
                  type="number"
                  name="employee_count"
                  value={formData.employee_count}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.employee_count ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 25"
                  min="1"
                  max="100000"
                  required
                />
                {errors.employee_count && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.employee_count}
                  </p>
                )}
              </div>

              {/* Founded Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Founded Year *
                </label>
                <input
                  type="number"
                  name="founded_year"
                  value={formData.founded_year}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.founded_year ? 'border-red-300' : 'border-gray-300'
                  }`}
                  min="1800"
                  max={new Date().getFullYear()}
                  required
                />
                {errors.founded_year && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.founded_year}
                  </p>
                )}
              </div>

              {/* Funding Amount */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., $2M Seed, $10M Series A"
                />
              </div>

              {/* Valuation */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., $50M"
                />
              </div>

              {/* Revenue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Target className="w-4 h-4 inline mr-1" />
                  Annual Revenue
                </label>
                <input
                  type="text"
                  name="revenue"
                  value={formData.revenue}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., $1M ARR"
                />
              </div>

              {/* User Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  User Count
                </label>
                <input
                  type="text"
                  name="user_count"
                  value={formData.user_count}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 50K active users"
                />
              </div>

              {/* Growth Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  Growth Rate
                </label>
                <input
                  type="text"
                  name="growth_rate"
                  value={formData.growth_rate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 20% MoM"
                />
              </div>

              {/* Business Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Model
                </label>
                <select
                  name="business_model"
                  value={formData.business_model}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

              {/* Target Market */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Market
                </label>
                <input
                  type="text"
                  name="target_market"
                  value={formData.target_market}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Small businesses, Enterprise"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-600" />
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Email */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="contact@yourcompany.com"
                />
              </div>

              {/* Contact Phone */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-sm text-gray-500">
                {isAdmin 
                  ? '⚡ Your changes will be applied immediately as you are an admin.'
                  : '📝 Your edit request will be reviewed by our team before being published.'
                }
              </div>

              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      {isAdmin ? 'Updating...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isAdmin ? 'Update Startup' : 'Submit Edit Request'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StartupEditForm;
