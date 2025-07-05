import React, { useState, useEffect } from 'react';
import { X, Plus, Building, MapPin, DollarSign, Clock, Users, Mail, AlertCircle, CheckCircle, Sparkles, Calendar, ArrowLeft, ArrowRight, Upload, ExternalLink } from 'lucide-react';

const StartupUploadForm = ({ isOpen, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
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

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [industries, setIndustries] = useState([]);
  const [tagInput, setTagInput] = useState('');

  // Mock industries data
  useEffect(() => {
    if (isOpen) {
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
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
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
    setErrors({});
    setCurrentStep(1);
    setTagInput('');
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

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Basic Information
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

      if (!formData.industry) {
        newErrors.industry = 'Please select an industry';
      }

      if (!formData.location.trim()) {
        newErrors.location = 'Location is required';
      }

      if (!formData.contact_email.trim()) {
        newErrors.contact_email = 'Contact email is required';
      } else if (!formData.contact_email.includes('@')) {
        newErrors.contact_email = 'Please enter a valid email address';
      }
    } else if (step === 2) {
      // Company Details
      if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
        newErrors.website = 'Please enter a valid website URL';
      }

      if (formData.founded_year && (formData.founded_year < 1900 || formData.founded_year > new Date().getFullYear())) {
        newErrors.founded_year = 'Please enter a valid founding year';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onSuccess && onSuccess(formData);
      onClose();
    } catch (err) {
      console.error('Error creating startup:', err);
      setErrors({ general: 'Failed to create startup. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: Building },
    { number: 2, title: 'Details', icon: Users },
    { number: 3, title: 'Media & Links', icon: ExternalLink }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-4xl">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 sm:px-6 pt-4 sm:pt-6 pb-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl leading-6 font-bold">
                  Register Your Startup
                </h3>
                <p className="mt-1 text-purple-100 text-sm sm:text-base">
                  Join our ecosystem and connect with talent
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/20"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="mt-4 sm:mt-6">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = currentStep === step.number;
                  const isCompleted = currentStep > step.number;
                  
                  return (
                    <div key={step.number} className="flex items-center flex-1">
                      <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-colors ${
                        isCompleted
                          ? 'bg-white text-purple-600 border-white'
                          : isActive
                          ? 'bg-purple-500 text-white border-purple-300'
                          : 'bg-transparent text-white/60 border-white/30'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <StepIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </div>
                      <div className="ml-2 hidden sm:block">
                        <div className={`text-xs sm:text-sm font-medium ${
                          isCompleted || isActive ? 'text-white' : 'text-white/60'
                        }`}>
                          {step.title}
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 sm:mx-4 ${
                          isCompleted ? 'bg-white' : 'bg-white/30'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-4 sm:py-6">
            <div className="max-h-[60vh] sm:max-h-[500px] overflow-y-auto">
              
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900">Basic Information</h4>
                  </div>

                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {errors.general}
                    </div>
                  )}

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
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g. TechCorp Inc."
                    />
                    {errors.name && (
                      <div className="mt-1 flex items-center text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </div>
                    )}
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
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base ${
                          errors.industry ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select industry</option>
                        {industries.map(industry => (
                          <option key={industry.id} value={industry.id}>
                            {industry.name}
                          </option>
                        ))}
                      </select>
                      {errors.industry && (
                        <div className="mt-1 flex items-center text-sm text-red-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.industry}
                        </div>
                      )}
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
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base ${
                          errors.location ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="e.g. San Francisco, CA"
                      />
                      {errors.location && (
                        <div className="mt-1 flex items-center text-sm text-red-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.location}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      name="contact_email"
                      value={formData.contact_email}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base ${
                        errors.contact_email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="contact@yourcompany.com"
                    />
                    {errors.contact_email && (
                      <div className="mt-1 flex items-center text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.contact_email}
                      </div>
                    )}
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
                      rows={4}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Describe what your startup does, your mission, and what makes you unique..."
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.description && (
                        <div className="flex items-center text-sm text-red-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.description}
                        </div>
                      )}
                      <p className="text-gray-500 text-xs sm:text-sm ml-auto">{formData.description.length}/2000 characters</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Company Details */}
              {currentStep === 2 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                    <Users className="w-5 h-5 text-purple-600" />
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900">Company Details</h4>
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
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base ${
                        errors.website ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="https://yourcompany.com"
                    />
                    {errors.website && (
                      <div className="mt-1 flex items-center text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.website}
                      </div>
                    )}
                  </div>

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
                      {errors.founded_year && (
                        <div className="mt-1 flex items-center text-sm text-red-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.founded_year}
                        </div>
                      )}
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

                  {/* Tags */}
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
              )}

              {/* Step 3: Media & Links */}
              {currentStep === 3 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                    <ExternalLink className="w-5 h-5 text-purple-600" />
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900">Media & Social Links</h4>
                  </div>

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
                          Upload pitch deck
                        </span>
                        <p className="text-xs text-gray-500 mt-1">PDF, PPT up to 25MB</p>
                      </label>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h5 className="text-sm sm:text-base font-medium text-gray-900 mb-4">Social Media Links</h5>
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

                  {/* Review Information */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="text-purple-500 mt-1 mr-3 flex-shrink-0" size={20} />
                      <div>
                        <h4 className="text-purple-900 font-medium text-sm sm:text-base">Review Required</h4>
                        <p className="text-purple-700 text-xs sm:text-sm mt-1">
                          Your startup registration will be reviewed by our team before being published. 
                          You'll receive a notification once it's approved.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 sm:pt-6 border-t border-gray-200 mt-4 sm:mt-6">
              <button
                type="button"
                onClick={currentStep === 1 ? onClose : prevStep}
                className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium order-2 sm:order-1 text-sm sm:text-base"
                disabled={loading}
              >
                {currentStep === 1 ? (
                  <>
                    <X className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Cancel</span>
                  </>
                ) : (
                  <>
                    <ArrowLeft className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Previous</span>
                  </>
                )}
              </button>

              <div className="flex gap-3 order-1 sm:order-2">
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm sm:text-base flex items-center justify-center"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-4 h-4 sm:ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Registering...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Register Startup</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StartupUploadForm;
