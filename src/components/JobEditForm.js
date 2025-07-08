import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Plus, AlertCircle, CheckCircle, Clock, Building, Calendar, Mail } from 'lucide-react';

const JobEditForm = ({ jobId = 1, onClose, onSuccess }) => {
  // Mock navigation functions
  const navigate = (path) => {
    console.log('Navigate to:', path);
    if (onClose) onClose();
  };

  // Mock user data - replace with your auth system
  const user = {
    username: 'testuser',
    email: 'user@example.com',
    is_staff: false,
    is_superuser: false,
    is_authenticated: true
  };

  // Mock API function
  const mockApi = {
    get: async (url) => {
      console.log('Mock API GET:', url);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (url.includes('/jobs/')) {
        // Return mock job data
        return {
          data: {
            id: jobId,
            title: 'Senior Software Engineer',
            description: 'We are looking for a talented Senior Software Engineer to join our dynamic team. You will be responsible for designing, developing, and maintaining high-quality software solutions that drive our business forward.',
            location: 'San Francisco, CA',
            salary_range: '$120,000 - $160,000',
            is_remote: true,
            is_urgent: false,
            experience_level: 'senior',
            requirements: 'Bachelor\'s degree in Computer Science or related field\n5+ years of experience in software development\nProficiency in JavaScript, React, and Node.js\nExperience with cloud platforms (AWS, GCP, or Azure)',
            benefits: 'Health, dental, and vision insurance\nFlexible work hours\nRemote work options\n401(k) with company matching\nProfessional development budget',
            application_deadline: '2024-12-31',
            expires_at: '2025-01-15',
            company_email: 'jobs@techcorp.com',
            status: 'active',
            status_display: 'Active',
            can_edit: true,
            can_delete: true,
            startup_name: 'TechCorp Inc.',
            job_type_name: 'Full-time',
            skills: [
              { skill: 'JavaScript', is_required: true, proficiency_level: 'advanced' },
              { skill: 'React', is_required: true, proficiency_level: 'advanced' },
              { skill: 'Node.js', is_required: true, proficiency_level: 'intermediate' },
              { skill: 'AWS', is_required: false, proficiency_level: 'intermediate' }
            ],
            posted_by_username: 'testuser',
            rejection_reason: '',
            is_verified: true
          }
        };
      }
      
      throw new Error('Endpoint not found');
    },
    
    patch: async (url, data) => {
      console.log('Mock API PATCH:', url, data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (url.includes('/jobs/')) {
        // Simulate successful job update with approval workflow
        const isAdminEdit = user.is_staff || user.is_superuser;
        const requiresApproval = !isAdminEdit;
        
        return {
          data: {
            job: {
              id: jobId,
              ...data,
              status: requiresApproval ? 'pending' : 'active',
              is_active: !requiresApproval,
              updated_at: new Date().toISOString(),
              approved_by: isAdminEdit ? user.username : null,
              approved_at: isAdminEdit ? new Date().toISOString() : null
            },
            message: requiresApproval 
              ? 'Job updated successfully and submitted for re-approval. Your changes will be reviewed by our admin team.'
              : 'Job updated successfully!',
            requires_approval: requiresApproval,
            new_status: requiresApproval ? 'pending' : 'active'
          }
        };
      }
      
      throw new Error('API endpoint not implemented');
    },

    delete: async (url) => {
      console.log('Mock API DELETE:', url);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { data: { message: 'Job deleted successfully' } };
    }
  };
  
  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary_range: '',
    is_remote: false,
    is_urgent: false,
    experience_level: 'mid',
    requirements: '',
    benefits: '',
    application_deadline: '',
    expires_at: '',
    skills: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [skillInput, setSkillInput] = useState('');
  const [showApprovalInfo, setShowApprovalInfo] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      console.log('📡 Fetching job details for editing...');
      
      const response = await mockApi.get(`/jobs/${jobId}/`);
      const jobData = response.data;
      
      console.log('✅ Job data received:', jobData);
      
      // Check if user can edit this job
      if (!jobData.can_edit) {
        alert('You do not have permission to edit this job.');
        navigate(`/jobs/${jobId}`);
        return;
      }
      
      setJob(jobData);
      
      // Convert job data to form data
      setFormData({
        title: jobData.title || '',
        description: jobData.description || '',
        location: jobData.location || '',
        salary_range: jobData.salary_range || '',
        is_remote: jobData.is_remote || false,
        is_urgent: jobData.is_urgent || false,
        experience_level: jobData.experience_level || 'mid',
        requirements: jobData.requirements || '',
        benefits: jobData.benefits || '',
        application_deadline: jobData.application_deadline ? jobData.application_deadline.split('T')[0] : '',
        expires_at: jobData.expires_at ? jobData.expires_at.split('T')[0] : '',
        skills: jobData.skills || []
      });
      
      // Show approval info if this is an active job being edited by non-admin
      if (jobData.status === 'active' && !user.is_staff && !user.is_superuser) {
        setShowApprovalInfo(true);
      }
      
    } catch (error) {
      console.error('❌ Error fetching job:', error);
      if (error.response?.status === 404) {
        alert('Job not found.');
        navigate('/jobs');
      } else if (error.response?.status === 403) {
        alert('You do not have permission to edit this job.');
        navigate(`/jobs/${jobId}`);
      } else {
        alert('Failed to load job details. Please try again.');
        navigate('/jobs');
      }
    } finally {
      setLoading(false);
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

  const validateForm = () => {
    const newErrors = {};

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

    if (formData.application_deadline && formData.expires_at) {
      const appDeadline = new Date(formData.application_deadline);
      const expiry = new Date(formData.expires_at);
      if (appDeadline >= expiry) {
        newErrors.application_deadline = 'Application deadline must be before job expiry date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Starting job update...');
    console.log('📝 Form data:', formData);
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    setSaving(true);

    try {
      console.log('📤 Sending update payload...');

      const response = await mockApi.patch(`/jobs/${jobId}/`, formData);
      
      console.log('✅ Job update successful:', response.data);
      
      const updatedJob = response.data.job || response.data;
      
      // Show appropriate message based on approval status
      if (response.data.requires_approval) {
        alert(`✅ ${response.data.message}\n\n📋 What happens next:\n• Your changes are now in the admin review queue\n• The job status has been changed to "Pending Review"\n• You'll be notified once the changes are approved\n• The job will be republished after approval`);
      } else {
        alert(`✅ ${response.data.message}`);
      }
      
      if (onSuccess) {
        onSuccess(updatedJob);
      } else {
        navigate(`/jobs/${jobId}`);
      }
      
    } catch (error) {
      console.error('❌ Error updating job:', error);
      
      if (error.response?.data) {
        if (typeof error.response.data === 'object') {
          setErrors(error.response.data);
        } else {
          setErrors({ general: error.response.data.error || 'Failed to update job' });
        }
      } else {
        setErrors({ general: 'Failed to update job. Please try again.' });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Your changes will be lost.')) {
      navigate(`/jobs/${jobId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">The job you're trying to edit could not be found.</p>
          <button
            onClick={() => navigate('/jobs')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Jobs
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
            onClick={() => navigate(`/jobs/${jobId}`)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Job Details
          </button>
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Edit Job Posting</h1>
            <p className="text-gray-600">Update your job posting details below</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Building className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Job Information</h2>
              {job.status && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  job.status === 'active' ? 'bg-green-100 text-green-800' :
                  job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  job.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {job.status_display || job.status}
                </span>
              )}
              {job.is_verified && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <CheckCircle size={12} className="inline mr-1" />
                  Email Verified
                </span>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {errors.general}
              </div>
            )}

            {/* Approval Information Notice */}
            {showApprovalInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="text-blue-500 mt-1 mr-3 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="text-blue-900 font-medium text-sm sm:text-base">Edit Approval Required</h4>
                    <p className="text-blue-700 text-xs sm:text-sm mt-1">
                      Since this is an active job posting, any changes you make will require admin approval. 
                      Your job will be temporarily moved to "Pending Review" status until the changes are approved.
                    </p>
                    <div className="mt-2 text-xs text-blue-600">
                      ✓ Changes submitted for review • ✓ Admin notification sent • ✓ Job republished after approval
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-blue-600" />
                  Basic Information
                </h3>
                
                <div className="space-y-4 sm:space-y-6">
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
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${errors.title ? 'border-red-300' : 'border-gray-300'}`}
                      placeholder="e.g. Senior Software Engineer"
                    />
                    {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
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
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${errors.location ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="e.g. San Francisco, CA"
                      />
                      {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
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

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={6}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
                      placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
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
                      <span className="text-sm font-medium text-purple-700">Remote work allowed</span>
                    </label>

                    <label className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_urgent"
                        checked={formData.is_urgent}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="text-sm font-medium text-red-700">Urgent hiring</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Requirements and Benefits Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center border-t border-gray-200 pt-6">
                  <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                  Requirements & Benefits
                </h3>

                <div className="space-y-4 sm:space-y-6">
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
                        <p className="text-red-600 text-sm mt-1">{errors.application_deadline}</p>
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
              </div>

              {/* Status Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-blue-600" />
                  Current Status
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Job Status</h4>
                    <div className="flex items-center gap-2">
                      {job.status === 'active' && <CheckCircle size={16} className="text-green-500" />}
                      {job.status === 'pending' && <Clock size={16} className="text-yellow-500" />}
                      {job.status === 'rejected' && <AlertCircle size={16} className="text-red-500" />}
                      <span className="text-sm font-medium">{job.status_display}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {job.status === 'active' && 'Your job is live and accepting applications'}
                      {job.status === 'pending' && 'Your job is being reviewed by our admin team'}
                      {job.status === 'rejected' && 'Your job was rejected and needs updates'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Email Verification</h4>
                    <div className="flex items-center gap-2">
                      {job.is_verified ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : (
                        <AlertCircle size={16} className="text-orange-500" />
                      )}
                      <span className="text-sm font-medium">
                        {job.is_verified ? 'Verified' : 'Pending Verification'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {job.is_verified 
                        ? 'Your company email has been verified' 
                        : 'Email verification is required for approval'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Notices */}
              {job.status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Clock className="text-yellow-500 mt-1 mr-3" size={20} />
                    <div>
                      <h4 className="text-yellow-900 font-medium">Job Under Review</h4>
                      <p className="text-yellow-700 text-sm mt-1">
                        Your job is currently being reviewed. Changes will be reflected once approved.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {job.status === 'rejected' && job.rejection_reason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="text-red-500 mt-1 mr-3 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="text-red-900 font-medium">Job Rejected</h4>
                      <p className="text-red-700 text-sm mt-1">{job.rejection_reason}</p>
                      <p className="text-red-600 text-xs mt-2">Make the necessary changes and save to resubmit for review.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Final Edit Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="text-blue-500 mt-1 mr-3 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="text-blue-900 font-medium text-sm sm:text-base">Save Changes</h4>
                    <p className="text-blue-700 text-xs sm:text-sm mt-1">
                      {job.status === 'active' && !user.is_staff && !user.is_superuser ? 
                        'Editing an active job will require re-approval. Your job will be temporarily hidden while under review.' :
                        'Changes to your job posting will be submitted for review. Make sure all information is accurate before saving.'
                      }
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
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium order-1 sm:order-2 text-sm sm:text-base"
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

export default JobEditForm;
