// src/components/ClaimStartupButton.js - FIXED VERSION
import React, { useState } from 'react';
import { Shield, Building, Mail, User, MessageSquare, X, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

const ClaimStartupButton = ({ startup, userClaimRequest, onClaimUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    position: '',
    reason: ''
  });

  console.log('🔍 ClaimStartupButton props:', { startup, userClaimRequest });

  // Don't show claim button if startup is already claimed and verified
  if (startup.is_claimed && startup.claim_verified) {
    return (
      <div className="flex items-center text-green-600 text-sm font-medium">
        <CheckCircle className="w-4 h-4 mr-1" />
        Claimed by {startup.claimed_by_username}
      </div>
    );
  }

  // Show status if user has already submitted a claim
  if (userClaimRequest) {
    const getStatusColor = (status) => {
      switch (status) {
        case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200';
        case 'approved': return 'text-green-600 bg-green-50 border-green-200';
        case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
        case 'expired': return 'text-gray-600 bg-gray-50 border-gray-200';
        default: return 'text-gray-600 bg-gray-50 border-gray-200';
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case 'pending': return userClaimRequest.email_verified ? 'Pending Admin Review' : 'Email Verification Required';
        case 'approved': return 'Claim Approved';
        case 'rejected': return 'Claim Rejected';
        case 'expired': return 'Verification Expired';
        default: return status;
      }
    };

    return (
      <div className={`inline-flex items-center px-3 py-2 rounded-lg border text-sm font-medium ${getStatusColor(userClaimRequest.status)}`}>
        <Shield className="w-4 h-4 mr-2" />
        {getStatusText(userClaimRequest.status)}
      </div>
    );
  }

  // Don't show if user can't claim
  if (!startup.can_claim) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Work email is required';
    } else if (!formData.email.includes('@')) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.position.trim()) {
      errors.position = 'Position is required';
    } else if (formData.position.length < 2) {
      errors.position = 'Position must be at least 2 characters';
    }
    
    if (!formData.reason.trim()) {
      errors.reason = 'Reason is required';
    } else if (formData.reason.length < 10) {
      errors.reason = 'Please provide a more detailed reason (at least 10 characters)';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Submitting claim request with data:', formData);
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      console.log('❌ Validation errors:', validationErrors);
      setError(validationErrors);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      console.log('📤 Making API request to:', `/startups/${startup.id}/claim/`);
      const response = await api.post(`/startups/${startup.id}/claim/`, formData);
      
      console.log('✅ Claim request submitted successfully:', response.data);
      
      setSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
        if (onClaimUpdate) {
          onClaimUpdate(response.data);
        }
        // Reset form
        setFormData({ email: '', position: '', reason: '' });
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error submitting claim request:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      if (error.response?.data) {
        // Handle specific validation errors from backend
        if (typeof error.response.data === 'object' && !error.response.data.message) {
          setError(error.response.data);
        } else {
          setError({ general: error.response.data.message || error.response.data.error || 'Failed to submit claim request. Please try again.' });
        }
      } else {
        setError({ general: 'Failed to submit claim request. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setShowModal(false);
      setError(null);
      setSuccess(false);
      setFormData({ email: '', position: '', reason: '' });
    }
  };

  const getCompanyDomain = () => {
    if (startup.website) {
      try {
        const url = new URL(startup.website.startsWith('http') ? startup.website : `https://${startup.website}`);
        return url.hostname.replace('www.', '');
      } catch {
        return startup.website.replace(/^https?:\/\//, '').replace('www.', '').split('/')[0];
      }
    }
    return null;
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center px-4 py-2 border border-blue-300 text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 hover:border-blue-400 transition-all duration-200 font-medium"
      >
        <Shield className="w-4 h-4 mr-2" />
        Claim This Company
      </button>

      {/* Claim Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {success ? (
              // Success State
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Claim Request Submitted!</h3>
                <p className="text-gray-600 mb-4">
                  Please check your email to verify your company email address.
                </p>
                <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
                  <p><strong>Next steps:</strong></p>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Check your email for verification link</li>
                    <li>Click the verification link</li>
                    <li>Wait for admin approval</li>
                  </ol>
                </div>
              </div>
            ) : (
              // Form State
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Claim {startup.name}</h3>
                      <p className="text-sm text-gray-600">Verify company ownership</p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={submitting}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* General Error */}
                  {error?.general && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-700 text-sm">{error.general}</span>
                      </div>
                    </div>
                  )}

                  {/* Domain Info */}
                  {getCompanyDomain() && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Email Domain Verification</h4>
                      <p className="text-sm text-blue-700">
                        Please use a company email address ending with <strong>@{getCompanyDomain()}</strong> to verify your employment.
                      </p>
                    </div>
                  )}

                  {/* Work Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Work Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        error?.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={getCompanyDomain() ? `your.name@${getCompanyDomain()}` : 'your.work.email@company.com'}
                      required
                    />
                    {error?.email && (
                      <p className="mt-1 text-sm text-red-600">{error.email}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Use your official company email address for verification
                    </p>
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Your Position *
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        error?.position ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., CEO, Marketing Manager, Software Engineer"
                      required
                    />
                    {error?.position && (
                      <p className="mt-1 text-sm text-red-600">{error.position}</p>
                    )}
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-1" />
                      Reason for Claiming *
                    </label>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                        error?.reason ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Please explain why you're claiming this company profile and your role in the organization..."
                      required
                    />
                    {error?.reason && (
                      <p className="mt-1 text-sm text-red-600">{error.reason}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      {formData.reason.length}/500 characters
                    </p>
                  </div>

                  {/* Verification Process Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Verification Process</h4>
                    <ol className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-start">
                        <span className="inline-block w-4 h-4 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">1</span>
                        Email verification sent to your work email
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-4 h-4 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">2</span>
                        Admin reviews your claim request
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-4 h-4 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">3</span>
                        Gain editing permissions once approved
                      </li>
                    </ol>
                  </div>

                  {/* Submit Button */}
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={submitting}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Submit Claim
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ClaimStartupButton;
