// src/components/Activity.js - Complete Activity Component
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { 
  Activity as ActivityIcon, Star, MessageCircle, Heart, 
  Bookmark, Calendar, Clock, Building, Filter,
  TrendingUp, Award, Target, ChevronRight, Briefcase,
  RefreshCw, Users, MapPin, ExternalLink, Grid,
  List, Eye, Download, Search
} from 'lucide-react';

const Activity = () => {
  const { user } = useContext(AuthContext);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/auth/activity/');
      setActivity(response.data);
      console.log('Activity data loaded:', response.data);
    } catch (error) {
      console.error('Error fetching activity:', error);
      // Set empty activity if error
      setActivity({
        recent_ratings: [],
        recent_comments: [],
        bookmarked_startups: [],
        liked_startups: [],
        job_applications: [],
        activity_counts: {
          total_ratings: 0,
          total_comments: 0,
          total_bookmarks: 0,
          total_likes: 0,
          total_applications: 0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshActivity = async () => {
    setRefreshing(true);
    await fetchActivity();
    setRefreshing(false);
  };

  const exportActivity = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/auth/export-data/');
      const blob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: 'application/json'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting activity:', error);
      alert('Failed to export activity data.');
    }
  };

  const getActivityItems = () => {
    if (!activity) return [];

    const items = [];

    // Add ratings
    if (activity.recent_ratings) {
      activity.recent_ratings.forEach(rating => {
        items.push({
          id: `rating-${rating.startup_id}-${rating.created_at}`,
          type: 'rating',
          icon: Star,
          iconColor: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Rated a startup',
          description: `Gave ${rating.rating} star${rating.rating !== 1 ? 's' : ''} to ${rating.startup_name}`,
          startup: {
            id: rating.startup_id,
            name: rating.startup_name,
            logo: rating.startup_logo,
            location: rating.startup_location,
            industry: rating.startup_industry
          },
          timestamp: rating.created_at,
          metadata: { rating: rating.rating }
        });
      });
    }

    // Add comments
    if (activity.recent_comments) {
      activity.recent_comments.forEach(comment => {
        items.push({
          id: `comment-${comment.startup_id}-${comment.created_at}`,
          type: 'comment',
          icon: MessageCircle,
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          title: 'Commented on a startup',
          description: comment.text,
          startup: {
            id: comment.startup_id,
            name: comment.startup_name,
            logo: comment.startup_logo,
            location: comment.startup_location
          },
          timestamp: comment.created_at
        });
      });
    }

    // Add bookmarks
    if (activity.bookmarked_startups) {
      activity.bookmarked_startups.forEach(bookmark => {
        items.push({
          id: `bookmark-${bookmark.startup_id}-${bookmark.created_at}`,
          type: 'bookmark',
          icon: Bookmark,
          iconColor: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Bookmarked a startup',
          description: `Saved ${bookmark.startup_name} to bookmarks`,
          startup: {
            id: bookmark.startup_id,
            name: bookmark.startup_name,
            logo: bookmark.startup_logo,
            location: bookmark.startup_location,
            industry: bookmark.startup_industry,
            description: bookmark.startup_description,
            employee_count: bookmark.startup_employee_count,
            funding_amount: bookmark.startup_funding_amount
          },
          timestamp: bookmark.created_at
        });
      });
    }

    // Add likes
    if (activity.liked_startups) {
      activity.liked_startups.forEach(like => {
        items.push({
          id: `like-${like.startup_id}-${like.created_at}`,
          type: 'like',
          icon: Heart,
          iconColor: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Liked a startup',
          description: `Liked ${like.startup_name}`,
          startup: {
            id: like.startup_id,
            name: like.startup_name,
            logo: like.startup_logo,
            location: like.startup_location
          },
          timestamp: like.created_at
        });
      });
    }

    // Add job applications
    if (activity.job_applications) {
      activity.job_applications.forEach(application => {
        items.push({
          id: `application-${application.job_id}-${application.applied_at}`,
          type: 'application',
          icon: Briefcase,
          iconColor: 'text-purple-500',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          title: 'Applied for a job',
          description: `Applied for ${application.job_title} at ${application.startup_name}`,
          startup: {
            id: application.startup_id,
            name: application.startup_name,
            logo: application.startup_logo
          },
          job: {
            id: application.job_id,
            title: application.job_title
          },
          timestamp: application.applied_at,
          metadata: { 
            status: application.status,
            status_display: application.status_display
          }
        });
      });
    }

    // Sort by timestamp (newest first)
    return items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const filteredActivity = getActivityItems().filter(item => {
    // Filter by type
    if (filterType !== 'all' && item.type !== filterType) {
      return false;
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesTitle = item.title.toLowerCase().includes(searchLower);
      const matchesDescription = item.description.toLowerCase().includes(searchLower);
      const matchesStartupName = item.startup.name.toLowerCase().includes(searchLower);
      
      if (!matchesTitle && !matchesDescription && !matchesStartupName) {
        return false;
      }
    }

    // Filter by time range
    if (timeRange !== 'all') {
      const itemDate = new Date(item.timestamp);
      const now = new Date();
      const diffTime = now - itemDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (timeRange) {
        case 'today':
          return diffDays <= 1;
        case 'week':
          return diffDays <= 7;
        case 'month':
          return diffDays <= 30;
        default:
          return true;
      }
    }

    return true;
  });

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 30) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getActivityStats = () => {
    if (!activity || !activity.activity_counts) {
      return {
        total: 0,
        ratings: 0,
        comments: 0,
        bookmarks: 0,
        likes: 0,
        applications: 0
      };
    }

    const counts = activity.activity_counts;
    return {
      total: counts.total_ratings + counts.total_comments + counts.total_bookmarks + counts.total_likes + counts.total_applications,
      ratings: counts.total_ratings,
      comments: counts.total_comments,
      bookmarks: counts.total_bookmarks,
      likes: counts.total_likes,
      applications: counts.total_applications
    };
  };

  const stats = getActivityStats();

  const ActivityCard = ({ item }) => {
    const IconComponent = item.icon;
    
    return (
      <div className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border ${item.borderColor || 'border-gray-200'}`}>
        <div className="flex items-start space-x-4">
          <div className={`flex-shrink-0 w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center`}>
            <IconComponent className={`w-6 h-6 ${item.iconColor}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                  {item.type}
                </span>
                {item.metadata?.status && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    item.metadata.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    item.metadata.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    item.metadata.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {item.metadata.status_display}
                  </span>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {formatTimestamp(item.timestamp)}
              </div>
            </div>
            
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">{item.startup.logo}</span>
              <div>
                <Link
                  to={`/startups/${item.startup.id}`}
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {item.startup.name}
                </Link>
                {item.startup.location && (
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {item.startup.location}
                    {item.startup.industry && (
                      <>
                        <span className="mx-1">•</span>
                        {item.startup.industry}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-3">
              {item.type === 'rating' && item.metadata?.rating && (
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < item.metadata.rating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    ({item.metadata.rating} star{item.metadata.rating !== 1 ? 's' : ''})
                  </span>
                </div>
              )}
              
              {item.type === 'comment' && (
                <div className="bg-gray-50 rounded-lg p-3 mt-2">
                  <p className="text-sm text-gray-700 italic">"{item.description}"</p>
                </div>
              )}
              
              {item.type === 'bookmark' && item.startup.description && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 line-clamp-2">{item.startup.description}</p>
                  {item.startup.employee_count && (
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {item.startup.employee_count} employees
                      </span>
                      {item.startup.funding_amount && (
                        <span className="flex items-center">
                          💰 {item.startup.funding_amount}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {(item.type === 'like' || (item.type === 'application' && !item.startup.description)) && (
                <p className="text-sm text-gray-600">{item.description}</p>
              )}

              {item.type === 'application' && item.job && (
                <div className="mt-2 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-900">Job: {item.job.title}</p>
                  <p className="text-xs text-purple-700 mt-1">Status: {item.metadata.status_display}</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <Link
                to={`/startups/${item.startup.id}`}
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                View Startup
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
              
              <div className="text-xs text-gray-500">
                {new Date(item.timestamp).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your activity...</p>
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
                <ActivityIcon className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">Your Activity</h1>
              </div>
              <p className="text-gray-600">Track your interactions and engagement on StartupHub</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={exportActivity}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button
                onClick={refreshActivity}
                disabled={refreshing}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Activity</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ratings</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.ratings}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Comments</p>
                <p className="text-2xl font-bold text-blue-600">{stats.comments}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bookmarks</p>
                <p className="text-2xl font-bold text-green-600">{stats.bookmarks}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Bookmark className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Likes</p>
                <p className="text-2xl font-bold text-red-600">{stats.likes}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-purple-600">{stats.applications}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search activity..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Activity Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Activity</option>
                <option value="rating">Ratings</option>
                <option value="comment">Comments</option>
                <option value="bookmark">Bookmarks</option>
                <option value="like">Likes</option>
                <option value="application">Job Applications</option>
              </select>
              
              {/* Time Range Filter */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {filteredActivity.length} {filteredActivity.length === 1 ? 'activity' : 'activities'} found
              </div>
              
              {/* View Mode Toggle */}
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
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Activity Feed</h2>
          </div>
          
          {filteredActivity.length > 0 ? (
            <div className={`p-6 ${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-6'
            }`}>
              {filteredActivity.map((item) => (
                <ActivityCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <ActivityIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filterType !== 'all' || timeRange !== 'all' || searchTerm ? 'No matching activity' : 'No activity yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {filterType !== 'all' || timeRange !== 'all' || searchTerm
                  ? 'Try adjusting your filters to see more activities.'
                  : 'Start exploring startups to see your activity here.'}
              </p>
              
              {filterType !== 'all' || timeRange !== 'all' || searchTerm ? (
                <button
                  onClick={() => {
                    setFilterType('all');
                    setTimeRange('all');
                    setSearchTerm('');
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
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

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/startups"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Discover Startups</h3>
                <p className="text-sm text-gray-600">Find new companies to explore</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/jobs"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-green-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Browse Jobs</h3>
                <p className="text-sm text-gray-600">Find your next opportunity</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/bookmarks"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-purple-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Bookmark className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">View Bookmarks</h3>
                <p className="text-sm text-gray-600">Check your saved startups</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Activity;
