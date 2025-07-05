import React, { useState, useEffect } from 'react';
import { Plus, Building, MapPin, DollarSign, Clock, Users, Mail, AlertCircle, CheckCircle, X, ArrowLeft, Calendar, Upload, ExternalLink, Save } from 'lucide-react';

const StartupEditForm = ({ startupId = 1, onClose, onSuccess }) => {
  const [startup, setStartup] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    location: '',
    website: '',
    founded_year: '',
    employee_count: '',
    funding_amount: '',
    valuation: '',
    stage: 'idea',
    contact_email: '',
    pitch_deck: null,
    social_links: {
      linkedin: '',
      twitter: '',
      facebook: ''
    },
    tags: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [industries, setIndustries] = useState([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (startupId) {
      console.log('🔄 StartupEditForm mounted for startup ID:', startupId);
      fetchStartup();
      fetchIndustries();
    }
  }, [startupId]);

  const fetchStartup = async () => {
    try {
      setLoading(true);
      console.log('📡 Fetching startup details for editing...');
      
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStartupData = {
        id: parseInt(startupId),
        name: 'TechCorp Inc.',
        description: 'We are building the future of technology with innovative AI solutions that help businesses automate their processes and improve efficiency.',
        industry: 1,
        location: 'San Francisco, CA',
        website: 'https://techcorp.com',
        founded_year: 2020,
        employee_count: '11-50',
        funding_amount: '$2M',
        valuation: '$10M',
        stage: 'growth',
        contact_email: 'contact@techcorp.com',
        social_links: {
          linkedin: 'https://linkedin.com/company/techcorp',
          twitter: 'https://twitter.com/techcorp',
          facebook: ''
        },
        tags: ['AI', 'Machine Learning', 'SaaS', 'B2B'],
        can_edit: true,
        status: 'active'
      };
      
      console.log('✅ Startup data received:', mockStartupData);
      
      // Check if user can edit this startup
      if (!mockStartupData.can_edit) {
        alert('You do not have permission to edit this startup.');
        onClose && onClose();
        return;
      }
      
      setStartup(mockStartupData);
      
      // Convert startup data to form data
      setFormData({
        name: mockStartupData.name || '',
        description: mockStartupData.description || '',
        industry: mockStartupData.industry || '',
        location: mockStartupData.location || '',
        website: mockStartupData.website || '',
        founded_year: mockStartupData.founded_year || '',
        employee_count: mockStartupData.employee_count || '',
        funding_amount: mockStartupData.funding_amount || '',
        valuation: mockStartupData.valuation || '',
        stage: mockStartupData.stage || 'idea',
        contact_email: mockStartupData.contact_email || '',
        pitch_deck: null,
        social_links: mockStartupData.social_links || {
          linkedin: '',
          twitter: '',
          facebook: ''
        },
        tags: mockStartupData.tags || []
      });
      
    } catch (error) {
      console.error('❌ Error fetching startup:', error);
      alert('Failed to load startup details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchIndustries = async () => {
    try {
      console.log('📡 Fetching industries...');
      // Mock industries
      setIndustries([
        { id: 1, name: 'Technology' },
        { id: 2, name: 'Healthcare' },
        { id: 3, name: 'Fintech' },
        { id: 4, name: 'E-commerce' },
        { id: 5, name: 'Education' },
        { id: 6, name: 'Real Estate' },
        { id: 7, name: 'Food & Beverage' },
        { id: 8, name: 'Transportation' }
      ]);
    } catch (error) {
      console.error('❌ Error fetching industries:', error);
      setIndustries([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else if (name.includes('.')) {
      // Handle nested objects like social_links
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Startup name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Startup name must be at least 2 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.industry) {
      newErrors.industry = 'Please select an industry';
    }

    if (!formData.contact_email.trim()) {
      newErrors.contact_email = 'Contact email is required';
    } else if (!formData.contact_email.includes('@')) {
      newErrors.contact_email = 'Please enter a valid email address';
    }

    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    if (formData.founded_year && (formData.founded_year < 1900 || formData.founded_year > new Date().getFullYear())) {
      newErrors.founded_year = 'Please enter a valid founding year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Starting startup update...');
    console.log('📝 Form data:', formData);
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    setSaving(true);

    try {
      console.log('📤 Sending update payload...');

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('✅ Startup update successful');
      alert('Startup updated successfully!');
      onSuccess && onSuccess(formData);
      onClose && onClose();
      
    } catch (error) {
      console.error('❌ Error updating startup:', error);
      setErrors({ general: 'Failed to update startup. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Your changes will be lost.')) {
      onClose && onClose();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-300 border-t-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading startup details...</p>
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Startup Not Found</h2>
          <p className="text-gray-600 mb-4">The startup you're trying to edit could not be found.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Startups
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={onClose}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Startup Details
          </button>
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Edit Startup</h1>
            <p className="text-gray-600">Update your startup information below</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Building className="w-6 h-6 text-purple-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Startup Information</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {errors.general}
              </div>
            )}

            <div className="space-y-6">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-purple-600" />
                  Basic Information
                </h3>
                
                <div className="space-y-4 sm:space-y-6">
                  {/* Startup Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Startup Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                      placeholder="e.g. TechCorp Inc."
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                  </div>

                  {/* Industry and Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry *
                      </label>
                      <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base ${errors.industry ? 'border-red-300' : 'border-gray-300'}`}
                      >
                        <option value="">Select industry</option>
                        {industries.map(industry => (
                          <option key={industry.id} value={industry.id}>
                            {industry.name}
                          </option>
                        ))}
                      </select>
                      {errors.industry && <p className="text-red-600 text-sm mt-1">{errors.industry}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base ${errors.location ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="e.g. San Francisco, CA"
                      />
                      {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
                    </div>
                  </div>

                  {/* Contact Email and Website */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        name="contact_email"
                        value={formData.contact_email}
                        onChange={handleInputChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base ${errors.contact_email ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="contact@yourcompany.com"
                      />
                      {errors.contact_email && <p className="text-red-600 text-sm mt-1">{errors.contact_email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base ${errors.website ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="https://yourcompany.com"
                      />
                      {errors.website && <p className="text-red-600 text-sm mt-1">{errors.website}</p>}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
                      placeholder="Describe what your startup does, your mission, and what makes you unique..."
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
                      <p className="text-gray-500 text-xs sm:text-sm ml-auto">{formData.description.length}/2000 characters</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Details Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center border-t border-gray-200 pt-6">
                  <Users className="w-5 h-5 mr-2 text-purple-600" />
                  Company Details
                </h3>

                <div className="space-y-4 sm:space-y-6">
                  {/* Founded Year and Employee Count */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Founded Year
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          name="founded_year"
                          value={formData.founded_year}
                          onChange={handleInputChange}
                          min="1900"
                          max={new Date().getFullYear()}
                          className={`w-full pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base transition-all duration-200 hover:border-purple-300 ${
                            errors.founded_year ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder={new Date().getFullYear().toString()}
                        />
                      </div>
                      {errors.founded_year && <p className="text-red-600 text-sm mt-1">{errors.founded_year}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employee Count
                      </label>
                      <select
                        name="employee_count"
                        value={formData.employee_count}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                      >
                        <option value="">Select size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="500+">500+ employees</option>
                      </select>
                    </div>
                  </div>

                  {/* Stage and Funding */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Stage
                      </label>
                      <select
                        name="stage"
                        value={formData.stage}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                      >
                        <option value="idea">Idea Stage</option>
                        <option value="startup">Startup</option>
                        <option value="growth">Growth Stage</option>
                        <option value="established">Established</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Funding Amount
                      </label>
                      <input
                        type="text"
                        name="funding_amount"
                        value={formData.funding_amount}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="e.g. $1M, $10M"
                      />
                    </div>
                  </div>

                  {/* Valuation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Valuation
                    </label>
                    <input
                      type="text"
                      name="valuation"
                      value={formData.valuation}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="e.g. $10M, $100M"
                    />
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center border-t border-gray-200 pt-6">
                  <CheckCircle className="w-5 h-5 mr-2 text-purple-600" />
                  Tags & Keywords
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (Skills, Technologies, Keywords)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2 mb-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Add a tag (e.g. AI, Blockchain, React)"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap text-sm sm:text-base"
                    >
                      <Plus className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Add</span>
                    </button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-purple-100 text-purple-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="ml-1 sm:ml-2 text-purple-600 hover:text-purple-800"
                          >
                            <X className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Media & Social Links Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center border-t border-gray-200 pt-6">
                  <ExternalLink className="w-5 h-5 mr-2 text-purple-600" />
                  Media & Social Links
                </h3>

                <div className="space-y-4 sm:space-y-6">
                  {/* Pitch Deck */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pitch Deck (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                      <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-gray-400 mb-2" />
                      <input
                        type="file"
                        name="pitch_deck"
                        onChange={handleInputChange}
                        accept=".pdf,.ppt,.pptx"
                        className="hidden"
                        id="pitch-upload"
                      />
                      <label htmlFor="pitch-upload" className="cursor-pointer">
                        <span className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                          Upload new pitch deck
                        </span>
                        <p className="text-xs text-gray-500 mt-1">PDF, PPT up to 25MB</p>
                      </label>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-4">Social Media Links</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          LinkedIn
                        </label>
                        <input
                          type="url"
                          name="social_links.linkedin"
                          value={formData.social_links.linkedin}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                          placeholder="https://linkedin.com/company/yourcompany"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Twitter
                        </label>
                        <input
                          type="url"
                          name="social_links.twitter"
                          value={formData.social_links.twitter}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                          placeholder="https://twitter.com/yourcompany"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Facebook
                        </label>
                        <input
                          type="url"
                          name="social_links.facebook"
                          value={formData.social_links.facebook}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                          placeholder="https://facebook.com/yourcompany"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Notice */}
              {startup.status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="text-yellow-500 mt-1 mr-3" size={20} />
                    <div>
                      <h4 className="text-yellow-900 font-medium">Startup Under Review</h4>
                      <p className="text-yellow-700 text-sm mt-1">
                        Your startup is currently being reviewed. Changes will be reflected once approved.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Update Notice */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="text-purple-500 mt-1 mr-3 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="text-purple-900 font-medium text-sm sm:text-base">Update Information</h4>
                    <p className="text-purple-700 text-xs sm:text-sm mt-1">
                      Changes to your startup profile will be updated immediately. Make sure all information is accurate before saving.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-6 border-t border-gray-200 mt-8">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium order-2 sm:order-1 text-sm sm:text-base"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium order-1 sm:order-2 text-sm sm:text-base"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StartupEditForm;
