import React, { useState, useEffect } from 'react';
import { X, Plus, Building, MapPin, DollarSign, Clock, Users, Mail, AlertCircle, CheckCircle, Sparkles, Calendar, ArrowLeft, ArrowRight, Upload, ExternalLink, Save } from 'lucide-react';
import api from '../services/api'; // Use your real API service

const JobUploadForm = ({ isOpen, onClose, onSuccess }) => {
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
  const [debugInfo, setDebugInfo] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load data when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('🔄 Modal opened, loading data...');
      
      // Always set fallback data first to ensure dropdown works
      const fallbackJobTypes = [
        { id: 1, name: 'Full-time' },
        { id: 2, name: 'Part-time' },
        { id: 3, name: 'Contract' },
        { id: 4, name: 'Internship' },
        { id: 5, name: 'Freelance' }
      ];
      
      setJobTypes(fallbackJobTypes);
      setStartups([]);
      setDataLoaded(true); // Allow form to show immediately
      
      // Then try to load from API
      loadJobTypes();
      loadStartups();
      resetForm();
    }
  }, [isOpen]);

  const loadJobTypes = async () => {
    try {
      console.log('📡 Loading job types from API...');
      setDebugInfo('Loading job types from API...');
      
      const response = await api.get('/jobs/types/');
      console.log('✅ Job types API response:', response);
      console.log('✅ Job types data:', response.data);
      
      // Check if response has data
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setJobTypes(response.data);
        setDebugInfo(`✅ Loaded ${response.data.length} job types from API`);
        console.log('✅ Job types set successfully:', response.data);
      } else {
        console.warn('⚠️ API returned empty or invalid job types, using fallback');
        throw new Error('API returned empty or invalid data');
      }
    } catch (error) {
      console.error('❌ Error loading job types from API:', error);
      console.log('🔄 Using fallback job types...');
      
      // Always use fallback job types if API fails
      const fallbackJobTypes = [
        { id: 1, name: 'Full-time' },
        { id: 2, name: 'Part-time' },
        { id: 3, name: 'Contract' },
        { id: 4, name: 'Internship' },
        { id: 5, name: 'Freelance' }
      ];
      
      setJobTypes(fallbackJobTypes);
      setDebugInfo(`❌ API Error: ${error.message} | Using ${fallbackJobTypes.length} fallback job types`);
      console.log('✅ Fallback job types set:', fallbackJobTypes);
    }
  };

  const loadStartups = async () => {
    try {
      console.log('📡 Loading startups...');
      const response = await api.get('/startups/');
      const startupsData = response.data?.results || response.data || [];
      console.log('✅ Startups loaded:', startupsData);
      
      // Ensure we have an array
      const startupsArray = Array.isArray(startupsData) ? startupsData : [];
      setStartups(startupsArray);
      setDebugInfo(prev => prev + ` | Startups loaded: ${startupsArray.length} startups`);
    } catch (error) {
      console.error('❌ Error loading startups:', error);
      setDebugInfo(prev => prev + ` | Error loading startups: ${error.message}`);
      
      // Fallback to empty array - user can post without startup
      setStartups([]);
    } finally {
      setDataLoaded(true);
    }
  };

  const resetForm = () => {
    // Get user email from context or localStorage if available
    const userEmail = localStorage.getItem('userEmail') || '';
    
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
      company_email: userEmail,
      skills: []
    });
    setErrors({});
    setCurrentStep(1);
    setSkillInput('');
    setDebugInfo('');
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
      if (!formData.title || !formData.title.trim()) {
        newErrors.title = 'Job title is required';
      } else if (formData.title.trim().length < 5) {
        newErrors.title = 'Job title must be at least 5 characters';
      } else if (formData.title.length > 100) {
        newErrors.title = 'Job title must be less than 100 characters';
      }

      if (!formData.description || !formData.description.trim()) {
        newErrors.description = 'Job description is required';
      } else if (formData.description.trim().length < 50) {
        newErrors.description = 'Job description must be at least 50 characters';
      } else if (formData.description.length > 5000) {
        newErrors.description = 'Job description must be less than 5000 characters';
      }

      if (!formData.location || !formData.location.trim()) {
        newErrors.location = 'Location is required';
      } else if (formData.location.trim().length < 2) {
        newErrors.location = 'Location must be at least 2 characters';
      }

      if (!formData.job_type) {
        newErrors.job_type = 'Please select a job type';
      }

      if (!formData.company_email || !formData.company_email.trim()) {
        newErrors.company_email = 'Company email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.company_email.trim())) {
        newErrors.company_email = 'Please enter a valid email address';
      }
    } else if (step === 2) {
      // Additional Details - validate dates
      if (formData.application_deadline && formData.expires_at) {
        const appDeadline = new Date(formData.application_deadline);
        const expiry = new Date(formData.expires_at);
        if (appDeadline >= expiry) {
          newErrors.application_deadline = 'Application deadline must be before job expiry date';
        }
      }
    } else if (step === 3) {
      // Final validation before submission
      if (!formData.title || !formData.title.trim()) {
        newErrors.title = 'Job title is required';
      }
      if (!formData.description || !formData.description.trim()) {
        newErrors.description = 'Job description is required';
      }
      if (!formData.location || !formData.location.trim()) {
        newErrors.location = 'Location is required';
      }
      if (!formData.job_type) {
        newErrors.job_type = 'Job type is required';
      }
      if (!formData.company_email || !formData.company_email.trim()) {
        newErrors.company_email = 'Company email is required';
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
    e.stopPropagation();
    
    console.log('🚀 Form submit triggered!');
    console.log('📝 Current step:', currentStep);
    console.log('📝 Form data:', formData);
    
    if (currentStep !== 3) {
      console.log('❌ Not on final step, cannot submit');
      return;
    }
    
    if (!validateStep(currentStep)) {
      console.log('❌ Form validation failed');
      return;
    }

    setLoading(true);
    setDebugInfo('🚀 Starting job submission...');

    try {
      console.log('🚀 Submitting job posting to REAL API...');
      
      // Validate required fields before sending
      console.log('🔍 Validating payload...');
      if (!formData.title || formData.title.trim().length < 5) {
        throw new Error('Job title is required and must be at least 5 characters');
      }
      if (!formData.description || formData.description.trim().length < 50) {
        throw new Error('Job description is required and must be at least 50 characters');
      }
      if (!formData.location || formData.location.trim().length < 2) {
        throw new Error('Location is required');
      }
      if (!formData.job_type) {
        throw new Error('Job type is required');
      }
      if (!formData.company_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.company_email)) {
        throw new Error('Valid company email is required');
      }

      // Prepare the payload for your Django backend
      const payload = {
        title: formData.title.trim().substring(0, 100), // Limit title length
        description: formData.description.trim().substring(0, 5000), // Limit description length
        startup: formData.startup && !isNaN(parseInt(formData.startup)) ? parseInt(formData.startup) : null,
        location: formData.location.trim().substring(0, 100),
        job_type: parseInt(formData.job_type),
        salary_range: formData.salary_range ? formData.salary_range.trim().substring(0, 50) : '',
        is_remote: Boolean(formData.is_remote),
        is_urgent: Boolean(formData.is_urgent),
        experience_level: formData.experience_level || 'mid',
        requirements: formData.requirements ? formData.requirements.trim().substring(0, 2000) : '',
        benefits: formData.benefits ? formData.benefits.trim().substring(0, 2000) : '',
        application_deadline: formData.application_deadline || null,
        expires_at: formData.expires_at || null,
        company_email: formData.company_email.trim().toLowerCase(),
        skills: Array.isArray(formData.skills) ? formData.skills.slice(0, 20) : [] // Limit skills
      };

      // Additional validation
      if (isNaN(payload.job_type)) {
        throw new Error('Invalid job type selected');
      }

      console.log('📤 Final payload validation passed');
      console.log('📤 Sending sanitized payload to /jobs/:', payload);
      setDebugInfo(`📤 Sending to API: ${JSON.stringify(payload, null, 2)}`);

      // Make the actual API call to your Django backend
      const response = await api.post('/jobs/', payload);
      
      console.log('✅ Job posting successful!');
      console.log('📊 Response status:', response.status);
      console.log('📊 Response data:', response.data);
      
      setDebugInfo(`✅ Success! Job created with ID: ${response.data.id}, Status: ${response.data.status}`);
      
      // Check the response structure
      const jobData = response.data;
      
      // Show detailed success message
      const successMessage = `
✅ Job Posted Successfully!

🆔 Job ID: ${jobData.id}
📝 Title: "${formData.title}"
📊 Status: ${jobData.status || 'pending'} 
✉️ Email: ${formData.company_email}
📧 Verified: ${jobData.is_verified ? 'Yes' : 'Pending'}

📋 Next Steps:
• Your job is now in the admin review queue
• Check the Job Administration panel at /job-admin
• You'll be notified once it's approved
• Approved jobs appear in the main job listings

🔗 Admin Panel: ${window.location.origin}/job-admin
      `.trim();
      
      alert(successMessage);
      
      // Log for debugging
      console.log('🎯 Job should now appear in admin panel');
      console.log('🔍 Check these details:');
      console.log('   - Job ID:', jobData.id);
      console.log('   - Status:', jobData.status);
      console.log('   - Is Active:', jobData.is_active);
      console.log('   - Is Verified:', jobData.is_verified);
      
      // Call success callback
      if (onSuccess) {
        onSuccess(jobData);
      }
      
      // Close modal
      onClose();
      
    } catch (err) {
      console.error('❌ Error creating job:', err);
      console.error('❌ Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        stack: err.stack
      });
      
      setDebugInfo(`❌ ERROR: ${err.message} | Status: ${err.response?.status} | Data: ${JSON.stringify(err.response?.data)}`);
      
      let errorMessage = 'Failed to create job posting.';
      
      if (err.response?.data) {
        if (typeof err.response.data === 'object' && err.response.data.error) {
          errorMessage = err.response.data.error;
          setErrors({ general: err.response.data.error });
        } else if (typeof err.response.data === 'object') {
          // Handle field-specific errors from Django
          setErrors(err.response.data);
          errorMessage = 'Please check the form for errors.';
        } else {
          errorMessage = 'Server error occurred.';
          setErrors({ general: 'Failed to create job posting. Please check your information and try again.' });
        }
      } else if (err.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection.';
        setErrors({ general: 'Network error. Please check your internet connection and try again.' });
      } else {
        errorMessage = err.message;
        setErrors({ general: 'Failed to create job posting. Please check your internet connection and try again.' });
      }
      
      // Show error alert
      alert(`❌ Submission Failed!\n\n${errorMessage}\n\nCheck the console for more details.`);
      
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
                  Submit your job for admin review and approval
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

            {/* Debug Info */}
            {debugInfo && (
              <div className="mt-2 p-2 bg-white/10 rounded text-xs font-mono text-white/80 max-h-20 overflow-y-auto">
                {debugInfo}
              </div>
            )}
          </div>

          {/* Form Content */}
          {!dataLoaded ? (
            <div className="px-4 sm:px-6 py-8 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-300 border-t-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading form data...</p>
                <p className="text-sm text-gray-500 mt-1">{debugInfo}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-4 sm:py-6">
            <div className="max-h-[60vh] sm:max-h-[500px] overflow-y-auto">
              
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900">Job Information</h4>
                  </div>

                  {/* Form Errors Display */}
                  {Object.keys(errors).length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <h4 className="text-red-900 font-medium text-sm mb-2">Please fix the following errors:</h4>
                      <ul className="text-red-700 text-sm space-y-1">
                        {Object.entries(errors).map(([field, message]) => (
                          <li key={field} className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span><strong>{field}:</strong> {message}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                      <AlertCircle className="w-4 h-4 inline mr-2" />
                      {errors.general}
                    </div>
                  )}

                  {/* API Test Section */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <h4 className="text-yellow-900 font-medium text-sm mb-2">API Connection Test</h4>
                    <div className="flex gap-2 mb-2">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            console.log('🧪 Testing job types API...');
                            const response = await api.get('/jobs/types/');
                            console.log('API Response:', response);
                            alert(`✅ API Test Success!\n\nStatus: ${response.status}\nData: ${JSON.stringify(response.data, null, 2)}`);
                          } catch (error) {
                            console.error('API Test Failed:', error);
                            alert(`❌ API Test Failed!\n\nError: ${error.message}\nStatus: ${error.response?.status}\nData: ${JSON.stringify(error.response?.data, null, 2)}`);
                          }
                        }}
                        className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-xs hover:bg-yellow-200"
                      >
                        Test Job Types API
                      </button>
                    <button
                      type="button"
                      onClick={() => {
                        console.log('🔄 Clearing all errors and resetting form...');
                        setErrors({});
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
                        setCurrentStep(1);
                        alert('Form reset! All errors cleared.');
                      }}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200"
                    >
                      Reset Form
                    </button>
                    </div>
                    <p className="text-xs text-yellow-700">
                      If the dropdown is empty, use these buttons to test the API connection.
                    </p>
                  </div>

                  {/* Debug Information */}
                  {debugInfo && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                      <h4 className="text-gray-900 font-medium text-sm mb-1">Debug Info:</h4>
                      <p className="text-xs font-mono text-gray-700">{debugInfo}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Job Types Available: {Array.isArray(jobTypes) ? jobTypes.length : 'Not loaded'} | 
                        Startups Available: {Array.isArray(startups) ? startups.length : 'Not loaded'}
                      </p>
                    </div>
                  )}

                  {/* Real API Notice */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <CheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" size={20} />
                      <div>
                        <h4 className="text-green-900 font-medium text-sm sm:text-base">Connected to Real API</h4>
                        <p className="text-green-700 text-xs sm:text-sm mt-1">
                          This form is now connected to your Django backend. Jobs will be submitted to the admin panel for review.
                        </p>
                      </div>
                    </div>
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
                        {Array.isArray(startups) && startups.filter(s => s.is_approved !== false).map(startup => (
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
                      <p className="mt-1 text-xs text-gray-500">
                        Available options: {Array.isArray(jobTypes) ? jobTypes.length : 0} job types
                      </p>
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
                      This email will be verified by admins and used for applicant communication
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

                  {/* Submission Test Section */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <h4 className="text-red-900 font-medium text-sm mb-2">Submission Test</h4>
                    <div className="flex gap-2 mb-2">
                      <button
                        type="button"
                        onClick={async () => {
                          console.log('🧪 Testing job submission with clean data...');
                          
                          const testPayload = {
                            title: 'Software Engineer Position',
                            description: 'We are looking for a skilled software engineer to join our team. This is a great opportunity to work on exciting projects and grow your career. You will be responsible for developing web applications, working with databases, and collaborating with cross-functional teams.',
                            location: 'San Francisco, CA',
                            job_type: 1,
                            company_email: 'hiring@testcompany.com',
                            experience_level: 'mid',
                            is_remote: false,
                            is_urgent: false,
                            salary_range: '$80,000 - $120,000',
                            requirements: 'Bachelor degree in Computer Science, 3+ years experience',
                            benefits: 'Health insurance, 401k, flexible hours',
                            skills: [
                              { skill: 'JavaScript', is_required: true, proficiency_level: 'intermediate' },
                              { skill: 'React', is_required: true, proficiency_level: 'advanced' }
                            ]
                          };
                          
                          try {
                            console.log('📤 Sending clean test payload:', testPayload);
                            const response = await api.post('/jobs/', testPayload);
                            console.log('✅ Test submission successful:', response.data);
                            alert(`✅ Test Submission Success!\n\nJob ID: ${response.data.id}\nStatus: ${response.data.status}\nTitle: ${response.data.title}\n\nCheck the admin panel!`);
                          } catch (error) {
                            console.error('❌ Test submission failed:', error);
                            console.error('❌ Error response:', error.response?.data);
                            alert(`❌ Test Submission Failed!\n\nError: ${error.message}\nStatus: ${error.response?.status}\nResponse: ${JSON.stringify(error.response?.data, null, 2)}`);
                          }
                        }}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200"
                      >
                        Test Submit Job
                      </button>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          console.log('🔍 Current form state:');
                          console.log('Form Data:', formData);
                          console.log('Errors:', errors);
                          console.log('Loading:', loading);
                          console.log('Current Step:', currentStep);
                          console.log('Data Loaded:', dataLoaded);
                          console.log('Job Types:', jobTypes);
                          
                          // Validate current step
                          const isValid = validateStep(currentStep);
                          console.log('Current step valid:', isValid);
                          
                          alert(`Form State Debug:
                          
Step: ${currentStep}/3
Loading: ${loading}
Valid: ${isValid}

Form Data:
• Title: "${formData.title}" (${formData.title.length} chars)
• Description: ${formData.description.length} chars
• Location: "${formData.location}"
• Job Type: ${formData.job_type} (${jobTypes.find(t => t.id.toString() === formData.job_type.toString())?.name || 'Invalid'})
• Email: "${formData.company_email}"

Errors: ${Object.keys(errors).length}
${Object.entries(errors).map(([k,v]) => `• ${k}: ${v}`).join('\n')}

Check console for full details.`);
                        }}
                        className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-xs hover:bg-gray-200"
                      >
                        Debug Form State
                      </button>
                    </div>
                    <p className="text-xs text-red-700">
                      Use these buttons to test submission and debug form state.
                    </p>
                  </div>

                  {/* API Connection Status */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <CheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" size={20} />
                      <div>
                        <h4 className="text-green-900 font-medium text-sm sm:text-base">Ready to Submit to Admin Panel</h4>
                        <p className="text-green-700 text-xs sm:text-sm mt-1">
                          Your job will be sent directly to the Job Administration panel where admins can review and approve it.
                          Once approved, it will appear in the main job listings.
                        </p>
                        <div className="mt-2 text-xs text-green-600">
                          ✓ Real API connection • ✓ Admin panel integration • ✓ Email verification workflow
                        </div>
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
                          {formData.startup && Array.isArray(startups) ? startups.find(s => s.id == formData.startup)?.name || 'Independent Job Posting' : 'Independent Job Posting'} • {formData.location}
                          {formData.is_remote && " • Remote"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {Array.isArray(jobTypes) && jobTypes.find(t => t.id == formData.job_type)?.name || 'Job Type'}
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
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          Will be Pending Review
                        </span>
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

                      {/* Contact Information */}
                      <div>
                        <h6 className="font-medium text-gray-900 mb-2">Contact Information</h6>
                        <div className="text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <Mail size={14} />
                            {formData.company_email}
                            <span className="text-xs text-orange-600">(Will be verified by admin)</span>
                          </p>
                        </div>
                      </div>

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

                  {/* Submission Information */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h6 className="font-medium text-blue-900 mb-3">What happens after submission:</h6>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <span>Job is submitted with status "pending"</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <span>Appears in Admin Panel (/job-admin) for review</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <span>Admin verifies email and approves/rejects</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <span>If approved, job becomes visible to job seekers</span>
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
                    onClick={(e) => {
                      console.log('🖱️ Submit button clicked!');
                      handleSubmit(e);
                    }}
                    disabled={loading}
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Submitting to Admin Panel...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Submit for Admin Review</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
          )}
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
