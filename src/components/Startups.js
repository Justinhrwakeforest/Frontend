// src/components/Startups.js - Professional modern UI
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import SearchBar from './SearchBar';
import FilterChips from './FilterChips';
import useSearch from '../hooks/useSearch';
import { 
  Bookmark, BookmarkCheck, Heart, Star, Loader, Filter, 
  MapPin, Users, Eye, TrendingUp, DollarSign, Calendar,
  Building, Zap, Globe, Award, ChevronRight, Target,
  Sparkles, ArrowUp, ArrowDown, Grid3X3, List, Search,
  SlidersHorizontal, RefreshCw, Flame, Rocket, Crown,
  AlertCircle
} from 'lucide-react';

const Startups = () => {
  const location = useLocation();
  const [filterOptions, setFilterOptions] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('-created_at');
  const [bookmarkingStates, setBookmarkingStates] = useState({});
  const [likingStates, setLikingStates] = useState({});
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  
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
    updateResults
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

  // Handle search term from navigation state
  useEffect(() => {
    if (location.state?.searchTerm) {
      handleSearch(location.state.searchTerm);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSearch = (searchTerm) => {
    updateFilters({ search: searchTerm });
  };

  const handleFilterChange = (filterKey, value) => {
    updateFilters({ [filterKey]: value });
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    updateFilters({ ordering: newSortBy });
  };

  const handleBookmark = async (startupId, currentBookmarkState) => {
    if (bookmarkingStates[startupId]) return;
    
    setBookmarkingStates(prev => ({ ...prev, [startupId]: true }));
    
    try {
      const response = await axios.post(`http://localhost:8000/api/startups/${startupId}/bookmark/`);
      
      if (response.data.success !== false) {
        updateResults(startup => {
          if (startup.id === startupId) {
            return {
              ...startup,
              is_bookmarked: response.data.bookmarked,
              total_bookmarks: response.data.total_bookmarks
            };
          }
          return startup;
        });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      alert('Failed to update bookmark. Please try again.');
    } finally {
      setBookmarkingStates(prev => ({ ...prev, [startupId]: false }));
    }
  };

  const handleLike = async (startupId, currentLikeState) => {
    if (likingStates[startupId]) return;
    
    setLikingStates(prev => ({ ...prev, [startupId]: true }));
    
    try {
      const response = await axios.post(`http://localhost:8000/api/startups/${startupId}/like/`);
      
      updateResults(startup => {
        if (startup.id === startupId) {
          return {
            ...startup,
            is_liked: response.data.liked,
            total_likes: response.data.total_likes
          };
        }
        return startup;
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Failed to update like. Please try again.');
    } finally {
      setLikingStates(prev => ({ ...prev, [startupId]: false }));
    }
  };

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

  const sortOptions = [
    { value: '-created_at', label: 'Newest First', icon: Calendar },
    { value: 'created_at', label: 'Oldest First', icon: Calendar },
    { value: 'name', label: 'Name A-Z', icon: Target },
    { value: '-name', label: 'Name Z-A', icon: Target },
    { value: '-views', label: 'Most Popular', icon: Eye },
    { value: '-employee_count', label: 'Largest Companies', icon: Users },
    { value: 'employee_count', label: 'Smallest Companies', icon: Users },
    { value: '-average_rating', label: 'Highest Rated', icon: Star }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Startups</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
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


        {/* Search Bar */}
        <div className="mb-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <SearchBar
              value={filters.search || ''}
              onChange={handleSearch}
              onClear={() => handleSearch('')}
              placeholder="Search startups, industries, locations..."
              loading={loading}
              className="w-full"
              showRecentSearches={true}
              showTrendingSearches={true}
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-6 space-y-4">
          {/* Control Bar */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    showFilters 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {Object.keys(filters).length > 0 && (
                    <span className="ml-2 px-2 py-1 text-xs bg-white/20 rounded-full">
                      {Object.keys(filters).length}
                    </span>
                  )}
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Building className="w-4 h-4" />
                      <span>
                        {totalResults.toLocaleString()} startup{totalResults !== 1 ? 's' : ''} found
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
                  className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
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
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Industry Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Industry</label>
                  <select
                    value={filters.industry || ''}
                    onChange={(e) => handleFilterChange('industry', e.target.value || null)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <select
                    value={filters.location || ''}
                    onChange={(e) => handleFilterChange('location', e.target.value || null)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Company Size</label>
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
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Minimum Rating</label>
                  <select
                    value={filters.min_rating || ''}
                    onChange={(e) => handleFilterChange('min_rating', e.target.value || null)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.featured === 'true'}
                    onChange={(e) => handleFilterChange('featured', e.target.checked ? 'true' : null)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Crown className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">Featured only</span>
                </label>

                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.has_funding === 'true'}
                    onChange={(e) => handleFilterChange('has_funding', e.target.checked ? 'true' : null)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">Has funding</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Results Grid */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }`}>
          {startups.map((startup) => (
            <Link
              key={startup.id}
              to={`/startups/${startup.id}`}
              className="group block bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-2xl p-3 bg-gray-50 rounded-lg">
                    {startup.logo}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {startup.name}
                      </h3>
                      {startup.is_featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                      {startup.industry_name}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                
                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{startup.description}</p>
                
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{startup.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{startup.employee_count} employees</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>
                      {startup.average_rating?.toFixed(1) || 'N/A'} ({startup.total_ratings})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span>{startup.views} views</span>
                  </div>
                </div>

                {/* Funding Info */}
                {startup.funding_amount && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800 text-sm">Funding: {startup.funding_amount}</span>
                    </div>
                    {startup.valuation && (
                      <p className="text-xs text-green-700">Valued at {startup.valuation}</p>
                    )}
                  </div>
                )}

                {/* Tags */}
                {startup.tags_list && startup.tags_list.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {startup.tags_list.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {startup.tags_list.length > 3 && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          +{startup.tags_list.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleLike(startup.id, startup.is_liked);
                      }}
                      disabled={likingStates[startup.id]}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        startup.is_liked
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
                      } disabled:opacity-50`}
                    >
                      {likingStates[startup.id] ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Heart className={`w-4 h-4 ${startup.is_liked ? 'fill-current' : ''}`} />
                      )}
                      <span>{startup.total_likes || 0}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleBookmark(startup.id, startup.is_bookmarked);
                      }}
                      disabled={bookmarkingStates[startup.id]}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        startup.is_bookmarked
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      } disabled:opacity-50`}
                    >
                      {bookmarkingStates[startup.id] ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : startup.is_bookmarked ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                      <span className="text-xs">{startup.is_bookmarked ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>

                  <div className="text-xs text-gray-500">
                    View Details
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Loading State */}
        {loading && startups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600 mb-4"></div>
            <p className="text-gray-600">Discovering amazing startups...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && startups.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 max-w-md mx-auto">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No startups found</h3>
              <p className="text-gray-600 mb-6">We couldn't find any startups matching your criteria. Try adjusting your search or filters.</p>
              <div className="space-y-3">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear all filters
                </button>
                <button
                  onClick={() => handleSearch('')}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Browse all startups
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {hasNextPage && !loading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Load More Startups</span>
              <span className="px-2 py-1 bg-white/20 rounded-full text-sm">
                {startups.length} of {totalResults}
              </span>
            </button>
          </div>
        )}

        {/* Loading More Indicator */}
        {loading && startups.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-3 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600"></div>
              <span className="text-gray-600">Loading more startups...</span>
            </div>
          </div>
        )}


      </div>

      {/* Custom CSS for line clamp */}
      <style jsx>{`
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

export default Startups;
