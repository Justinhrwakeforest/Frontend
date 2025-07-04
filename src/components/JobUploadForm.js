// src/components/JobUploadForm.js - Enhanced Mobile-First Responsive Design
import React, { useState, useEffect } from 'react';
import { X, Plus, Building, MapPin, DollarSign, Clock, Users, Mail, AlertCircle, CheckCircle, Sparkles, Briefcase, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNotifications } from './NotificationSystem';
import axios from 'axios';

const JobUploadForm = ({ isOpen, onClose, onSuccess }) => {
  const { success, error } = useNotifications();
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
  const [startups, setStartups] = useState([]);
  const [jobTypes, setJobTypes] = useState([]); // Initialize as empty array
  const [skillInput, setSkillInput] = useState('');

  // Fetch required data
  useEffect(() => {
    if (isOpen) {
      fetchStartups();
      fetchJobTypes();
      resetForm();
    }
  }, [isOpen]);

  const fetchStartups = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/startups/my-startups/');
      setStartups(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching startups:', error);
    }
  };

  const fetchJobTypes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/jobs/types/');
      console.log('Job types response:', response.data);
      
      // Handle different response structures
      const jobTypesData = response.data.results || response.data || [];
      setJobTypes(Array.isArray(jobTypesData) ? jobTypesData : []);
    } catch (error) {
      console.error('Error fetching job types:', error);
      setJobTypes([]); // Ensure it's always an array
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
      company_email: '',
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

      if (!formData.startup) {
        newErrors.startup = 'Please select a startup';
      }

      if (!formData.job_type) {
        newErrors.job_type = 'Please select a job type';
      }

      if (!formData.location.trim()) {
        newErrors.location = 'Location is required';
      }

      if (!formData.company_email.trim()) {
        newErrors.company_email = 'Company email is required';
      } else if (!formData.company_email.includes('@')) {
        newErrors.company_email = 'Please enter a valid email address';
      }
    } else if (step === 2) {
      // Description and Details
      if (!formData.description.trim()) {
        newErrors.description = 'Job description is required';
      } else if (formData.description.length < 50) {
        newErrors.description = 'Job description must be at least 50 characters';
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
      const response = await axios.post('http://localhost:8000/api/jobs/', formData);

      if (response.status === 201) {
        success('Job posted successfully! It will be reviewed before being published.', 'Success');
        onSuccess && onSuccess(response.data);
        onClose();
      }
    } catch (err) {
      console.error('Error creating job:', err);
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        error('Failed to create job. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: Briefcase },
    { number: 2, title: 'Description', icon: Building },
    { number: 3, title: 'Requirements', icon: CheckCircle }
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
                  Find the perfect candidate for your startup
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
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900">Basic Information</h4>
                  </div>

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
                      placeholder="e.g. Senior Frontend Developer"
                    />
                    {errors.title && (
                      <div className="mt-1 flex items-center text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.title}
                      </div>
                    )}
                  </div>

                  {/* Startup Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Startup *
                    </label>
                    <select
                      name="startup"
                      value={formData.startup}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                        errors.startup ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select your startup</option>
                      {startups.map(startup => (
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
                    {Array.isArray(jobTypes) && jobTypes.length === 0 && (
                      <p className="mt-1 text-sm text-gray-500">
                        Loading job types...
                      </p>
                    )}
                  </div>

                  {/* Job Type and Experience Level */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                        {Array.isArray(jobTypes) && jobTypes.length > 0 ? (
                          jobTypes.map(type => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>Loading job types...</option>
                        )}
                      </select>
                      {errors.job_type && (
                        <div className="mt-1 flex items-center text-sm text-red-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.job_type}
                        </div>
                      )}
                    </div>

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
                  </div>

                  {/* Location and Company Email */}
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
                        placeholder="hiring@yourcompany.com"
                      />
                      {errors.company_email && (
                        <div className="mt-1 flex items-center text-sm text-red-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.company_email}
                        </div>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        This email will be used to verify your authorization to post jobs
                      </p>
                    </div>
                  </div>

                  {/* Salary Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary Range (Optional)
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

                  {/* Work Options */}
                  <div className="space-y-4">
                    <h5 className="text-sm sm:text-base font-medium text-gray-900">Work Options</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <label className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          name="is_remote"
                          checked={formData.is_remote}
                          onChange={handleInputChange}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                          <span className="text-sm font-medium text-gray-700">Remote Work Available</span>
                        </div>
                      </label>
                      <label className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          name="is_urgent"
                          checked={formData.is_urgent}
                          onChange={handleInputChange}
                          className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-red-500" />
                          <span className="text-sm font-medium text-gray-700">Urgent Hiring</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Description */}
              {currentStep === 2 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                    <Building className="w-5 h-5 text-blue-600" />
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900">Job Description</h4>
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
                      placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
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

                  {/* Requirements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Requirements
                    </label>
                    <textarea
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="List specific requirements (one per line)&#10;• Bachelor's degree in Computer Science&#10;• 3+ years of experience with React&#10;• Strong communication skills"
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
                      placeholder="List benefits and perks (one per line)&#10;• Health, dental, and vision insurance&#10;• Flexible working hours&#10;• Stock options&#10;• Professional development budget"
                    />
                  </div>

                  {/* Deadlines */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Application Deadline
                      </label>
                      <input
                        type="datetime-local"
                        name="application_deadline"
                        value={formData.application_deadline}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Expires At
                      </label>
                      <input
                        type="datetime-local"
                        name="expires_at"
                        value={formData.expires_at}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Skills & Requirements */}
              {currentStep === 3 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900">Skills & Requirements</h4>
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
                        placeholder="Add a skill (e.g. React, Python, etc.)"
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
                          <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-900 flex-shrink-0 text-sm sm:text-base">{skill.skill}</span>
                            <select
                              value={skill.proficiency_level}
                              onChange={(e) => updateSkill(index, 'proficiency_level', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-xs sm:text-sm flex-shrink-0"
                            >
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                              <option value="expert">Expert</option>
                            </select>
                            <label className="flex items-center text-xs sm:text-sm flex-shrink-0">
                              <input
                                type="checkbox"
                                checked={skill.is_required}
                                onChange={(e) => updateSkill(index, 'is_required', e.target.checked)}
                                className="mr-1 h-3 w-3"
                              />
                              Required
                            </label>
                            <button
                              type="button"
                              onClick={() => removeSkill(index)}
                              className="ml-auto text-red-500 hover:text-red-700 p-1 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Review Information */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="text-blue-500 mt-1 mr-3 flex-shrink-0" size={20} />
                      <div>
                        <h4 className="text-blue-900 font-medium text-sm sm:text-base">Review Required</h4>
                        <p className="text-blue-700 text-xs sm:text-sm mt-1">
                          Your job posting will be reviewed by our admin team before being published. 
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
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base flex items-center justify-center"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-4 h-4 sm:ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || startups.length === 0}
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Posting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
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
    </div>
  );
};

export default JobUploadForm;
