import React, { useState, useEffect } from 'react';
import { Plus, Building, MapPin, DollarSign, Clock, Users, Mail, AlertCircle, CheckCircle, X } from 'lucide-react';

const JobUploadForm = ({ onClose, onSuccess }) => {
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
  const [emailVerificationStatus, setEmailVerificationStatus] = useState(null);
  const [startups, setStartups] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    fetchStartups();
    fetchJobTypes();
  }, []);

  const fetchStartups = async () => {
    try {
      const response = await fetch('/api/startups/', {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStartups(data.results || data);
      }
    } catch (error) {
      console.error('Error fetching startups:', error);
    }
  };

  const fetchJobTypes = async () => {
    try {
      const response = await fetch('/api/jobs/types/');
      if (response.ok) {
        const data = await response.json();
        setJobTypes(data);
      }
    } catch (error) {
      console.error('Error fetching job types:', error);
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

    // Email verification
    if (name === 'company_email' && value) {
      verifyEmailDomain(value);
    }
  };

  const verifyEmailDomain = (email) => {
    if (!email.includes('@') || !formData.startup) {
      setEmailVerificationStatus(null);
      return;
    }

    const selectedStartup = startups.find(s => s.id.toString() === formData.startup);
    if (!selectedStartup) {
      setEmailVerificationStatus(null);
      return;
    }

    const emailDomain = email.split('@')[1].toLowerCase();
    const companyName = selectedStartup.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    let isVerified = false;
    
    // Check if website domain matches email domain
    if (selectedStartup.website) {
      const websiteDomain = selectedStartup.website
        .replace(/https?:\/\//, '')
        .replace(/^www\./, '')
        .split('/')[0]
        .toLowerCase();
      
      if (emailDomain === websiteDomain || emailDomain.includes(websiteDomain)) {
        isVerified = true;
      }
    }

    // Check if email domain contains company name
    if (!isVerified && emailDomain.includes(companyName)) {
      isVerified = true;
    }

    setEmailVerificationStatus(isVerified ? 'verified' : 'unverified');
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

    if (!formData.startup) {
      newErrors.startup = 'Please select a company';
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

    if (emailVerificationStatus === 'unverified') {
      newErrors.company_email = 'Email domain does not match the selected company. Please use a company email address.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/jobs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess && onSuccess(data);
        onClose && onClose();
      } else {
        setErrors(data);
      }
    } catch (error) {
      console.error('Error creating job:', error);
      setErrors({ general: 'Failed to create job. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Post a Job</h2>
            <p className="text-gray-600 mt-1">Fill out the details below to post your job opportunity</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
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
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.title ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="e.g. Senior Frontend Developer"
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Company Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company *
            </label>
            <select
              name="startup"
              value={formData.startup}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.startup ? 'border-red-300' : 'border-gray-300'}`}
            >
              <option value="">Select a company</option>
              {startups.map(startup => (
                <option key={startup.id} value={startup.id}>
                  {startup.logo} {startup.name}
                </option>
              ))}
            </select>
            {errors.startup && <p className="text-red-600 text-sm mt-1">{errors.startup}</p>}
          </div>

          {/* Company Email with Verification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                name="company_email"
                value={formData.company_email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${errors.company_email ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="your.email@company.com"
              />
              {emailVerificationStatus && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {emailVerificationStatus === 'verified' ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <AlertCircle className="text-red-500" size={20} />
                  )}
                </div>
              )}
            </div>
            {emailVerificationStatus === 'verified' && (
              <p className="text-green-600 text-sm mt-1">✓ Email domain verified with company</p>
            )}
            {emailVerificationStatus === 'unverified' && (
              <p className="text-red-600 text-sm mt-1">⚠ Email domain does not match company. Please use a company email.</p>
            )}
            {errors.company_email && <p className="text-red-600 text-sm mt-1">{errors.company_email}</p>}
          </div>

          {/* Job Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type *
              </label>
              <select
                name="job_type"
                value={formData.job_type}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.job_type ? 'border-red-300' : 'border-gray-300'}`}
              >
                <option value="">Select job type</option>
                {jobTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.job_type && <p className="text-red-600 text-sm mt-1">{errors.job_type}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                name="experience_level"
                value={formData.experience_level}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="lead">Lead/Principal</option>
              </select>
            </div>
          </div>

          {/* Location and Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.location ? 'border-red-300' : 'border-gray-300'}`}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. $80,000 - $120,000"
              />
            </div>
          </div>

          {/* Work Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Work Options</h3>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_remote"
                  checked={formData.is_remote}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Remote Work Available</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_urgent"
                  checked={formData.is_urgent}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Urgent Hiring</span>
              </label>
            </div>
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
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
              <p className="text-gray-500 text-sm ml-auto">{formData.description.length}/5000 characters</p>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Required Skills
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a skill (e.g. React, Python, etc.)"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            
            {formData.skills.length > 0 && (
              <div className="space-y-2">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{skill.skill}</span>
                    <select
                      value={skill.proficiency_level}
                      onChange={(e) => updateSkill(index, 'proficiency_level', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                    <label className="flex items-center text-sm">
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
                      className="ml-auto text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="List benefits and perks (one per line)&#10;• Health, dental, and vision insurance&#10;• Flexible working hours&#10;• Stock options&#10;• Professional development budget"
            />
          </div>

          {/* Deadlines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Deadline
              </label>
              <input
                type="datetime-local"
                name="application_deadline"
                value={formData.application_deadline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Approval Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="text-blue-500 mt-1 mr-3" size={20} />
              <div>
                <h4 className="text-blue-900 font-medium">Approval Required</h4>
                <p className="text-blue-700 text-sm mt-1">
                  Your job posting will be reviewed by our admin team before being published. 
                  You'll receive an email notification once it's approved or if any changes are needed.
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || emailVerificationStatus === 'unverified'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Posting Job...
                </>
              ) : (
                <>
                  <Building size={16} />
                  Post Job
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobUploadForm;
