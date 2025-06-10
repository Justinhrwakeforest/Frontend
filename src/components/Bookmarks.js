// src/components/Bookmarks.js - Fixed version
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { 
  Bookmark, MapPin, Star, Building, Users, 
  Calendar, ExternalLink, Search, Filter,
  Grid, List, X, Heart, MessageCircle
} from 'lucide-react';

const Bookmarks = () => {
  const { user } = useContext(AuthContext);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    fetchBookmarks();
    fetchIndustries();
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      // Fetch all startups and filter bookmarked ones on frontend
      // In a real app, you'd have a dedicated bookmarks endpoint
      const response = await axios.get('http://localhost:8000/api/startups/');
      const allStartups = response.data.results || [];
      
      // Filter only bookmarked startups
      const bookmarkedStartups = allStartups.filter(startup => startup.is_bookmarked);
      setBookmarks(bookmarkedStartups);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIndustries = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/startups/industries/');
      setIndustries(response.data || []);
    } catch (error) {
      console.error('Error fetching industries:', error);
      setIndustries([]); // Set empty array on error
    }
  };

  const removeBookmark = async (startupId) => {
    try {
      await axios.post(`http://localhost:8000/api/startups/${startupId}/bookmark/`);
      setBookmarks(bookmarks.filter(b => b.id !== startupId));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const filteredBookmarks = bookmarks.filter(startup => {
    const matchesSearch = startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         startup.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !filterIndustry || startup.industry_name === filterIndustry;
    return matchesSearch && matchesIndustry;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookmarks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Bookmark className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Your Bookmarks</h1>
          </div>
          <p className="text-gray-600">
            {bookmarks.length} {bookmarks.length === 1 ? 'startup' : 'startups'} saved
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search your bookmarks..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Industry Filter */}
              <select
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Industries</option>
                {Array.isArray(industries) && industries.map(industry => (
                  <option key={industry.id} value={industry.name}>
                    {industry.icon} {industry.name}
                  </option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
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
            </div>
          </div>
        </div>

        {/* Bookmarks Display */}
        {filteredBookmarks.length > 0 ? (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
          }`}>
            {filteredBookmarks.map((startup) => (
              viewMode === 'grid' ? (
                // Grid View
                <div
                  key={startup.id}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{startup.logo}</span>
                      <div>
                        <Link
                          to={`/startups/${startup.id}`}
                          className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {startup.name}
                        </Link>
                        <p className="text-sm text-gray-600">{startup.industry_name}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeBookmark(startup.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove bookmark"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{startup.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {startup.location}
                      </span>
                      <span className="flex items-center text-gray-500">
                        <Users className="w-3 h-3 mr-1" />
                        {startup.employee_count} employees
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{startup.average_rating?.toFixed(1) || 'N/A'}</span>
                        <span className="text-xs text-gray-500">({startup.total_ratings} reviews)</span>
                      </div>
                      {startup.funding_amount && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                          {startup.funding_amount}
                        </span>
                      )}
                    </div>

                    {startup.tags_list && startup.tags_list.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {startup.tags_list.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {startup.tags_list.length > 3 && (
                          <span className="text-xs text-gray-500">+{startup.tags_list.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      to={`/startups/${startup.id}`}
                      className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                    >
                      View Details
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Link>
                    <div className="flex items-center space-x-3 text-gray-500">
                      <span className="flex items-center text-xs">
                        <Heart className="w-3 h-3 mr-1" />
                        {startup.total_likes || 0}
                      </span>
                      <span className="flex items-center text-xs">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {startup.total_comments || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                // List View
                <div
                  key={startup.id}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300"
                >
                  <div className="flex items-center space-x-6">
                    <span className="text-4xl flex-shrink-0">{startup.logo}</span>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <Link
                          to={`/startups/${startup.id}`}
                          className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate"
                        >
                          {startup.name}
                        </Link>
                        <button
                          onClick={() => removeBookmark(startup.id)}
                          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-4"
                          title="Remove bookmark"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          {startup.industry_name}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {startup.location}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {startup.employee_count} employees
                        </span>
                        <span className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                          {startup.average_rating?.toFixed(1) || 'N/A'} ({startup.total_ratings})
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-3 line-clamp-2">{startup.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {startup.funding_amount && (
                            <span className="text-sm bg-green-100 text-green-600 px-2 py-1 rounded-full">
                              {startup.funding_amount}
                            </span>
                          )}
                          {startup.is_featured && (
                            <span className="text-sm bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        
                        <Link
                          to={`/startups/${startup.id}`}
                          className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                        >
                          View Details
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          // Empty State
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || filterIndustry ? 'No matching bookmarks' : 'No bookmarks yet'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || filterIndustry 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Start exploring startups and bookmark the ones that interest you.'}
            </p>
            {searchTerm || filterIndustry ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterIndustry('');
                }}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                to="/startups"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Explore Startups
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
