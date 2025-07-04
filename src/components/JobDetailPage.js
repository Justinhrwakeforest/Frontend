// src/components/JobDetailPage.js - Enhanced Mobile-First Responsive Design
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Building, MapPin, DollarSign, Clock, Users, Globe, Star, 
  ChevronLeft, ChevronDown, ChevronUp, Briefcase, CheckCircle,
  AlertCircle, Edit, Trash2, Share2, Bookmark, Eye, Menu,
  X, ExternalLink
} from 'lucide-react';
import api from '../services/api';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    requirements: false,
    benefits: false,
    company: false,
    similarJobs: false
  });
  const [applying, setApplying] = useState(false);
  const [applicationText, setApplicationText] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await api.get(`/jobs/${id}/`);
      setJob(response.data);
      setIsBookmarked(false);
    } catch (error) {
      console.error('Error fetching job:', error);
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setApplying(true);
    try {
      const response = await api.post(`/jobs/${id}/apply/`, {
        cover_letter: applicationText
      });

      if (response.status === 201) {
        alert('Application submitted successfully!');
        setShowApplicationForm(false);
        setApplicationText('');
        fetchJobDetails();
      }
    } catch (error) {
      console.error('Error applying:', error);
      const errorMessage = error.response?.data?.error || 'Failed to submit application';
      alert(errorMessage);
    } finally {
      setApplying(false);
    }
  };

  const handleEdit = () => {
    navigate(`/jobs/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      try {
        await api.delete(`/jobs/${id}/`);
        alert('Job deleted successfully');
        navigate('/jobs');
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job. Please try again.');
      }
    }
  };

  const handleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job at ${job.startup_name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const canEditJob = () => {
    if (!user || !job) return false;
    return job.can_edit || user.is_staff || user.is_superuser;
  };

  const canDeleteJob = () => {
    if (!user || !job) return false;
    return (job.posted_by_username === user.username) || user.is_staff || user.is_superuser;
  };

  const ExpandableCard = ({ title, icon: Icon, children, section, defaultExpanded = false }) => {
    const isExpanded = expandedSections[section];
    
    return (
      <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm">
        <button
          onClick={() => toggleSection(section)}
          className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <Icon className="text-blue-600 flex-shrink-0" size={18} />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 text-left">{title}</h3>
          </div>
          {isExpanded ? <ChevronUp size={18} className="flex-shrink-0" /> : <ChevronDown size={18} className="flex-shrink-0" />}
        </button>
        
        {isExpanded && (
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100">
            {children}
          </div>
        )}
      </div>
    );
  };

  const MobileActionSheet = () => (
    <div className={`fixed inset-0 z-50 transform transition-transform duration-300 ${showMobileActions ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileActions(false)} />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 space-y-3">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Actions</h3>
          <button onClick={() => setShowMobileActions(false)}>
            <X size={24} />
          </button>
        </div>
        
        <button
          onClick={handleBookmark}
          className={`w-full p-3 rounded-lg border transition-colors flex items-center gap-3 ${
            isBookmarked 
              ? 'bg-blue-50 border-blue-200 text-blue-600' 
              : 'bg-white border-gray-300 text-gray-600'
          }`}
        >
          <Bookmark size={20} />
          <span>{isBookmarked ? 'Remove Bookmark' : 'Bookmark Job'}</span>
        </button>
        
        <button
          onClick={handleShare}
          className="w-full p-3 bg-white border border-gray-300 text-gray-600 rounded-lg flex items-center gap-3"
        >
          <Share2 size={20} />
          <span>Share Job</span>
        </button>
        
        {canEditJob() && (
          <button
            onClick={handleEdit}
            className="w-full p-3 bg-orange-100 text-orange-700 rounded-lg flex items-center gap-3"
          >
            <Edit size={20} />
            <span>Edit Job</span>
          </button>
        )}
        
        {canDeleteJob() && (
          <button
            onClick={handleDelete}
            className="w-full p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-3"
          >
            <Trash2 size={20} />
            <span>Delete Job</span>
          </button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
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
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
          <button
            onClick={() => navigate('/jobs')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft size={20} />
            <span className="text-sm sm:text-base">Back to Jobs</span>
          </button>

          <div className="flex flex-col space-y-4">
            {/* Job Info */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="text-2xl sm:text-4xl flex-shrink-0">{job.startup_detail?.logo || '🏢'}</div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 break-words">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-gray-600">
                  <div className="flex items-center gap-1">
                    <Building size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{job.startup_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{job.location}</span>
                    {job.is_remote && <span className="text-green-600">(Remote)</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>{job.posted_ago}</span>
                  </div>
                  {job.salary_range && (
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">{job.salary_range}</span>
                    </div>
                  )}
                </div>
                
                {/* Status badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium">
                    {job.job_type_name}
                  </span>
                  <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs sm:text-sm font-medium">
                    {job.experience_level_display}
                  </span>
                  {job.is_urgent && (
                    <span className="px-2 sm:px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs sm:text-sm font-medium">
                      Urgent
                    </span>
                  )}
                  {job.status === 'pending' && (
                    <span className="px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs sm:text-sm font-medium">
                      Under Review
                    </span>
                  )}
                  {job.status === 'rejected' && (
                    <span className="px-2 sm:px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs sm:text-sm font-medium">
                      Rejected
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Action buttons */}
            <div className="hidden sm:flex flex-wrap gap-3">
              <button
                onClick={handleBookmark}
                className={`p-3 rounded-lg border transition-colors ${
                  isBookmarked 
                    ? 'bg-blue-50 border-blue-200 text-blue-600' 
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Bookmark size={20} />
              </button>
              <button
                onClick={handleShare}
                className="p-3 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
              >
                <Share2 size={20} />
              </button>
              
              {canEditJob() && (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                >
                  <Edit size={16} />
                  <span className="hidden md:inline">Edit Job</span>
                </button>
              )}
              
              {canDeleteJob() && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 size={16} />
                  <span className="hidden md:inline">Delete</span>
                </button>
              )}
              
              {job.status === 'active' && !job.has_applied ? (
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Apply Now
                </button>
              ) : job.has_applied ? (
                <button
                  disabled
                  className="px-6 py-3 bg-green-100 text-green-800 rounded-lg font-medium flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  Applied
                </button>
              ) : job.status !== 'active' ? (
                <button
                  disabled
                  className="px-6 py-3 bg-gray-100 text-gray-500 rounded-lg font-medium cursor-not-allowed"
                >
                  Not Available
                </button>
              ) : null}
            </div>

            {/* Mobile Action buttons */}
            <div className="sm:hidden flex gap-3">
              <button
                onClick={() => setShowMobileActions(true)}
                className="flex-1 p-3 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <Menu size={20} />
                Actions
              </button>
              
              {job.status === 'active' && !job.has_applied ? (
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Apply Now
                </button>
              ) : job.has_applied ? (
                <button
                  disabled
                  className="flex-1 px-6 py-3 bg-green-100 text-green-800 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} />
                  Applied
                </button>
              ) : job.status !== 'active' ? (
                <button
                  disabled
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-500 rounded-lg font-medium cursor-not-allowed"
                >
                  Not Available
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Job Description */}
            <ExpandableCard
              title="Job Description"
              icon={Briefcase}
              section="description"
            >
              <div className="mt-4">
                <div 
                  className="text-gray-700 text-sm sm:text-base leading-relaxed break-words overflow-wrap-anywhere whitespace-pre-wrap"
                  style={{ 
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    hyphens: 'auto'
                  }}
                >
                  {job.description}
                </div>
              </div>
            </ExpandableCard>

            {/* Requirements */}
            {(job.requirements_list && job.requirements_list.length > 0) && (
              <ExpandableCard
                title="Requirements"
                icon={CheckCircle}
                section="requirements"
              >
                <ul className="space-y-2 mt-4">
                  {job.requirements_list.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="break-words overflow-wrap-anywhere text-sm sm:text-base">{req}</span>
                    </li>
                  ))}
                </ul>
              </ExpandableCard>
            )}

            {/* Benefits */}
            {(job.benefits_list && job.benefits_list.length > 0) && (
              <ExpandableCard
                title="Benefits & Perks"
                icon={Star}
                section="benefits"
              >
                <ul className="space-y-2 mt-4">
                  {job.benefits_list.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Star size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="break-words overflow-wrap-anywhere text-sm sm:text-base">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </ExpandableCard>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium break-words ${
                        skill.is_required 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {skill.skill}
                      {skill.proficiency_level !== 'intermediate' && (
                        <span className="ml-1 text-xs opacity-75">
                          ({skill.proficiency_level})
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Company Info */}
            <ExpandableCard
              title="About the Company"
              icon={Building}
              section="company"
            >
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-xl sm:text-2xl flex-shrink-0">{job.startup_detail?.logo || '🏢'}</div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 break-words text-sm sm:text-base">{job.startup_name}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 break-words">{job.startup_industry}</p>
                  </div>
                </div>
                
                <div className="text-gray-700 break-words overflow-wrap-anywhere text-sm sm:text-base">
                  {job.startup_detail?.description}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-500">Industry:</span>
                    <p className="font-medium break-words">{job.startup_detail?.industry_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Size:</span>
                    <p className="font-medium">{job.startup_employee_count} employees</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Founded:</span>
                    <p className="font-medium">{job.startup_detail?.founded_year}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Location:</span>
                    <p className="font-medium break-words">{job.startup_detail?.location}</p>
                  </div>
                </div>

                {job.startup_detail?.website && (
                  <a
                    href={job.startup_detail.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 break-all text-sm sm:text-base"
                  >
                    <Globe size={16} />
                    Visit Website
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </ExpandableCard>

            {/* Job Stats */}
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Job Stats</h3>
              <div className="space-y-3 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600">Views:</span>
                  <span className="font-medium">{job.view_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Applications:</span>
                  <span className="font-medium">{job.application_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted:</span>
                  <span className="font-medium">{job.posted_ago}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    job.status === 'active' ? 'text-green-600' : 
                    job.status === 'pending' ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {job.status_display}
                  </span>
                </div>
              </div>
            </div>

            {/* Similar Jobs */}
            {job.similar_jobs && job.similar_jobs.length > 0 && (
              <ExpandableCard
                title="Similar Jobs"
                icon={Briefcase}
                section="similarJobs"
              >
                <div className="mt-4 space-y-3">
                  {job.similar_jobs.map((similarJob) => (
                    <div
                      key={similarJob.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/jobs/${similarJob.id}`)}
                    >
                      <h4 className="font-medium text-gray-900 break-words text-sm sm:text-base">{similarJob.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 break-words">{similarJob.startup_name}</p>
                      <p className="text-xs sm:text-sm text-gray-500 break-words">{similarJob.location}</p>
                    </div>
                  ))}
                </div>
              </ExpandableCard>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Action Sheet */}
      <MobileActionSheet />

      {/* Application Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Apply to {job.title}</h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Write a brief cover letter explaining why you're interested in this position.
            </p>
            <textarea
              value={applicationText}
              onChange={(e) => setApplicationText(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Dear Hiring Manager,&#10;&#10;I am excited to apply for this position because..."
            />
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={() => setShowApplicationForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applying || !applicationText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2"
              >
                {applying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;
