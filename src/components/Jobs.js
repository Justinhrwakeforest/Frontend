// src/components/Jobs.js - Complete Jobs Component with Application Modal Integration
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import FilterChips from './FilterChips';
import JobApplicationModal from './JobApplicationModal';
import useSearch from '../hooks/useSearch';
import { useNotifications } from './NotificationSystem';
import { 
  MapPin, Clock, DollarSign, Users, Building, Star, 
  ExternalLink, Briefcase, AlertCircle, CheckCircle,
  Filter, Grid, List, RefreshCw, Heart, Bookmark,
  Eye, Share2, ChevronRight, Phone, Mail, Globe,
  Calendar, TrendingUp, Award, Target
} from 'lucide-react';

const Jobs = () => {
  const { success, error } = useNotifications();
  const [filterOptions, setFilterOptions] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('-posted_at');
  const [viewMode, setViewMode] = useState('list');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
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
    
    if (isGrid) {
      return (
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                {job.is_urgent && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    🚨 Urgent
                  </span>
                )}
                {hasApplied && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✅ Applied
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                <span className="flex items-center">
                  <Building className="w-4 h-4 mr-1" />
                  {job.startup_name}
                </span>
                <span className="text-blue-600">{job.startup_industry}</span>
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
                  <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">Remote</span>
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
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {job.job_type_name}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {job.experience_level_display}
              </span>
            </div>

            {job.skills_list && job.skills_list.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {job.skills_list.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
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
                  className={`p-2 rounded-full transition-colors ${
                    isBookmarked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => handleShare(job)}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
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
              className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                hasApplied
                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
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
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                {job.startup_name?.charAt(0) || 'J'}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{job.title}</h3>
                  {job.is_urgent && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      🚨 Urgent
                    </span>
                  )}
                  {hasApplied && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✅ Applied
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBookmark(job.id)}
                    className={`p-2 rounded-full transition-colors ${
                      isBookmarked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleShare(job)}
                    className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
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
                  <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">Remote</span>
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
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {job.job_type_name}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {job.experience_level_display}
                  </span>
                  <span className="text-xs text-gray-500">{job.application_count || 0} applicants</span>
                </div>
                
                <button
                  onClick={() => handleApply(job)}
                  disabled={hasApplied}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    hasApplied
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
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
                        className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Jobs</h2>
          <p className="text-gray-600 mb-4">{searchError}</p>
          <button 
            onClick={refreshJobs}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Briefcase className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">Job Opportunities</h1>
              </div>
              <p className="text-gray-600">Find your next career opportunity at innovative startups</p>
            </div>
            <button
              onClick={refreshJobs}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={filters.search || ''}
            onChange={handleSearch}
            onClear={() => handleSearch('')}
            placeholder="Search jobs, companies, skills..."
            loading={loading}
            className="max-w-2xl"
          />
        </div>

        {/* Filter Controls */}
        <div className="mb-6 space-y-4">
          {/* Filter Toggle & Sort */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {Object.keys(filters).length > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                    {Object.keys(filters).length}
                  </span>
                )}
              </button>

              {/* Results Counter */}
              <div className="text-sm text-gray-600">
                {loading ? (
                  <span>Searching...</span>
                ) : (
                  <span>
                    {totalResults.toLocaleString()} job{totalResults !== 1 ? 's' : ''} found
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          <FilterChips
            filters={filters}
            onRemoveFilter={removeFilter}
            onClearAll={resetFilters}
            filterLabels={filterLabels}
          />

          {/* Advanced Filters Panel */}
          {showFilters && filterOptions && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Job Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                  <select
                    value={filters.job_type || ''}
                    onChange={(e) => handleFilterChange('job_type', e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <div className="mt-6 flex flex-wrap gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.is_remote === 'true'}
                    onChange={(e) => handleFilterChange('is_remote', e.target.checked ? 'true' : null)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Remote only</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.is_urgent === 'true'}
                    onChange={(e) => handleFilterChange('is_urgent', e.target.checked ? 'true' : null)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Urgent jobs only</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mb-6 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalResults}</div>
              <div className="text-sm text-gray-600">Total Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{appliedJobs.size}</div>
              <div className="text-sm text-gray-600">Applied</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{bookmarkedJobs.size}</div>
              <div className="text-sm text-gray-600">Bookmarked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{jobs.filter(job => job.is_remote).length}</div>
              <div className="text-sm text-gray-600">Remote Jobs</div>
            </div>
          </div>
        </div>

        {/* Results Display */}
        {jobs.length > 0 ? (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
          }`}>
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} isGrid={viewMode === 'grid'} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading job opportunities...</p>
              </div>
            ) : (
              <div>
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
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
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={refreshJobs}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Refresh Jobs
                    </button>
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
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Load More Jobs
            </button>
          </div>
        )}

        {/* Loading More Indicator */}
        {loading && jobs.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Quick Actions Panel */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Ready to Take the Next Step?</h2>
              <p className="text-blue-100">Explore more opportunities and manage your job search</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">Job Alerts</h3>
                <p className="text-sm text-blue-100 mb-4">Get notified when new jobs match your criteria</p>
                <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
                  Set Up Alerts
                </button>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">Profile Builder</h3>
                <p className="text-sm text-blue-100 mb-4">Complete your profile to attract recruiters</p>
                <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
                  Build Profile
                </button>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">Applications</h3>
                <p className="text-sm text-blue-100 mb-4">Track your job applications and interviews</p>
                <button 
                  onClick={() => window.location.href = '/profile?tab=applications'}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                >
                  View Applications
                </button>
              </div>
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
    </div>
  );
};

export default Jobs;
