// src/components/JobApplicationModal.js - Enhanced with better file handling and validation
import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, User, Mail, Phone, MapPin, Briefcase, AlertCircle, CheckCircle } from 'lucide-react';
import { useNotifications } from './NotificationSystem';
import axios from 'axios';

const JobApplicationModal = ({ 
  isOpen, 
  onClose, 
  job, 
  onApplicationSubmitted 
}) => {
  const { success, error } = useNotifications();
  const [formData, setFormData] = useState({
    coverLetter: '',
    resume: null,
    additionalInfo: {
      phone: '',
      portfolio: '',
      linkedinUrl: '',
      availability: '',
      salaryExpectation: '',
      experience: '',
      whyInterested: '',
      skills: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        coverLetter: '',
        resume: null,
        additionalInfo: {
          phone: '',
          portfolio: '',
          linkedinUrl: '',
          availability: '',
          salaryExpectation: '',
          experience: '',
          whyInterested: '',
          skills: ''
        }
      });
      setErrors({});
      setUploadProgress(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
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
        [field]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileChange = (file) => {
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ 
          ...prev, 
          resume: 'Please upload a PDF, Word document, or text file' 
        }));
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ 
          ...prev, 
          resume: 'File size must be less than 10MB' 
        }));
        return;
      }

      setFormData(prev => ({ ...prev, resume: file }));
      setErrors(prev => ({ ...prev, resume: '' }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
    } else if (formData.coverLetter.length < 100) {
      newErrors.coverLetter = 'Cover letter must be at least 100 characters';
    } else if (formData.coverLetter.length > 2000) {
      newErrors.coverLetter = 'Cover letter must be less than 2000 characters';
    }

    if (!formData.resume) {
      newErrors.resume = 'Resume is required';
    }

    // Validate additional info
    if (formData.additionalInfo.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.additionalInfo.phone)) {
      newErrors['additionalInfo.phone'] = 'Please enter a valid phone number';
    }

    if (formData.additionalInfo.linkedinUrl && 
        formData.additionalInfo.linkedinUrl && 
        !formData.additionalInfo.linkedinUrl.includes('linkedin.com')) {
      newErrors['additionalInfo.linkedinUrl'] = 'Please enter a valid LinkedIn URL';
    }

    if (formData.additionalInfo.portfolio && 
        formData.additionalInfo.portfolio &&
        !/^https?:\/\/.+/.test(formData.additionalInfo.portfolio)) {
      newErrors['additionalInfo.portfolio'] = 'Please enter a valid URL';
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
    setUploadProgress(0);
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('cover_letter', formData.coverLetter);
      if (formData.resume) {
        submitData.append('resume', formData.resume);
      }

      // Add additional info as JSON
      submitData.append('additional_info', JSON.stringify(formData.additionalInfo));

      const response = await axios.post(
        `http://localhost:8000/api/jobs/${job.id}/apply/`, 
        submitData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        }
      );

      success('Application submitted successfully! You will be notified about updates.');
      onApplicationSubmitted && onApplicationSubmitted(response.data);
      onClose();
      
    } catch (err) {
      console.error('Error submitting application:', err);
      if (err.response?.status === 400 && err.response?.data?.error) {
        error(err.response.data.error);
      } else if (err.response?.status === 401) {
        error('Please log in to apply for jobs.');
      } else {
        error('Failed to submit application. Please try again.');
      }
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 pt-6 pb-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl leading-6 font-bold">
                  Apply for {job.title}
                </h3>
                <p className="mt-1 text-blue-100">
                  at {job.startup_name} • {job.location}
                  {job.is_remote && <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">Remote</span>}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            <div className="max-h-96 overflow-y-auto space-y-6">
              
              {/* Job Requirements Preview */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Position Overview</h4>
                <p className="text-sm text-blue-800 mb-2">{job.description}</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills_list && job.skills_list.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter *
                </label>
                <textarea
                  value={formData.coverLetter}
                  onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Dear Hiring Manager,

I am writing to express my strong interest in the [Position Title] role at [Company Name]. With my background in [relevant experience/skills], I am excited about the opportunity to contribute to your team.

In my previous role at [Previous Company], I [specific achievement or responsibility that relates to this job]. I am particularly drawn to this position because [why you're interested in this specific role/company].

I would welcome the opportunity to discuss how my skills and experience can contribute to [Company Name]'s continued success.

Best regards,
[Your Name]"
                />
                {errors.coverLetter && (
                  <div className="mt-1 flex items-center text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.coverLetter}
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.coverLetter.length}/2000 characters • Minimum 100 characters required
                </p>
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume/CV *
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive
                      ? 'border-blue-400 bg-blue-50'
                      : errors.resume
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {formData.resume ? (
                    <div className="flex items-center justify-center space-x-3">
                      <FileText className="w-10 h-10 text-blue-600" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {formData.resume.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(formData.resume.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, resume: null }))}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-1">
                        Drag and drop your resume here, or{' '}
                        <label className="text-blue-600 cursor-pointer hover:text-blue-700 font-medium">
                          browse files
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={(e) => handleFileChange(e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, DOCX, or TXT up to 10MB
                      </p>
                    </div>
                  )}
                </div>
                {errors.resume && (
                  <div className="mt-1 flex items-center text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.resume}
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.additionalInfo.phone}
                      onChange={(e) => handleInputChange('additionalInfo.phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors['additionalInfo.phone'] && (
                      <p className="mt-1 text-xs text-red-600">{errors['additionalInfo.phone']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      <User className="w-4 h-4 inline mr-1" />
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={formData.additionalInfo.linkedinUrl}
                      onChange={(e) => handleInputChange('additionalInfo.linkedinUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://linkedin.com/in/yourname"
                    />
                    {errors['additionalInfo.linkedinUrl'] && (
                      <p className="mt-1 text-xs text-red-600">{errors['additionalInfo.linkedinUrl']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Portfolio/Website
                    </label>
                    <input
                      type="url"
                      value={formData.additionalInfo.portfolio}
                      onChange={(e) => handleInputChange('additionalInfo.portfolio', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://yourportfolio.com"
                    />
                    {errors['additionalInfo.portfolio'] && (
                      <p className="mt-1 text-xs text-red-600">{errors['additionalInfo.portfolio']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Availability
                    </label>
                    <select
                      value={formData.additionalInfo.availability}
                      onChange={(e) => handleInputChange('additionalInfo.availability', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select availability</option>
                      <option value="immediately">Immediately</option>
                      <option value="2weeks">2 weeks notice</option>
                      <option value="1month">1 month notice</option>
                      <option value="2months">2+ months</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">
                      Salary Expectation
                    </label>
                    <input
                      type="text"
                      value={formData.additionalInfo.salaryExpectation}
                      onChange={(e) => handleInputChange('additionalInfo.salaryExpectation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., $80,000 - $100,000 or Negotiable"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">
                      Relevant Experience & Skills
                    </label>
                    <textarea
                      value={formData.additionalInfo.experience}
                      onChange={(e) => handleInputChange('additionalInfo.experience', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Briefly describe your relevant experience and key skills for this role..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">
                      Why are you interested in this position?
                    </label>
                    <textarea
                      value={formData.additionalInfo.whyInterested}
                      onChange={(e) => handleInputChange('additionalInfo.whyInterested', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="What excites you about this role and company?"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Upload Progress */}
            {loading && uploadProgress > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Uploading application...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              Your application will be sent directly to the hiring team
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.coverLetter.trim() || !formData.resume}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center transition-all"
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationModal;
