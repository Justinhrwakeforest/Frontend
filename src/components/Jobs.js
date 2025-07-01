// src/components/Jobs.js - Enhanced Startlinker Modern Minimalistic Design
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchBar from './SearchBar';
import FilterChips from './FilterChips';
import JobApplicationModal from './JobApplicationModal';
import JobUploadForm from './JobUploadForm';
import useSearch from '../hooks/useSearch';
import { useNotifications } from './NotificationSystem';
import { 
  MapPin, Clock, DollarSign, Users, Building, Star, 
  ExternalLink, Briefcase, AlertCircle, CheckCircle,
  Filter, Grid, List, RefreshCw, Heart, Bookmark,
  Eye, Share2, ChevronRight, Phone, Mail, Globe,
  Calendar, TrendingUp, Award, Target, Plus,
  Sparkles, Zap, SlidersHorizontal, Rocket, Crown,
  Activity, BarChart3, Flame, TrendingDown, Search
} from 'lucide-react';

const Jobs = () => {
  const navigate = useNavigate();
  const { success, error } = useNotifications();
  const [filterOptions, setFilterOptions] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('-posted_at');
  const [viewMode, setViewMode] = useState('list');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showJobUploadForm, setShowJobUploadForm] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [bookmarkedJobs, setBookmarkedJobs] = useState(new Set());
  const [likedJobs, setLikedJobs] = useState(new Set());
  const [refreshing, setRefreshing] = useState(false);
  
  // Search hook for managing search state
  const {
    results: jobs,
    loading,
    error: searchError,
    filters,
    totalResults,
    hasNextPage,
    updateFilters,
    resetFilters,
    removeFilter,
    loadMore,
    search,
    updateResults
  } = useSearch('http://localhost:8000/api/jobs/');

  // Load filter options and user data on component mount
  useEffect(() => {
    loadFilterOptions();
    loadAppliedJobs();
    loadUserJobInteractions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/jobs/filters/');
      setFilterOptions(response.data);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const loadAppliedJobs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/jobs/my_applications/');
      const appliedJobIds = new Set(response.data.map(app => app.job));
      setAppliedJobs(appliedJobIds);
    } catch (error) {
      console.error('Error loading applied jobs:', error);
    }
  };

  const loadUserJobInteractions = async () => {
    try {
      // Load bookmarked and liked jobs if endpoints exist
      // This would require additional backend endpoints
      // For now, we'll initialize empty sets
      setBookmarkedJobs(new Set());
      setLikedJobs(new Set());
    } catch (error) {
      console.error('Error loading user interactions:', error);
    }
  };

  const refreshJobs = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadFilterOptions(),
        loadAppliedJobs(),
        loadUserJobInteractions()
      ]);
      // Trigger search refresh
      search(filters);
      success('Jobs refreshed successfully');
    } catch (error) {
      console.error('Error refreshing jobs:', error);
      error('Failed to refresh jobs');
    } finally {
      setRefreshing(false);
    }
  };

  // Handle search input
  const handleSearch = (searchTerm) => {
    updateFilters({ search: searchTerm });
  };

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    updateFilters({ [filterKey]: value });
  };

  // Handle sorting
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    updateFilters({ ordering: newSortBy });
  };

  // Handle job application
  const handleApply = (job) => {
    if (appliedJobs.has(job.id)) {
      error('You have already applied to this job');
      return;
    }
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  // Handle successful application submission
  const handleApplicationSubmitted = (applicationData) => {
    setAppliedJobs(prev => new Set([...prev, selectedJob.id]));
    setShowApplicationModal(false);
    setSelectedJob(null);
    success(`Application submitted for ${selectedJob.title}!`, 'Success', {
      showBrowser: true,
      actions: [
        {
          label: 'View Applications',
          action: () => window.location.href = '/profile?tab=applications'
        }
      ]
    });
  };

  // Handle application modal close
  const handleApplicationModalClose = () => {
    setShowApplicationModal(false);
    setSelectedJob(null);
  };

  // Handle job upload success
  const handleJobUploadSuccess = (jobData) => {
    setShowJobUploadForm(false);
    success('Job posted successfully! It will be reviewed by our admin team before being published.', 'Success');
    // Optionally refresh the jobs list
    refreshJobs();
  };

  // Handle job sharing
  const handleShare = (job) => {
    if (navigator.share) {
      navigator.share({
        title: `${job.title} at ${job.startup_name}`,
        text: `Check out this job opportunity: ${job.title} at ${job.startup_name}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      const shareText = `${job.title} at ${job.startup_name} - ${window.location.href}`;
      navigator.clipboard.writeText(shareText).then(() => {
        success('Job link copied to clipboard!');
      });
    }
  };

  // Handle job bookmarking (placeholder - would need backend endpoint)
  const handleBookmark = async (jobId) => {
    try {
      // This would require a backend endpoint similar to startup bookmarking
      const isBookmarked = bookmarkedJobs.has(jobId);
      if (isBookmarked) {
        setBookmarkedJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
        success('Job removed from bookmarks');
      } else {
        setBookmarkedJobs(prev => new Set([...prev, jobId]));
        success('Job bookmarked successfully');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      error('Failed to update bookmark');
    }
  };

  // Filter labels for chips
  const filterLabels = {
    search: 'Search',
    job_type: 'Job Type',
    experience_level: 'Experience',
    location: 'Location',
    is_remote: 'Remote',
    is_urgent: 'Urgent',
    industry: 'Industry',
    posted_since: 'Posted Since',
    skills: 'Skills',
    min_employees: 'Min Company Size',
    max_employees: 'Max Company Size'
  };

  // Sorting options
  const sortOptions = [
    { value: '-posted_at', label: 'Newest First' },
    { value: 'posted_at', label: 'Oldest First' },
    { value: 'title', label: 'Title A-Z' },
    { value: '-title', label: 'Title Z-A' },
    { value: '-application_count', label: 'Most Popular' },
    { value: 'application_count', label: 'Least Popular' },
    { value: '-startup__employee_count', label: 'Largest Companies' },
    { value: 'startup__employee_count', label: 'Smallest Companies' }
  ];

  const JobCard = ({ job, isGrid = false }) => {
    const hasApplied = appliedJobs.has(job.id);
    const isBookmarked = bookmarkedJobs.has(job.id);
    const isLiked = likedJobs.has(job.id);

    const handleCardClick = (e) => {
      // Don't navigate if clicking on buttons or interactive elements
      if (e.target.closest('button') || e.target.closest('a')) {
        return;
      }
      navigate(`/jobs/${job.id}`);
    };
    
    if (isGrid) {
      return (
        <div 
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
          onClick={handleCardClick}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                {job.is_urgent && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full border border-red-200">
                    Urgent
                  </span>
                )}
                {hasApplied && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-200">
                    Applied
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                <span className="flex items-center">
                  <Building className="w-4 h-4 mr-1" />
                  {job.startup_name}
                </span>
                <span className="text-blue-600 font-medium px-2 py-1 bg-blue-50 rounded-lg border border-blue-200">{job.startup_industry}</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{job.location}</span>
                {job.is_remote && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full border border-purple-200">Remote</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{job.salary_range || 'Not specified'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{job.posted_ago}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{job.application_count || 0} applicants</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200">
                {job.job_type_name}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full border border-gray-200">
                {job.experience_level_display}
              </span>
            </div>

            {job.skills_list && job.skills_list.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {job.skills_list.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills_list.length > 3 && (
                  <span className="text-xs text-gray-500">+{job.skills_list.length - 3}</span>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBookmark(job.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    isBookmarked ? 'bg-blue-100 text-blue-600 border border-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-blue-50 border border-gray-200'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => handleShare(job)}
                  className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors border border-gray-200"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Eye className="w-3 h-3" />
                <span>{job.view_count || 0} views</span>
              </div>
            </div>
            
            {/* Apply Button */}
            <button
              onClick={() => handleApply(job)}
              disabled={hasApplied}
              className={`w-full py-2.5 px-4 rounded-xl font-medium text-sm transition-colors ${
                hasApplied
                  ? 'bg-green-100 text-green-700 cursor-not-allowed border border-green-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
              }`}
            >
              {hasApplied ? 'Applied' : 'Apply Now'}
            </button>
          </div>
        </div>
      );
    } else {
      // List view
      return (
        <div 
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
          onClick={handleCardClick}
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-semibold text-lg border border-blue-200">
                {job.startup_name?.charAt(0) || 'J'}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{job.title}</h3>
                  {job.is_urgent && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full border border-red-200">
                      Urgent
                    </span>
                  )}
                  {hasApplied && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-200">
                      Applied
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBookmark(job.id)}
                    className={`p-2 rounded-xl transition-colors ${
                      isBookmarked ? 'bg-blue-100 text-blue-600 border border-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-blue-50 border border-gray-200'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleShare(job)}
                    className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors border border-gray-200"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                <span className="flex items-center">
                  <Building className="w-4 h-4 mr-1" />
                  {job.startup_name}
                </span>
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {job.location}
                </span>
                {job.is_remote && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full border border-purple-200">Remote</span>
                )}
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {job.posted_ago}
                </span>
                {job.salary_range && (
                  <span className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {job.salary_range}
                  </span>
                )}
              </div>
              
              <p className="text-gray-700 mb-3 line-clamp-2">{job.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200">
                    {job.job_type_name}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full border border-gray-200">
                    {job.experience_level_display}
                  </span>
                  <span className="text-xs text-gray-500">{job.application_count || 0} applicants</span>
                </div>
                
                <button
                  onClick={() => handleApply(job)}
                  disabled={hasApplied}
                  className={`px-6 py-2 rounded-xl font-medium text-sm transition-colors ${
                    hasApplied
                      ? 'bg-green-100 text-green-700 cursor-not-allowed border border-green-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
                  }`}
                >
                  {hasApplied ? 'Applied' : 'Apply Now'}
                </button>
              </div>
              
              {job.skills_list && job.skills_list.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-sm font-medium text-gray-700 mb-2">Required Skills:</div>
                  <div className="flex flex-wrap gap-1">
                    {job.skills_list.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
  };

  if (searchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Jobs</h2>
          <p className="text-gray-600 mb-4">{searchError}</p>
          <button 
            onClick={refreshJobs}
            className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Hero Header Section */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Job <span className="text-purple-600">Opportunities</span>
                </h1>
              </div>
              <p className="text-xl text-gray-600 mb-8">
                Discover your next career opportunity with innovative startups
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowJobUploadForm(true)}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Post a Job
                </button>
                <button
                  onClick={refreshJobs}
                  disabled={refreshing}
                  className="inline-flex items-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:border-purple-300 hover:text-purple-600 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh Jobs
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Left Column - Filters & Stats (1/4 width) */}
          <div className="xl:col-span-1">
            <div className="space-y-6">
              
              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-blue-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Job Market</h3>
                      <p className="text-blue-700 text-sm">Current overview</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl border border-purple-200">
                      <span className="text-sm font-medium text-purple-700">Total Jobs</span>
                      <span className="text-lg font-bold text-purple-600">{totalResults.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl border border-green-200">
                      <span className="text-sm font-medium text-green-700">Remote Jobs</span>
                      <span className="text-lg font-bold text-green-600">
                        {Math.floor(totalResults * 0.4).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <span className="text-sm font-medium text-amber-700">Urgent Hiring</span>
                      <span className="text-lg font-bold text-amber-600">
                        {Math.floor(totalResults * 0.15).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <span className="text-sm font-medium text-blue-700">Posted Today</span>
                      <span className="text-lg font-bold text-blue-600">
                        {Math.floor(totalResults * 0.08).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-green-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                      <Filter className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Quick Filters</h3>
                      <p className="text-green-700 text-sm">Popular searches</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3">
                    {[
                      { label: 'Remote Only', filter: 'is_remote', value: 'true', icon: Globe, color: 'purple' },
                      { label: 'Urgent Hiring', filter: 'is_urgent', value: 'true', icon: Zap, color: 'red' },
                      { label: 'Full-time', filter: 'job_type', value: '1', icon: Clock, color: 'blue' },
                      { label: 'Entry Level', filter: 'experience_level', value: 'entry', icon: Target, color: 'green' }
                    ].map((quickFilter) => {
                      const IconComponent = quickFilter.icon;
                      const isActive = filters[quickFilter.filter] === quickFilter.value;
                      
                      return (
                        <button
                          key={quickFilter.label}
                          onClick={() => handleFilterChange(quickFilter.filter, isActive ? null : quickFilter.value)}
                          className={`w-full flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-200 ${
                            isActive
                              ? `bg-${quickFilter.color}-100 border-${quickFilter.color}-300 text-${quickFilter.color}-800`
                              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <IconComponent className={`w-4 h-4 ${isActive ? `text-${quickFilter.color}-600` : 'text-gray-500'}`} />
                          <span className="text-sm font-medium">{quickFilter.label}</span>
                          {isActive && <CheckCircle className={`w-4 h-4 text-${quickFilter.color}-600 ml-auto`} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Popular Job Types */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 border-b border-orange-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                      <Flame className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Popular Roles</h3>
                      <p className="text-orange-700 text-sm">In demand</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3">
                    {[
                      { name: 'Software Engineer', count: '150+', trend: 'up' },
                      { name: 'Product Manager', count: '85+', trend: 'up' },
                      { name: 'Data Scientist', count: '67+', trend: 'up' },
                      { name: 'UX Designer', count: '45+', trend: 'down' },
                      { name: 'DevOps Engineer', count: '38+', trend: 'up' }
                    ].map((role) => (
                      <div key={role.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
                        <div>
                          <span className="text-sm font-medium text-gray-900">{role.name}</span>
                          <div className="text-xs text-gray-500">{role.count} openings</div>
                        </div>
                        {role.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content (3/4 width) */}
          <div className="xl:col-span-3">
            <div className="space-y-6">

              {/* Search Bar */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <SearchBar
                  value={filters.search || ''}
                  onChange={handleSearch}
                  onClear={() => handleSearch('')}
                  placeholder="Search jobs, companies, skills..."
                  loading={loading}
                  className="w-full"
                />
              </div>

              {/* Filter Controls */}
              <div className="space-y-4">
                {/* Control Bar */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center px-4 py-2.5 rounded-xl font-medium transition-colors ${
                          showFilters 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Advanced Filters
                        {Object.keys(filters).length > 0 && (
                          <span className="ml-2 px-2 py-1 text-xs bg-white/20 rounded-full">
                            {Object.keys(filters).length}
                          </span>
                        )}
                      </button>

                      <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-xl">
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded-lg transition-colors ${
                            viewMode === 'list' 
                              ? 'bg-white text-blue-600 shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <List className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 rounded-lg transition-colors ${
                            viewMode === 'grid' 
                              ? 'bg-white text-blue-600 shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Grid className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-4 py-2.5 rounded-xl">
                        {loading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Searching...</span>
                          </>
                        ) : (
                          <>
                            <Briefcase className="w-4 h-4" />
                            <span>
                              {totalResults.toLocaleString()} opportunity{totalResults !== 1 ? 's' : ''} found
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center space-x-3">
                      <label className="text-sm font-medium text-gray-700">Sort by:</label>
                      <select
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {sortOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Active Filter Chips */}
                {Object.keys(filters).length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <FilterChips
                      filters={filters}
                      onRemoveFilter={removeFilter}
                      onClearAll={resetFilters}
                      filterLabels={filterLabels}
                    />
                  </div>
                )}

                {/* Advanced Filters Panel */}
                {showFilters && filterOptions && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      
                      {/* Job Type Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                        <select
                          value={filters.job_type || ''}
                          onChange={(e) => handleFilterChange('job_type', e.target.value || null)}
                          className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">All Types</option>
                          {filterOptions.job_types?.map(type => (
                            <option key={type.id} value={type.id}>
                              {type.name} ({type.job_count})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Experience Level Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                        <select
                          value={filters.experience_level || ''}
                          onChange={(e) => handleFilterChange('experience_level', e.target.value || null)}
                          className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">All Levels</option>
                          {filterOptions.experience_levels?.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.label} ({level.count})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Location Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <select
                          value={filters.location || ''}
                          onChange={(e) => handleFilterChange('location', e.target.value || null)}
                          className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">All Locations</option>
                          {filterOptions.locations?.map(location => (
                            <option key={location} value={location}>
                              {location}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Industry Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                        <select
                          value={filters.industry || ''}
                          onChange={(e) => handleFilterChange('industry', e.target.value || null)}
                          className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">All Industries</option>
                          {filterOptions.industries?.map(industry => (
                            <option key={industry.id} value={industry.id}>
                              {industry.name} ({industry.job_count})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Posted Since Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Posted Since</label>
                        <select
                          value={filters.posted_since || ''}
                          onChange={(e) => handleFilterChange('posted_since', e.target.value || null)}
                          className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Any Time</option>
                          {filterOptions.posted_since_options?.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Checkboxes Row */}
                    <div className="mt-6 flex flex-wrap gap-4">
                      <label className="flex items-center space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.is_remote === 'true'}
                          onChange={(e) => handleFilterChange('is_remote', e.target.checked ? 'true' : null)}
                          className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <Globe className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium text-purple-700">Remote only</span>
                      </label>

                      <label className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.is_urgent === 'true'}
                          onChange={(e) => handleFilterChange('is_urgent', e.target.checked ? 'true' : null)}
                          className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                        />
                        <Zap className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium text-red-700">Urgent jobs only</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Results Display */}
              {jobs.length > 0 ? (
                <div className={`${
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6' 
                    : 'space-y-4'
                }`}>
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} isGrid={viewMode === 'grid'} />
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                  {loading ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-blue-600 mb-4"></div>
                      <p className="text-gray-600">Loading opportunities...</p>
                    </div>
                  ) : (
                    <div>
                      <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {Object.keys(filters).length > 0 ? 'No matching jobs found' : 'No jobs available'}
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        {Object.keys(filters).length > 0 
                          ? 'Try adjusting your search criteria or filters to find more opportunities.' 
                          : 'Check back later for new job postings from innovative startups.'}
                      </p>
                      {Object.keys(filters).length > 0 ? (
                        <button
                          onClick={resetFilters}
                          className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
                        >
                          Clear All Filters
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                              onClick={refreshJobs}
                              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                            >
                              Refresh Jobs
                            </button>
                            <button
                              onClick={() => setShowJobUploadForm(true)}
                              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                            >
                              Post the First Job
                            </button>
                          </div>
                          <p className="text-sm text-gray-500">
                            Want to be notified of new jobs? <a href="/profile" className="text-blue-600 hover:underline">Set up job alerts</a>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Load More Button */}
              {hasNextPage && !loading && (
                <div className="flex justify-center">
                  <button
                    onClick={loadMore}
                    className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium transform hover:-translate-y-1"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>Load More Jobs</span>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      {jobs.length} of {totalResults}
                    </span>
                  </button>
                </div>
              )}

              {/* Loading More Indicator */}
              {loading && jobs.length > 0 && (
                <div className="flex justify-center">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-blue-600"></div>
                      <span className="text-gray-600 font-medium">Loading more opportunities...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Job Application Modal */}
      <JobApplicationModal
        isOpen={showApplicationModal}
        onClose={handleApplicationModalClose}
        job={selectedJob}
        onApplicationSubmitted={handleApplicationSubmitted}
      />

      {/* Job Upload Form Modal */}
      <JobUploadForm
        isOpen={showJobUploadForm}
        onClose={() => setShowJobUploadForm(false)}
        onSuccess={handleJobUploadSuccess}
      />

      {/* Custom CSS for line clamp */}
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
      `}</style>
    </div>
  );
};

export default Jobs;
