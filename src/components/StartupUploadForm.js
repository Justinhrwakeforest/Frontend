// src/components/StartupUploadForm.js - Fixed with proper API calls
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api'; // Use the api service instead of axios directly
import {
  Building, Upload, X, Plus, Trash2, Save, Eye, EyeOff,
  Calendar, Users, DollarSign, Briefcase,
  Target, TrendingUp, Star, Award, AlertCircle, CheckCircle,
  Image as ImageIcon, Tag
} from 'lucide-react';

const StartupUploadForm = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [industries, setIndustries] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    location: '',
    website: '',
    logo: '🚀',
    funding_amount: '',
    valuation: '',
    employee_count: '',
    founded_year: new Date().getFullYear(),
    revenue: '',
    user_count: '',
    growth_rate: '',
    cover_image_url: '',
    is_featured: false
  });

  // Dynamic arrays for founders and tags
  const [founders, setFounders] = useState([
    { name: '', title: 'Founder', bio: '' }
  ]);
  const [tags, setTags] = useState(['']);

  // Load industries on component mount
  useEffect(() => {
    fetchIndustries();
  }, []);

  // Safety check for AuthContext - do this after all hooks are declared
  if (!authContext) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const { user } = authContext;

  const fetchIndustries = async () => {
    try {
      const response = await api.get('/startups/industries/');
      setIndustries(response.data);
    } catch (error) {
      console.error('Error fetching industries:', error);
      setErrors({ general: 'Failed to load industries. Please refresh the page.' });
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

  const handleFounderChange = (index, field, value) => {
    setFounders(prev => prev.map((founder, i) => 
      i === index ? { ...founder, [field]: value } : founder
    ));
  };

  const addFounder = () => {
    if (founders.length < 5) {
      setFounders(prev => [...prev, { name: '', title: 'Co-Founder', bio: '' }]);
    }
  };

  const removeFounder = (index) => {
    if (founders.length > 1) {
      setFounders(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleTagChange = (index, value) => {
    setTags(prev => prev.map((tag, i) => i === index ? value : tag));
  };

  const addTag = () => {
    if (tags.length < 10 && tags[tags.length - 1].trim() !== '') {
      setTags(prev => [...prev, '']);
    }
  };

  const removeTag = (index) => {
    if (tags.length > 1) {
      setTags(prev => prev.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Company name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.industry) newErrors.industry = 'Industry is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.employee_count) newErrors.employee_count = 'Employee count is required';
    if (!formData.founded_year) newErrors.founded_year = 'Founded year is required';

    // Validation rules
    if (formData.name.length > 100) newErrors.name = 'Company name too long (max 100 characters)';
    if (formData.description.length < 50) newErrors.description = 'Description too short (min 50 characters)';
    if (formData.description.length > 2000) newErrors.description = 'Description too long (max 2000 characters)';
    
    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }
    
    if (formData.employee_count && (formData.employee_count < 1 || formData.employee_count > 100000)) {
      newErrors.employee_count = 'Employee count must be between 1 and 100,000';
    }

    const currentYear = new Date().getFullYear();
    if (formData.founded_year && (formData.founded_year < 1800 || formData.founded_year > currentYear)) {
      newErrors.founded_year = `Founded year must be between 1800 and ${currentYear}`;
    }

    // Founder validation
    const validFounders = founders.filter(f => f.name.trim());
    if (validFounders.length === 0) {
      newErrors.founders = 'At least one founder is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string.startsWith('http') ? string : `https://${string}`);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Prepare submission data
      const submissionData = {
        ...formData,
        employee_count: parseInt(formData.employee_count),
        founded_year: parseInt(formData.founded_year),
        founders: founders.filter(f => f.name.trim()),
        tags: tags.filter(t => t.trim())
      };

      // Remove empty fields to avoid validation errors
      Object.keys(submissionData).forEach(key => {
        if (submissionData[key] === '' && !['name', 'description', 'location'].includes(key)) {
          delete submissionData[key];
        }
      });

      console.log('Submitting data:', submissionData); // Debug log

      const response = await api.post('/startups/', submissionData);
      
      console.log('Response:', response.data); // Debug log
      
      setSuccess(true);
      
      // Clear any saved draft
      localStorage.removeItem('startup_draft');
      
      // Redirect to the new startup page after a short delay
      setTimeout(() => {
        navigate(`/startups/${response.data.id}`);
      }, 2000);

    } catch (error) {
      console.error('Error submitting startup:', error);
      
      if (error.response?.status === 401) {
        setErrors({ general: 'Authentication required. Please log in and try again.' });
      } else if (error.response?.data) {
        // Handle validation errors from the backend
        const backendErrors = error.response.data;
        setErrors(backendErrors);
      } else if (error.response?.status >= 500) {
        setErrors({ general: 'Server error. Please try again later.' });
      } else {
        setErrors({ general: 'Failed to submit startup. Please check your connection and try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    // Save to localStorage as draft
    const draftData = {
      formData,
      founders,
      tags,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('startup_draft', JSON.stringify(draftData));
    alert('Draft saved successfully!');
  };

  const loadDraft = () => {
    const draft = localStorage.getItem('startup_draft');
    if (draft) {
      const draftData = JSON.parse(draft);
      setFormData(draftData.formData);
      setFounders(draftData.founders);
      setTags(draftData.tags);
      alert('Draft loaded successfully!');
    }
  };

  // Check if draft exists
  const hasDraft = localStorage.getItem('startup_draft');

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Startup Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your startup has been submitted for review. You'll be redirected to the startup page shortly.
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
                Submit Your Startup
              </h1>
              <p className="text-gray-600 mt-2">
                Share your startup with the community and connect with potential customers, investors, and talent.
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {hasDraft && (
                <button
                  onClick={loadDraft}
                  className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Load Draft
                </button>
              )}
              
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  previewMode 
                    ? 'bg-gray-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {previewMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {previewMode ? 'Edit Mode' : 'Preview'}
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min(100, (
                  (formData.name ? 1 : 0) +
                  (formData.description ? 1 : 0) +
                  (formData.industry ? 1 : 0) +
                  (formData.location ? 1 : 0) +
                  (formData.employee_count ? 1 : 0) +
                  (formData.founded_year ? 1 : 0)
                ) / 6 * 100)}%` 
              }}
            />
          </div>
        </div>

        {/* Error Messages */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{errors.general}</span>
            </div>
          </div>
        )}

        {/* Main Form */}
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
                >
                  <option value="">Select an industry</option>
                  {industries.map(industry => (
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

              {/* Description */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description * ({formData.description.length}/2000)
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
              <div className="lg:col-span-2">
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

              {/* Cover Image URL */}
              <div>
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
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Founders */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Founders & Team
              </h2>
              <button
                type="button"
                onClick={addFounder}
                disabled={founders.length >= 5}
                className="flex items-center px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Founder
              </button>
            </div>

            {errors.founders && (
              <p className="mb-4 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.founders}
              </p>
            )}

            <div className="space-y-6">
              {founders.map((founder, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 relative">
                  {founders.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFounder(index)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={founder.name}
                        onChange={(e) => handleFounderChange(index, 'name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={founder.title}
                        onChange={(e) => handleFounderChange(index, 'title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., CEO, CTO"
                      />
                    </div>
                    
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={founder.bio}
                        onChange={(e) => handleFounderChange(index, 'bio', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Brief bio and background..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-blue-600" />
                Tags & Keywords
              </h2>
              <button
                type="button"
                onClick={addTag}
                disabled={tags.length >= 10 || tags[tags.length - 1].trim() === ''}
                className="flex items-center px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Tag
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Add relevant tags to help people discover your startup (e.g., technologies, market focus, etc.)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., React, AI, SaaS"
                    maxLength={30}
                  />
                  {tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Featured Checkbox */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Award className="w-5 h-5 mr-2 text-blue-600" />
              Additional Options
            </h2>

            <div className="space-y-4">
              <label className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium text-gray-900">Request Featured Status</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Request to have your startup highlighted as featured (subject to review)
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/startups')}
                  className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Startup
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
              <p className="mb-2 font-medium">📝 Before submitting:</p>
              <ul className="space-y-1 text-xs">
                <li>• Ensure all required fields are completed</li>
                <li>• Double-check your company information for accuracy</li>
                <li>• Your startup will be reviewed before being published</li>
                <li>• You'll receive a notification once your startup is approved</li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StartupUploadForm;
