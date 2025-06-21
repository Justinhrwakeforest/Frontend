import React, { useState, useEffect } from 'react';
import { 
  Building, MapPin, DollarSign, Clock, Users, Globe, Star, 
  ChevronLeft, ChevronDown, ChevronUp, Briefcase, CheckCircle,
  AlertCircle, Edit, Trash2, Share2, Bookmark
} from 'lucide-react';

const JobDetailPage = ({ jobId, onBack, onEdit }) => {
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

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/`, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setJob(data);
        setIsBookmarked(false); // You can implement bookmark check here
      } else {
        setError('Job not found');
      }
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
    if (!localStorage.getItem('token')) {
      alert('Please login to apply for jobs');
      return;
    }

    setApplying(true);
    try {
      const response = await fetch(`/api/jobs/${jobId}/apply/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          cover_letter: applicationText
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Application submitted successfully!');
        setShowApplicationForm(false);
        setApplicationText('');
        // Refresh job data to update application status
        fetchJobDetails();
      } else {
        alert(data.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error applying:', error);
      alert('Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleBookmark = async () => {
    // Implement bookmark functionality
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

  const ExpandableCard = ({ title, icon: Icon, children, section, defaultExpanded = false }) => {
    const isExpanded = expandedSections[section];
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <button
          onClick={() => toggleSection(section)}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Icon className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {isExpanded && (
          <div className="px-6 pb-6 border-t border-gray-100">
            {children}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onBack}
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
        <div className="max-w-6xl mx-auto px-4 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft size={20} />
            Back to Jobs
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">{job.startup_detail?.logo || '🏢'}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Building size={16} />
                    <span>{job.startup_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{job.location}</span>
                    {job.is_remote && <span className="text-green-600">(Remote)</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{job.posted_ago}</span>
                  </div>
                  {job.salary_range && (
                    <div className="flex items-center gap-1">
                      <DollarSign size={16} />
                      <span>{job.salary_range}</span>
                    </div>
                  )}
                </div>
                
                {/* Status badges */}
                <div className="flex gap-2 mt-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {job.job_type_name}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {job.experience_level_display}
                  </span>
                  {job.is_urgent && (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      Urgent
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
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
              {job.can_edit && (
                <button
                  onClick={() => onEdit && onEdit(job.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                >
                  <Edit size={16} />
                  Edit Job
                </button>
              )}
              {!job.has_applied ? (
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Apply Now
                </button>
              ) : (
                <button
                  disabled
                  className="px-6 py-3 bg-green-100 text-green-800 rounded-lg font-medium flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  Applied
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <ExpandableCard
              title="Job Description"
              icon={Briefcase}
              section="description"
            >
              <div className="prose prose-gray max-w-none mt-4">
                <p className="whitespace-pre-line">{job.description}</p>
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
                      <span>{req}</span>
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
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </ExpandableCard>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
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
          <div className="space-y-6">
            {/* Company Info */}
            <ExpandableCard
              title="About the Company"
              icon={Building}
              section="company"
            >
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{job.startup_detail?.logo || '🏢'}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{job.startup_name}</h4>
                    <p className="text-sm text-gray-600">{job.startup_industry}</p>
                  </div>
                </div>
                
                <p className="text-gray-700">{job.startup_detail?.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Industry:</span>
                    <p className="font-medium">{job.startup_detail?.industry_name}</p>
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
                    <p className="font-medium">{job.startup_detail?.location}</p>
                  </div>
                </div>

                {job.startup_detail?.website && (
                  <a
                    href={job.startup_detail.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <Globe size={16} />
                    Visit Website
                  </a>
                )}
              </div>
            </ExpandableCard>

            {/* Job Stats */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Stats</h3>
              <div className="space-y-3">
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
                      onClick={() => window.location.href = `/jobs/${similarJob.id}`}
                    >
                      <h4 className="font-medium text-gray-900">{similarJob.title}</h4>
                      <p className="text-sm text-gray-600">{similarJob.startup_name}</p>
                      <p className="text-sm text-gray-500">{similarJob.location}</p>
                    </div>
                  ))}
                </div>
              </ExpandableCard>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Apply to {job.title}</h3>
            <p className="text-gray-600 mb-4">
              Write a brief cover letter explaining why you're interested in this position.
            </p>
            <textarea
              value={applicationText}
              onChange={(e) => setApplicationText(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Dear Hiring Manager,&#10;&#10;I am excited to apply for this position because..."
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowApplicationForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applying || !applicationText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

export default JobDetailPage;import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building, MapPin, DollarSign, Clock, Users, Globe, Star, 
  ChevronLeft, ChevronDown, ChevronUp, Briefcase, CheckCircle,
  AlertCircle, Edit, Trash2, Share2, Bookmark
} from 'lucide-react';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(`/api/jobs/${id}/`, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setJob(data);
        setIsBookmarked(false); // You can implement bookmark check here
      } else {
        setError('Job not found');
      }
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
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    setApplying(true);
    try {
      const response = await fetch(`/api/jobs/${id}/apply/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          cover_letter: applicationText
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Application submitted successfully!');
        setShowApplicationForm(false);
        setApplicationText('');
        // Refresh job data to update application status
        fetchJobDetails();
      } else {
        alert(data.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error applying:', error);
      alert('Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleBookmark = async () => {
    // Implement bookmark functionality
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

  const ExpandableCard = ({ title, icon: Icon, children, section, defaultExpanded = false }) => {
    const isExpanded = expandedSections[section];
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <button
          onClick={() => toggleSection(section)}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Icon className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {isExpanded && (
          <div className="px-6 pb-6 border-t border-gray-100">
            {children}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
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
        <div className="max-w-6xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/jobs')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft size={20} />
            Back to Jobs
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">{job.startup_detail?.logo || '🏢'}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Building size={16} />
                    <span>{job.startup_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{job.location}</span>
                    {job.is_remote && <span className="text-green-600">(Remote)</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{job.posted_ago}</span>
                  </div>
                  {job.salary_range && (
                    <div className="flex items-center gap-1">
                      <DollarSign size={16} />
                      <span>{job.salary_range}</span>
                    </div>
                  )}
                </div>
                
                {/* Status badges */}
                <div className="flex gap-2 mt-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {job.job_type_name}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {job.experience_level_display}
                  </span>
                  {job.is_urgent && (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      Urgent
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
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
              {job.can_edit && (
                <button
                  onClick={() => navigate(`/jobs/${id}/edit`)}
                  className="p-3 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
                >
                  <Edit size={20} />
                </button>
              )}
              {!job.has_applied ? (
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Apply Now
                </button>
              ) : (
                <button
                  disabled
                  className="px-6 py-3 bg-green-100 text-green-800 rounded-lg font-medium flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  Applied
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <ExpandableCard
              title="Job Description"
              icon={Briefcase}
              section="description"
            >
              <div className="prose prose-gray max-w-none mt-4">
                <p className="whitespace-pre-line">{job.description}</p>
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
                      <span>{req}</span>
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
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </ExpandableCard>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
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
          <div className="space-y-6">
            {/* Company Info */}
            <ExpandableCard
              title="About the Company"
              icon={Building}
              section="company"
            >
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{job.startup_detail?.logo || '🏢'}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{job.startup_name}</h4>
                    <p className="text-sm text-gray-600">{job.startup_industry}</p>
                  </div>
                </div>
                
                <p className="text-gray-700">{job.startup_detail?.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Industry:</span>
                    <p className="font-medium">{job.startup_detail?.industry_name}</p>
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
                    <p className="font-medium">{job.startup_detail?.location}</p>
                  </div>
                </div>

                {job.startup_detail?.website && (
                  <a
                    href={job.startup_detail.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <Globe size={16} />
                    Visit Website
                  </a>
                )}
              </div>
            </ExpandableCard>

            {/* Job Stats */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Stats</h3>
              <div className="space-y-3">
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
                      <h4 className="font-medium text-gray-900">{similarJob.title}</h4>
                      <p className="text-sm text-gray-600">{similarJob.startup_name}</p>
                      <p className="text-sm text-gray-500">{similarJob.location}</p>
                    </div>
                  ))}
                </div>
              </ExpandableCard>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Apply to {job.title}</h3>
            <p className="text-gray-600 mb-4">
              Write a brief cover letter explaining why you're interested in this position.
            </p>
            <textarea
              value={applicationText}
              onChange={(e) => setApplicationText(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Dear Hiring Manager,&#10;&#10;I am excited to apply for this position because..."
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowApplicationForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applying || !applicationText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
