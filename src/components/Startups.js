// src/components/Startups.js - Fixed with working bookmark functionality
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SearchBar from './SearchBar';
import FilterChips from './FilterChips';
import useSearch from '../hooks/useSearch';
import { Bookmark, BookmarkCheck, Heart, Star, Loader } from 'lucide-react';

const Startups = () => {
  const [filterOptions, setFilterOptions] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('-created_at');
  const [bookmarkingStates, setBookmarkingStates] = useState({});
  const [likingStates, setLikingStates] = useState({});
  
  // Search hook for managing search state
  const {
    results: startups,
    loading,
    error,
    filters,
    totalResults,
    hasNextPage,
    updateFilters,
    resetFilters,
    removeFilter,
    loadMore,
    search
  } = useSearch('http://localhost:8000/api/startups/');

  // Load filter options on component mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/startups/filters/');
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

  // Handle bookmark toggle
  const handleBookmark = async (startupId, currentBookmarkState) => {
    if (bookmarkingStates[startupId]) return; // Prevent double-clicking
    
    setBookmarkingStates(prev => ({ ...prev, [startupId]: true }));
    
    try {
      const response = await axios.post(`http://localhost:8000/api/startups/${startupId}/bookmark/`);
      
      // Update the startup in the local state
      const updatedStartups = startups.map(startup => {
        if (startup.id === startupId) {
          return {
            ...startup,
            is_bookmarked: !currentBookmarkState,
            total_bookmarks: currentBookmarkState 
              ? startup.total_bookmarks - 1 
              : startup.total_bookmarks + 1
          };
        }
        return startup;
      });
      
      // Force a re-render with updated data
      search(filters);
      
      console.log('Bookmark toggled successfully:', response.data);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      alert('Failed to update bookmark. Please try again.');
    } finally {
      setBookmarkingStates(prev => ({ ...prev, [startupId]: false }));
    }
  };

  // Handle like toggle
  const handleLike = async (startupId, currentLikeState) => {
    if (likingStates[startupId]) return; // Prevent double-clicking
    
    setLikingStates(prev => ({ ...prev, [startupId]: true }));
    
    try {
      const response = await axios.post(`http://localhost:8000/api/startups/${startupId}/like/`);
      
      // Update the startup in the local state
      const updatedStartups = startups.map(startup => {
        if (startup.id === startupId) {
          return {
            ...startup,
            is_liked: !currentLikeState,
            total_likes: currentLikeState 
              ? startup.total_likes - 1 
              : startup.total_likes + 1
          };
        }
        return startup;
      });
      
      // Force a re-render with updated data
      search(filters);
      
      console.log('Like toggled successfully:', response.data);
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Failed to update like. Please try again.');
    } finally {
      setLikingStates(prev => ({ ...prev, [startupId]: false }));
    }
  };

  // Filter labels for chips
  const filterLabels = {
    search: 'Search',
    industry: 'Industry',
    location: 'Location',
    min_employees: 'Min Employees',
    max_employees: 'Max Employees',
    min_rating: 'Min Rating',
    has_funding: 'Funding',
    featured: 'Featured',
    min_founded_year: 'Founded After',
    max_founded_year: 'Founded Before'
  };

  // Sorting options
  const sortOptions = [
    { value: '-created_at', label: 'Newest First' },
    { value: 'created_at', label: 'Oldest First' },
    { value: 'name', label: 'Name A-Z' },
    { value: '-name', label: 'Name Z-A' },
    { value: '-views', label: 'Most Popular' },
    { value: '-employee_count', label: 'Largest Companies' },
    { value: 'employee_count', label: 'Smallest Companies' },
    { value: '-average_rating', label: 'Highest Rated' }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error loading startups</div>
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
          <h1 className="text-3xl font-bold text-gray-900">Discover Startups</h1>
          <p className="mt-2 text-gray-600">Find innovative companies changing the world</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={filters.search || ''}
            onChange={handleSearch}
            onClear={() => handleSearch('')}
            placeholder="Search startups, industries, locations..."
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
                    {totalResults.toLocaleString()} startup{totalResults !== 1 ? 's' : ''} found
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
                        {industry.icon} {industry.name} ({industry.startup_count})
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

                {/* Company Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                  <select
                    value={filters.employee_range || ''}
                    onChange={(e) => {
                      const range = filterOptions.employee_ranges.find(r => r.label === e.target.value);
                      if (range) {
                        handleFilterChange('min_employees', range.min);
                        handleFilterChange('max_employees', range.max);
                      } else {
                        handleFilterChange('min_employees', null);
                        handleFilterChange('max_employees', null);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Size</option>
                    {filterOptions.employee_ranges.map(range => (
                      <option key={range.label} value={range.label}>
                        {range.label} employees
                      </option>
                    ))}
                  </select>
                </div>

                {/* Minimum Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                  <select
                    value={filters.min_rating || ''}
                    onChange={(e) => handleFilterChange('min_rating', e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                    <option value="1">1+ Star</option>
                  </select>
                </div>

              </div>

              {/* Checkboxes Row */}
              <div className="mt-6 flex flex-wrap gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.featured === 'true'}
                    onChange={(e) => handleFilterChange('featured', e.target.checked ? 'true' : null)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured only</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.has_funding === 'true'}
                    onChange={(e) => handleFilterChange('has_funding', e.target.checked ? 'true' : null)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Has funding</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Results Grid - Updated with working bookmark/like functionality */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map((startup) => (
            <div
              key={startup.id}
              className="block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-blue-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl">{startup.logo}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Link 
                        to={`/startups/${startup.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {startup.name}
                      </Link>
                      {startup.is_featured && (
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{startup.industry_name}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">{startup.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        📍 {startup.location}
                      </span>
                      <span className="text-xs text-gray-500">{startup.employee_count} employees</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-sm text-gray-600">{startup.average_rating?.toFixed(1) || 'N/A'}</span>
                      <span className="text-xs text-gray-500">({startup.total_ratings})</span>
                    </div>
                  </div>

                  {startup.funding_amount && (
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        💰 {startup.funding_amount}
                      </span>
                      {startup.valuation && (
                        <span className="text-xs text-gray-500">Valued at {startup.valuation}</span>
                      )}
                    </div>
                  )}

                  {startup.tags_list && startup.tags_list.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {startup.tags_list.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                      {startup.tags_list.length > 3 && (
                        <span className="text-xs text-gray-500">+{startup.tags_list.length - 3} more</span>
                      )}
                    </div>
                  )}
                  
                  {/* Action Buttons and View Details */}
                  <div className="pt-2 border-t border-gray-100 space-y-3">
                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleLike(startup.id, startup.is_liked);
                          }}
                          disabled={likingStates[startup.id]}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            startup.is_liked
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
                          } disabled:opacity-50`}
                        >
                          {likingStates[startup.id] ? (
                            <Loader className="w-3 h-3 animate-spin" />
                          ) : (
                            <Heart className={`w-3 h-3 ${startup.is_liked ? 'fill-current' : ''}`} />
                          )}
                          <span>{startup.total_likes || 0}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleBookmark(startup.id, startup.is_bookmarked);
                          }}
                          disabled={bookmarkingStates[startup.id]}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            startup.is_bookmarked
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                          } disabled:opacity-50`}
                        >
                          {bookmarkingStates[startup.id] ? (
                            <Loader className="w-3 h-3 animate-spin" />
                          ) : startup.is_bookmarked ? (
                            <BookmarkCheck className="w-3 h-3 fill-current" />
                          ) : (
                            <Bookmark className="w-3 h-3" />
                          )}
                          <span>{startup.is_bookmarked ? 'Saved' : 'Save'}</span>
                        </button>
                      </div>

                      <span className="text-gray-500 text-xs">👁️ {startup.views} views</span>
                    </div>

                    {/* View Details Link */}
                    <Link
                      to={`/startups/${startup.id}`}
                      className="block w-full text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {loading && startups.length === 0 && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && startups.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No startups found</h3>
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
              Load More Startups
            </button>
          </div>
        )}

        {/* Loading More Indicator */}
        {loading && startups.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Startups;
