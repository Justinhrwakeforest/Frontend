import React, { useState, useEffect } from 'react';
import { X, Plus, Building, MapPin, DollarSign, Clock, Users, Mail, AlertCircle, CheckCircle, Sparkles, Calendar, ArrowLeft, ArrowRight, Upload, ExternalLink, Save } from 'lucide-react';

const JobUploadForm = ({ isOpen, onClose, onSuccess }) => {
  // Mock user data - replace with your auth system
  const user = {
    email: 'user@example.com',
    is_authenticated: true
  };

  // Mock API function
  const mockApi = {
    get: async (url) => {
      console.log('Mock API GET:', url);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (url.includes('/jobs/types/')) {
        return {
          data: [
            { id: 1, name: 'Full-time' },
            { id: 2, name: 'Part-time' },
            { id: 3, name: 'Contract' },
            { id: 4, name: 'Internship' },
            { id: 5, name: 'Freelance' }
          ]
        };
      }
      
      if (url.includes('/startups/')) {
        return {
          data: {
            results: [
              { id: 1, name: 'TechCorp Inc.', is_approved: true },
              { id: 2, name: 'InnovateLab', is_approved: true },
              { id: 3, name: 'DataFlow Solutions', is_approved: true },
              { id: 4, name: 'AI Dynamics', is_approved: true },
              { id: 5, name: 'CloudTech Systems', is_approved: true }
            ]
          }
        };
      }
      
      throw new Error('Endpoint not found');
    },
    
    post: async (url, data) => {
      console.log('Mock API POST:', url, data);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (url.includes('/jobs/')) {
        // Simulate successful job creation
        return {
          data: {
            id: Math.floor(Math.random() * 1000),
            ...data,
            status: 'pending',
            is_verified: false,
            posted_at: new Date().toISOString(),
            view_count: 0,
            application_count: 0
          },
          message: 'Job posted successfully!'
        };
      }
      
      throw new Error('API endpoint not implemented');
    }
  };
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startup: '',
    location: '',
    job_type: '',
    salary_range: '',
    is_remote: false,
    is_urgent: false,
    experience_level: 'mid',
    requirements: '',
    benefits: '',
    application_deadline: '',
    expires_at: '',
    company_email: '',
    skills: []
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [jobTypes, setJobTypes] = useState([]);
  const [startups, setStartups] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  // Load data when modal opens
  useEffect(() => {
    if (isOpen) {
      loadJobTypes();
      loadStartups();
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const loadJobTypes = async () => {
    try {
      console.log('📡 Loading job types...');
      const response = await mockApi.get('/jobs/types/');
      console.log('✅ Job types loaded:', response.data);
      setJobTypes(response.data || []);
    } catch (error) {
      console.error('❌ Error loading job types:', error);
      setJobTypes([
        { id: 1, name: 'Full-time' },
        { id: 2, name: 'Part-time' },
        { id: 3, name: 'Contract' },
        { id: 4, name: 'Internship' }
      ]);
    }
  };

  const loadStartups = async () => {
    try {
      console.log('📡 Loading startups...');
      const response = await mockApi.get('/startups/');
      const startupsData = response.data?.results || response.data || [];
      console.log('✅ Startups loaded:', startupsData);
      setStartups(startupsData);
    } catch (error) {
      console.error('❌ Error loading startups:', error);
      // Mock data fallback
      setStartups([
        { id: 1, name: 'TechCorp Inc.', is_approved: true },
        { id: 2, name: 'InnovateLab', is_approved: true },
        { id: 3, name: 'DataFlow Solutions', is_approved: true }
      ]);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startup: '',
      location: '',
      job_type: '',
      salary_range: '',
      is_remote: false,
      is_urgent: false,
      experience_level: 'mid',
      requirements: '',
      benefits: '',
      application_deadline: '',
      expires_at: '',
      company_email: user?.email || '',
      skills: []
    });
    setErrors({});
    setCurrentStep(1);
    setSkillInput('');
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

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.some(s => s.skill === skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, {
          skill: skillInput.trim(),
          is_required: true,
          proficiency_level: 'intermediate'
        }]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const updateSkill = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Basic Information
      if (!formData.title.trim()) {
        newErrors.title = 'Job title is required';
      } else if (formData.title.length < 5) {
        newErrors.title = 'Job title must be at least 5 characters';
      }

      if (!formData.description.trim()) {
        newErrors.description = 'Job description is required';
      } else if (formData.description.length < 50) {
        newErrors.description = 'Job description must be at least 50 characters';
      }

      if (!formData.location.trim()) {
        newErrors.location = 'Location is required';
      }

      if (!formData.job_type) {
        newErrors.job_type = 'Please select a job type';
      }

      if (!formData.company_email.trim()) {
        newErrors.company_email = 'Company email is required';
      } else if (!formData.company_email.includes('@')) {
        newErrors.company_email = 'Please enter a valid email address';
      }
    } else if (step === 2) {
      // Additional Details - most are optional but we can add validation
      if (formData.application_deadline && formData.expires_at) {
        const appDeadline = new Date(formData.application_deadline);
        const expiry = new Date(formData.expires_at);
        if (appDeadline >= expiry) {
          newErrors.application_deadline = 'Application deadline must be before job expiry date';
        }
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
      console.log('🚀 Submitting job posting...');
      console.log('📝 Form data:', formData);

      // Prepare the payload
      const payload = {
        ...formData,
        startup: formData.startup ? parseInt(formData.startup) : null,
        job_type: parseInt(formData.job_type)
      };

      console.log('📤 Sending payload:', payload);

      const response = await mockApi.post('/jobs/', payload);
      
      console.log('✅ Job posting successful:', response.data);
      
      // Show success message with approval info
      const jobData = response.data.job || response.data;
      const message = response.data.message || 'Job posted successfully!';
      
      alert(`${message}\n\nYour job posting has been submitted and will be reviewed by our admin team before being published. You'll receive a notification once it's approved.`);
      
      onSuccess && onSuccess(jobData);
      onClose();
      
    } catch (err) {
      console.error('❌ Error creating job:', err);
      
      if (err.response?.data) {
        if (typeof err.response.data === 'object' && err.response.data.error) {
          setErrors({ general: err.response.data.error });
        } else if (typeof err.response.data === 'object') {
          // Handle field-specific errors
          setErrors(err.response.data);
        } else {
          setErrors({ general: 'Failed to create job posting. Please check your information and try again.' });
        }
      } else {
        setErrors({ general: 'Failed to create job posting. Please check your internet connection and try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Job Info', icon: Building },
    { number: 2, title: 'Details', icon: Users },
    { number: 3, title: 'Review', icon: CheckCircle }
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
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 pt-4 sm:pt-6 pb-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl leading-6 font-bold">
                  Post a New Job
                </h3>
                <p className="mt-1 text-blue-100 text-sm sm:text-base">
                  Find the perfect candidate for your team
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
                          ? 'bg-white text-blue-600 border-white'
                          : isActive
                          ? 'bg-blue-500 text-white border-blue-300'
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
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900">Job Information</h4>
                  </div>

                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {errors.general}
                    </div>
                  )}

                  {/* Job Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                        errors.title ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g. Senior Software Engineer"
                    />
                    {errors.title && (
                      <div className="mt-1 flex items-center text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.title}
                      </div>
                    )}
                  </div>

                  {/* Startup and Job Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Startup
                      </label>
                      <select
                        name="startup"
                        value={formData.startup}
                        onChange={handleInputChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                          errors.startup ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select startup (optional)</option>
                        {startups.filter(s => s.is_approved !== false).map(startup => (
                          <option key={startup.id} value={startup.id}>
                            {startup.name}
                          </option>
                        ))}
                      </select>
                      {errors.startup && (
                        <div className="mt-1 flex items-center text-sm text-red-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.startup}
                        </div>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        You can post independently or select your company
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Type *
                      </label>
                      <select
                        name="job_type"
                        value={formData.job_type}
                        onChange={handleInputChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                          errors.job_type ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select job type</option>
                        {jobTypes.map(type => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                      {errors.job_type && (
                        <div className="mt-1 flex items-center text-sm text-red-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.job_type}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location and Salary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salary Range
                      </label>
                      <input
                        type="text"
                        name="salary_range"
                        value={formData.salary_range}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="e.g. $80,000 - $120,000"
                      />
                    </div>
                  </div>

                  {/* Company Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Email *
                    </label>
                    <input
                      type="email"
                      name="company_email"
                      value={formData.company_email}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                        errors.company_email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="hiring@company.com"
                    />
                    {errors.company_email && (
                      <div className="mt-1 flex items-center text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.company_email}
                      </div>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      This email will be used for verification and applicant communication
                    </p>
                  </div>

                  {/* Job Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={6}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.description && (
                        <div className="flex items-center text-sm text-red-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.description}
                        </div>
                      )}
                      <p className="text-gray-500 text-xs sm:text-sm ml-auto">{formData.description.length}/5000 characters</p>
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level
                    </label>
                    <select
                      name="experience_level"
                      value={formData.experience_level}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                      <option value="lead">Lead/Principal</option>
                    </select>
                  </div>

                  {/* Checkboxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_remote"
                        checked={formData.is_remote}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium text-purple-700">Remote work allowed</span>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_urgent"
                        checked={formData.is_urgent}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                      />
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium text-red-700">Urgent hiring</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 2: Additional Details */}
              {currentStep === 2 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900">Additional Details</h4>
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Requirements
                    </label>
                    <textarea
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="List the key requirements, qualifications, and must-have skills..."
                    />
                  </div>

                  {/* Benefits */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Benefits & Perks
                    </label>
                    <textarea
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Describe the benefits, perks, and what makes your company a great place to work..."
                    />
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Required Skills
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 mb-3">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="Add a skill (e.g. React, Python, Project Management)"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap text-sm sm:text-base"
                      >
                        <Plus className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Add</span>
                      </button>
                    </div>
                    
                    {formData.skills.length > 0 && (
                      <div className="space-y-2">
                        {formData.skills.map((skill, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <span className="flex-1 text-sm font-medium">{skill.skill}</span>
                            <select
                              value={skill.proficiency_level}
                              onChange={(e) => updateSkill(index, 'proficiency_level', e.target.value)}
                              className="px-2 py-1 text-xs border border-gray-300 rounded"
                            >
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                              <option value="expert">Expert</option>
                            </select>
                            <label className="flex items-center text-xs">
                              <input
                                type="checkbox"
                                checked={skill.is_required}
                                onChange={(e) => updateSkill(index, 'is_required', e.target.checked)}
                                className="mr-1"
                              />
                              Required
                            </label>
                            <button
                              type="button"
                              onClick={() => removeSkill(index)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Deadlines */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Application Deadline
                      </label>
                      <input
                        type="date"
                        name="application_deadline"
                        value={formData.application_deadline}
                        onChange={handleInputChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                          errors.application_deadline ? 'border-red-300' : 'border-gray-300'
                        }`}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {errors.application_deadline && (
                        <div className="mt-1 flex items-center text-sm text-red-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.application_deadline}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Expires At
                      </label>
                      <input
                        type="date"
                        name="expires_at"
                        value={formData.expires_at}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900">Review & Submit</h4>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="text-blue-500 mt-1 mr-3 flex-shrink-0" size={20} />
                      <div>
                        <h4 className="text-blue-900 font-medium text-sm sm:text-base">Job Approval Process</h4>
                        <p className="text-blue-700 text-xs sm:text-sm mt-1">
                          Your job posting will be reviewed by our admin team before being published. 
                          You'll receive a notification once it's approved and goes live.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Job Preview */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">Job Preview</h5>
                    
                    <div className="space-y-4">
                      <div>
                        <h6 className="font-medium text-gray-900 text-lg">{formData.title}</h6>
                        <p className="text-sm text-gray-600">
                          {formData.startup ? startups.find(s => s.id == formData.startup)?.name : 'Independent Job Posting'} • {formData.location}
                          {formData.is_remote && " • Remote"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {jobTypes.find(t => t.id == formData.job_type)?.name}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                          {formData.experience_level.charAt(0).toUpperCase() + formData.experience_level.slice(1)} Level
                        </span>
                        {formData.is_urgent && (
                          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            Urgent
                          </span>
                        )}
                        {formData.salary_range && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            {formData.salary_range}
                          </span>
                        )}
                      </div>

                      <div>
                        <h6 className="font-medium text-gray-900 mb-2">Description</h6>
                        <p className="text-sm text-gray-700 line-clamp-3">{formData.description}</p>
                      </div>

                      {formData.requirements && (
                        <div>
                          <h6 className="font-medium text-gray-900 mb-2">Requirements</h6>
                          <p className="text-sm text-gray-700 line-clamp-2">{formData.requirements}</p>
                        </div>
                      )}

                      {formData.benefits && (
                        <div>
                          <h6 className="font-medium text-gray-900 mb-2">Benefits</h6>
                          <p className="text-sm text-gray-700 line-clamp-2">{formData.benefits}</p>
                        </div>
                      )}

                      {formData.skills.length > 0 && (
                        <div>
                          <h6 className="font-medium text-gray-900 mb-2">Skills ({formData.skills.length})</h6>
                          <div className="flex flex-wrap gap-1">
                            {formData.skills.slice(0, 5).map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                              >
                                {skill.skill}
                              </span>
                            ))}
                            {formData.skills.length > 5 && (
                              <span className="text-xs text-gray-500 py-1">+{formData.skills.length - 5} more</span>
                            )}
                          </div>
                        </div>
                      )}

                      {(formData.application_deadline || formData.expires_at) && (
                        <div>
                          <h6 className="font-medium text-gray-900 mb-2">Important Dates</h6>
                          <div className="text-sm text-gray-600 space-y-1">
                            {formData.application_deadline && (
                              <p>Application Deadline: {new Date(formData.application_deadline).toLocaleDateString()}</p>
                            )}
                            {formData.expires_at && (
                              <p>Position Expires: {new Date(formData.expires_at).toLocaleDateString()}</p>
                            )}
                          </div>
                        </div>
                      )}
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
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base flex items-center justify-center"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-4 h-4 sm:ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Posting Job...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Post Job</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Responsive improvements */
        @media (max-width: 640px) {
          .grid-cols-1 {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
        }

        /* Ensure buttons are touch-friendly on mobile */
        @media (max-width: 768px) {
          button {
            min-height: 44px;
          }
        }

        /* Loading spinner */
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }

        /* Enhanced focus states for accessibility */
        button:focus,
        input:focus,
        textarea:focus,
        select:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* Smooth transitions */
        button,
        .transition-colors {
          transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default JobUploadForm;
