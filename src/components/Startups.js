// src/components/Startups.js - Ultra-modern enhanced UI with glassmorphism
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
  SlidersHorizontal, RefreshCw, Flame, Rocket, Crown
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Startups</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/30">
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-2xl shadow-lg">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Discover Startups
                </h1>
                <p className="text-gray-600 text-lg mt-1">Find innovative companies changing the world</p>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/40">
                <div className="text-2xl font-bold text-blue-600">{totalResults.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Startups</div>
              </div>
              <div className="text-center p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/40">
                <div className="text-2xl font-bold text-green-600">{Object.keys(filters).length}</div>
                <div className="text-sm text-gray-600">Active Filters</div>
              </div>
              <div className="text-center p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/40">
                <div className="text-2xl font-bold text-purple-600">{filterOptions?.industries?.length || 0}</div>
                <div className="text-sm text-gray-600">Industries</div>
              </div>
              <div className="text-center p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/40">
                <div className="text-2xl font-bold text-orange-600">{filterOptions?.locations?.length || 0}</div>
                <div className="text-sm text-gray-600">Locations</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="mb-8">
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/30 relative z-20">
            <SearchBar
              value={filters.search || ''}
              onChange={handleSearch}
              onClear={() => handleSearch('')}
              placeholder="Search startups, industries, locations..."
              loading={loading}
              className="w-full relative z-30"
              showRecentSearches={true}
              showTrendingSearches={true}
            />
          </div>
        </div>

        {/* Enhanced Filter Controls */}
        <div className="mb-8 space-y-6">
          {/* Control Bar */}
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/30 relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg relative z-10 ${
                    showFilters 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/25' 
                      : 'bg-white/60 text-gray-700 hover:bg-white/80 border border-white/40'
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5 mr-2" />
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
                    className={`p-3 rounded-xl transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'bg-white/60 text-gray-600 hover:bg-white/80'
                    }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-xl transition-all ${
                      viewMode === 'list' 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'bg-white/60 text-gray-600 hover:bg-white/80'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-xl">
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

              {/* Enhanced Sort Dropdown */}
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-4 py-3 text-sm bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/30 relative z-10">
              <FilterChips
                filters={filters}
                onRemoveFilter={removeFilter}
                onClearAll={resetFilters}
                filterLabels={filterLabels}
              />
            </div>
          )}

          {/* Enhanced Advanced Filters Panel */}
          {showFilters && filterOptions && (
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/30 relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                  <Filter className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Advanced Filters</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Industry Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    <Globe className="w-4 h-4 mr-1" />
                    Industry
                  </label>
                  <select
                    value={filters.industry || ''}
                    onChange={(e) => handleFilterChange('industry', e.target.value || null)}
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Location
                  </label>
                  <select
                    value={filters.location || ''}
                    onChange={(e) => handleFilterChange('location', e.target.value || null)}
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Company Size
                  </label>
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
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Minimum Rating
                  </label>
                  <select
                    value={filters.min_rating || ''}
                    onChange={(e) => handleFilterChange('min_rating', e.target.value || null)}
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
              <div className="mt-8 flex flex-wrap gap-6">
                <label className="flex items-center space-x-3 p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/40 hover:bg-white/60 transition-all cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.featured === 'true'}
                    onChange={(e) => handleFilterChange('featured', e.target.checked ? 'true' : null)}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Crown className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">Featured only</span>
                </label>

                <label className="flex items-center space-x-3 p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/40 hover:bg-white/60 transition-all cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.has_funding === 'true'}
                    onChange={(e) => handleFilterChange('has_funding', e.target.checked ? 'true' : null)}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">Has funding</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Results Grid */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
            : 'space-y-6'
        }`}>
          {startups.map((startup, index) => (
            <Link
              key={startup.id}
              to={`/startups/${startup.id}`}
              className="group block bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/30 hover:border-white/50 transform hover:-translate-y-2 cursor-pointer"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative">
                    <div className="text-4xl p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110">
                      {startup.logo}
                    </div>
                    {startup.is_featured && (
                      <div className="absolute -top-2 -right-2 p-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                        <Crown className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {startup.name}
                      </h3>
                      {startup.is_featured && (
                        <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                        {startup.industry_name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-400 group-hover:text-blue-600 transition-colors">
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-gray-700 text-sm mb-6 line-clamp-3 leading-relaxed">{startup.description}</p>
                
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2 p-3 bg-white/40 backdrop-blur-sm rounded-xl">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">{startup.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-white/40 backdrop-blur-sm rounded-xl">
                    <Users className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">{startup.employee_count} employees</span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-white/40 backdrop-blur-sm rounded-xl">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-700">
                      {startup.average_rating?.toFixed(1) || 'N/A'} ({startup.total_ratings})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-white/40 backdrop-blur-sm rounded-xl">
                    <Eye className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700">{startup.views} views</span>
                  </div>
                </div>

                {/* Funding Info */}
                {startup.funding_amount && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 rounded-xl border border-green-100/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Funding: {startup.funding_amount}</span>
                    </div>
                    {startup.valuation && (
                      <p className="text-sm text-green-700">Valued at {startup.valuation}</p>
                    )}
                  </div>
                )}

                {/* Tags */}
                {startup.tags_list && startup.tags_list.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {startup.tags_list.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 transition-all"
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
                <div className="flex items-center justify-between pt-4 border-t border-white/30">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleLike(startup.id, startup.is_liked);
                      }}
                      disabled={likingStates[startup.id]}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all transform hover:scale-105 ${
                        startup.is_liked
                          ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-red-500/25'
                          : 'bg-white/60 text-gray-700 hover:bg-red-50 hover:text-red-600 border border-white/40'
                      } disabled:opacity-50 shadow-lg`}
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
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all transform hover:scale-105 ${
                        startup.is_bookmarked
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-blue-500/25'
                          : 'bg-white/60 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-white/40'
                      } disabled:opacity-50 shadow-lg`}
                    >
                      {bookmarkingStates[startup.id] ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : startup.is_bookmarked ? (
                        <BookmarkCheck className="w-4 h-4 fill-current" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                      <span>{startup.is_bookmarked ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                    <TrendingUp className="w-4 h-4" />
                    <span>View Details</span>
                  </div>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </Link>
          ))}
        </div>

        {/* Enhanced Loading State */}
        {loading && startups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl px-8 py-6 border border-white/30">
              <p className="text-gray-600 font-medium text-lg mb-2">Discovering amazing startups...</p>
              <p className="text-gray-500 text-sm">This won't take long</p>
            </div>
          </div>
        )}

        {/* Enhanced Empty State */}
        {!loading && startups.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-12 border border-white/30 max-w-md mx-auto">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No startups found</h3>
              <p className="text-gray-600 mb-6">We couldn't find any startups matching your criteria. Try adjusting your search or filters.</p>
              <div className="space-y-3">
                <button
                  onClick={resetFilters}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg font-medium"
                >
                  Clear all filters
                </button>
                <button
                  onClick={() => handleSearch('')}
                  className="w-full px-6 py-3 bg-white/60 text-gray-700 rounded-xl hover:bg-white/80 transition-all border border-white/40 font-medium"
                >
                  Browse all startups
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Load More Button */}
        {hasNextPage && !loading && (
          <div className="flex justify-center mt-12">
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-2 border border-white/30">
              <button
                onClick={loadMore}
                className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg font-medium"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Load More Startups</span>
                <div className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {startups.length} of {totalResults}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Loading More Indicator */}
        {loading && startups.length > 0 && (
          <div className="flex justify-center mt-12">
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/30">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-200 border-t-blue-600"></div>
                <span className="text-gray-600 font-medium">Loading more startups...</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats Footer */}
        <div className="mt-16 bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/30">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Award className="w-6 h-6 mr-2 text-yellow-500" />
              Platform Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{totalResults.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Startups</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {startups.filter(s => s.is_featured).length}
                </div>
                <div className="text-sm text-gray-600">Featured Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {startups.filter(s => s.funding_amount).length}
                </div>
                <div className="text-sm text-gray-600">Funded Startups</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {Math.round(startups.reduce((acc, s) => acc + (s.average_rating || 0), 0) / startups.length * 10) / 10 || 0}
                </div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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

export default Startups;
