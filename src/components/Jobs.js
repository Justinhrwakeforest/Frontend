import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import FilterChips from './FilterChips';
import useSearch from '../hooks/useSearch';

const Jobs = () => {
  const [filterOptions, setFilterOptions] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('-posted_at');
  
  // Search hook for managing search state
  const {
    results: jobs,
    loading,
    error,
    filters,
    totalResults,
    hasNextPage,
    updateFilters,
    resetFilters,
    removeFilter,
    loadMore
  } = useSearch('http://localhost:8000/api/jobs/');

  // Load filter options on component mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/jobs/filters/');
        setFilterOptions(response.data);
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };
    
    loadFilterOptions();
  }, []);

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

  // Job application handler
  const handleApply = async (jobId) => {
    try {
      await axios.post(`http://localhost:8000/api/jobs/${jobId}/apply/`, {
        cover_letter: 'I am interested in this position.'
      });
      alert('Application submitted successfully!');
      // Refresh jobs to update has_applied status
      window.location.reload();
    } catch (error) {
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Error submitting application. Please try again.');
      }
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
    skills: 'Skills'
  };

  // Sorting options
  const sortOptions = [
    { value: '-posted_at', label: 'Newest First' },
    { value: 'posted_at', label: 'Oldest First' },
    { value: 'title', label: 'Title A-Z' },
    { value: '-title', label: 'Title Z-A' },
    { value: '-application_count', label: 'Most Popular' },
    { value: 'application_count', label: 'Least Popular' }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error loading jobs</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
          <h1 className="text-3xl font-bold text-gray-900">Job Opportunities</h1>
          <p className="mt-2 text-gray-600">Find your next career opportunity</p>
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
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
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
                    {filterOptions.job_types.map(type => (
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
                    {filterOptions.experience_levels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label} ({level.count})
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
                    {filterOptions.industries.map(industry => (
                      <option key={industry.id} value={industry.id}>
                        {industry.name} ({industry.job_count})
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
                    {filterOptions.locations.map(location => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Posted Since Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Posted</label>
                  <select
                    value={filters.posted_since || ''}
                    onChange={(e) => handleFilterChange('posted_since', e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any time</option>
                    {filterOptions.posted_since_options.map(option => (
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

        {/* Results List */}
        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    {job.is_urgent && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        🚨 Urgent
                      </span>
                    )}
                    {job.is_remote && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        🌐 Remote
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <p className="text-lg text-blue-600 font-medium">{job.startup_name}</p>
                    <span className="text-sm text-gray-500">•</span>
                    <p className="text-sm text-gray-600">{job.startup_industry}</p>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">📍</span>
                      <span className="text-sm text-gray-600">{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">💰</span>
                      <span className="text-sm text-gray-600">{job.salary_range}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">⏰</span>
                      <span className="text-sm text-gray-600">{job.posted_ago}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">👥</span>
                      <span className="text-sm text-gray-600">{job.application_count} applied</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {job.job_type_name}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {job.experience_level_display}
                    </span>
                    {job.skills_list && job.skills_list.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills_list && job.skills_list.length > 3 && (
                      <span className="text-xs text-gray-500">+{job.skills_list.length - 3} skills</span>
                    )}
                  </div>
                </div>
                
                <div className="ml-6 flex flex-col items-end space-y-2">
                  <button
                    onClick={() => handleApply(job.id)}
                    disabled={job.has_applied}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      job.has_applied
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {job.has_applied ? '✓ Applied' : 'Apply Now'}
                  </button>
                  
                  <div className="text-right">
                    <div className="text-xs text-gray-500">
                      {job.days_since_posted === 0 ? 'Today' : 
                       job.days_since_posted === 1 ? 'Yesterday' : 
                       `${job.days_since_posted} days ago`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {loading && jobs.length === 0 && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && jobs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {hasNextPage && !loading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      </div>
    </div>
  );
};

export default Jobs;