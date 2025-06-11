// src/components/JobApplicationModal.js - Job application form modal
import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
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
      experience: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);

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
          experience: ''
        }
      });
      setErrors({});
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
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, resume: 'Please upload a PDF or Word document' }));
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, resume: 'File size must be less than 5MB' }));
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
    } else if (formData.coverLetter.length < 50) {
      newErrors.coverLetter = 'Cover letter must be at least 50 characters';
    }

    if (!formData.resume) {
      newErrors.resume = 'Resume is required';
    }

    // Validate additional info
    if (formData.additionalInfo.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.additionalInfo.phone)) {
      newErrors['additionalInfo.phone'] = 'Please enter a valid phone number';
    }

    if (formData.additionalInfo.linkedinUrl && !formData.additionalInfo.linkedinUrl.includes('linkedin.com')) {
      newErrors['additionalInfo.linkedinUrl'] = 'Please enter a valid LinkedIn URL';
    }

    if (formData.additionalInfo.portfolio && !/^https?:\/\/.+/.test(formData.additionalInfo.portfolio)) {
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
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('cover_letter', formData.coverLetter);
      if (formData.resume) {
        submitData.append('resume', formData.resume);
      }

      // Add additional info as JSON
      submitData.append('additional_info', JSON.stringify(formData.additionalInfo));

      const response = await axios.post(`http://localhost:8000/api/jobs/${job.id}/apply/`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      success('Application submitted successfully!');
      onApplicationSubmitted && onApplicationSubmitted(response.data);
      onClose();
      
    } catch (err) {
      console.error('Error submitting application:', err);
      if (err.response?.data?.error) {
        error(err.response.data.error);
      } else {
        error('Failed to submit application. Please try again.');
      }
    } finally {
      setLoading(false);
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
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Apply for {job.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  at {job.startup_name} • {job.location}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4 max-h-96 overflow-y-auto">
            <div className="space-y-6">
              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter *
                </label>
                <textarea
                  value={formData.coverLetter}
                  onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us why you're interested in this position and how your skills match the requirements..."
                />
                {errors.coverLetter && (
                  <p className="mt-1 text-sm text-red-600">{errors.coverLetter}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.coverLetter.length}/2000 characters
                </p>
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume *
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {formData.resume ? (
                    <div className="flex items-center justify-center space-x-2">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
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
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        Drag and drop your resume here, or{' '}
                        <label className="text-blue-600 cursor-pointer hover:text-blue-700">
                          browse
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileChange(e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, or DOCX up to 5MB
                      </p>
                    </div>
                  )}
                </div>
                {errors.resume && (
                  <p className="mt-1 text-sm text-red-600">{errors.resume}</p>
                )}
              </div>

              {/* Additional Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-4">Additional Information</h4>
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
                      placeholder="e.g., $80,000 - $100,000"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="text"
                      value={formData.additionalInfo.experience}
                      onChange={(e) => handleInputChange('additionalInfo.experience', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 3 years in React development"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
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
  );
};

export default JobApplicationModal;
