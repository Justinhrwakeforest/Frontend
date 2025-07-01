// src/components/Startups.js - Enhanced Production-Ready Version
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  AlertCircle, Plus, Upload, ExternalLink, TrendingDown,
  Activity, BarChart3, Clock, CheckCircle, Shield, X,
  ChevronDown, Filter as FilterIcon, SortAsc, SortDesc
} from 'lucide-react';

const Startups = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filterOptions, setFilterOptions] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('-created_at');
  const [bookmarkingStates, setBookmarkingStates] = useState({});
  const [likingStates, setLikingStates] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const [isMobile, setIsMobile] = useState(false);
  
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

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const handleSearch = useCallback((searchTerm) => {
    updateFilters({ search: searchTerm });
  }, [updateFilters]);

  const handleFilterChange = useCallback((filterKey, value) => {
    updateFilters({ [filterKey]: value });
  }, [updateFilters]);

  const handleSortChange = useCallback((newSortBy) => {
    setSortBy(newSortBy);
    updateFilters({ ordering: newSortBy });
  }, [updateFilters]);

  const handleBookmark = useCallback(async (startupId, currentBookmarkState) => {
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
    } finally {
      setBookmarkingStates(prev => ({ ...prev, [startupId]: false }));
    }
  }, [bookmarkingStates, updateResults]);

  const handleLike = useCallback(async (startupId, currentLikeState) => {
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
    } finally {
      setLikingStates(prev => ({ ...prev, [startupId]: false }));
    }
  }, [likingStates, updateResults]);

  const filterLabels = useMemo(() => ({
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
  }), []);

  const sortOptions = useMemo(() => [
    { value: '-created_at', label: 'Newest First', icon: Calendar },
    { value: 'created_at', label: 'Oldest First', icon: Calendar },
    { value: 'name', label: 'Name A-Z', icon: Target },
    { value: '-name', label: 'Name Z-A', icon: Target },
    { value: '-views', label: 'Most Popular', icon: Eye },
    { value: '-employee_count', label: 'Largest Companies', icon: Users },
    { value: 'employee_count', label: 'Smallest Companies', icon: Users },
    { value: '-average_rating', label: 'Highest Rated', icon: Star }
  ], []);

  // Memoized startup card component for better performance
  const StartupCard = React.memo(({ startup, onBookmark, onLike, bookmarkLoading, likeLoading }) => (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {/* Cover Image */}
      {startup.cover_image_display_url && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={startup.cover_image_display_url}
            alt={`${startup.name} cover`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* Badges overlay */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {startup.is_featured && (
              <span className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                <Crown className="w-3 h-3 inline mr-1" />
                Featured
              </span>
            )}
            {startup.is_claimed && startup.claim_verified && (
              <span className="px-3 py-1.5 bg-gradient-to-r from-green-400 to-green-500 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                <Shield className="w-3 h-3 inline mr-1" />
                Verified
              </span>
            )}
          </div>

          {/* Action buttons overlay */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onBookmark(startup.id, startup.is_bookmarked);
              }}
              disabled={bookmarkLoading}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                startup.is_bookmarked
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white/90 text-gray-700 hover:bg-blue-500 hover:text-white shadow-md'
              } disabled:opacity-50`}
            >
              {bookmarkLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : startup.is_bookmarked ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onLike(startup.id, startup.is_liked);
              }}
              disabled={likeLoading}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                startup.is_liked
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white shadow-md'
              } disabled:opacity-50`}
            >
              {likeLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Heart className={`w-4 h-4 ${startup.is_liked ? 'fill-current' : ''}`} />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {!startup.cover_image_display_url && (
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-sm flex items-center justify-center text-white text-xl font-bold">
                {startup.logo}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                  {startup.name}
                </h3>
                {!startup.cover_image_display_url && startup.is_featured && (
                  <Crown className="w-4 h-4 text-amber-500 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                  {startup.industry_name}
                </span>
                {startup.funding_amount && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full border border-green-200">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {startup.funding_amount}
                  </span>
                )}
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {startup.description}
        </p>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{startup.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{startup.employee_count}+ people</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Star className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>
              {startup.average_rating?.toFixed(1) || 'N/A'} ({startup.total_ratings})
            </span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Eye className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{startup.views} views</span>
          </div>
        </div>

        {/* Tags */}
        {startup.tags_list && startup.tags_list.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {startup.tags_list.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md border border-gray-200 hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
              {startup.tags_list.length > 3 && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
                  +{startup.tags_list.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Heart className={`w-4 h-4 ${startup.is_liked ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
              <span className="font-medium">{startup.total_likes || 0}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Bookmark className={`w-4 h-4 ${startup.is_bookmarked ? 'text-blue-500' : 'text-gray-400'}`} />
              <span className="font-medium">{startup.total_bookmarks || 0}</span>
            </div>
          </div>

          <div className="flex items-center text-xs text-gray-500 font-medium">
            <span>View Details</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </div>
        </div>
      </div>
    </div>
  ));

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Startups</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* Hero Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                  <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                  Discover <span className="text-blue-600">Startups</span>
                </h1>
              </div>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
                Explore innovative companies and connect with the future of business
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg mx-auto">
                <Link
                  to="/startups/new"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Submit Your Startup
                </Link>
                <button
                  onClick={() => window.open('/startup-guide', '_blank')}
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:border-blue-300 hover:text-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Award className="w-5 h-5 mr-2" />
                  Startup Guide
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
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

          {/* Filter Controls */}
          <div className="space-y-4">
            {/* Control Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
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
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl">
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <Building className="w-4 h-4" />
                        <span className="hidden sm:inline">
                          {totalResults.toLocaleString()} startup{totalResults !== 1 ? 's' : ''} found
                        </span>
                        <span className="sm:hidden">
                          {totalResults.toLocaleString()} found
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-gray-700 hidden sm:block">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-3 py-2 sm:py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-0"
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
                  
                  {/* Industry Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Industry</label>
                    <select
                      value={filters.industry || ''}
                      onChange={(e) => handleFilterChange('industry', e.target.value || null)}
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <div className="mt-6 flex flex-wrap gap-4">
                  <label className="flex items-center space-x-3 p-3 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.featured === 'true'}
                      onChange={(e) => handleFilterChange('featured', e.target.checked ? 'true' : null)}
                      className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-amber-700">Featured only</span>
                  </label>

                  <label className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.has_funding === 'true'}
                      onChange={(e) => handleFilterChange('has_funding', e.target.checked ? 'true' : null)}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                    />
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-700">Has funding</span>
                  </label>

                  <label className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.claimed === 'true'}
                      onChange={(e) => handleFilterChange('claimed', e.target.checked ? 'true' : null)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-700">Verified only</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Results Grid */}
          {startups.length > 0 ? (
            <div className={`${
              viewMode === 'grid' 
                ? `grid gap-6 ${
                    isMobile 
                      ? 'grid-cols-1' 
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
                  }` 
                : 'space-y-4'
            }`}>
              {startups.map((startup) => (
                <Link
                  key={startup.id}
                  to={`/startups/${startup.id}`}
                  className="block"
                >
                  <StartupCard
                    startup={startup}
                    onBookmark={handleBookmark}
                    onLike={handleLike}
                    bookmarkLoading={bookmarkingStates[startup.id]}
                    likeLoading={likingStates[startup.id]}
                  />
                </Link>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12 text-center">
              {loading ? (
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-blue-600"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 animate-ping"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Discovering amazing startups...</h3>
                  <p className="text-gray-600">Please wait while we find the perfect matches for you</p>
                </div>
              ) : (
                <div>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No startups found</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                    We couldn't find any startups matching your criteria. Try adjusting your search or filters to discover more companies.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                    <button
                      onClick={resetFilters}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                    >
                      Clear all filters
                    </button>
                    <button
                      onClick={() => handleSearch('')}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                    >
                      Browse all startups
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Load More Button */}
          {hasNextPage && !loading && (
            <div className="flex justify-center">
              <button
                onClick={loadMore}
                className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium transform hover:-translate-y-1"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Load More Startups</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {startups.length} of {totalResults}
                </span>
              </button>
            </div>
          )}

          {/* Loading More Indicator */}
          {loading && startups.length > 0 && (
            <div className="flex justify-center">
              <div className="flex items-center space-x-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-blue-600"></div>
                <span className="text-gray-600 font-medium">Loading more startups...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS for line clamp */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @media (max-width: 640px) {
          .line-clamp-2 {
            -webkit-line-clamp: 3;
          }
        }
      `}</style>
    </div>
  );
};

export default Startups;
