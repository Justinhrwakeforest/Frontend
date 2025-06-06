// src/components/StartupDetail.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { 
  MapPin, Users, DollarSign, Calendar, Globe, Star, Heart, Bookmark, 
  MessageCircle, TrendingUp, Award, Briefcase, ArrowLeft, ExternalLink,
  Building, Target, BarChart3, Eye, ChevronRight
} from 'lucide-react';

const StartupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    fetchStartupDetail();
  }, [id]);

  const fetchStartupDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/startups/${id}/`);
      setStartup(response.data);
      setUserRating(response.data.user_rating || 0);
    } catch (error) {
      console.error('Error fetching startup detail:', error);
      setError('Failed to load startup details');
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (rating) => {
    if (!isAuthenticated) {
      alert('Please log in to rate this startup');
      return;
    }

    if (submittingRating) return;

    setSubmittingRating(true);
    try {
      const response = await axios.post(`http://localhost:8000/api/startups/${id}/rate/`, {
        rating: rating
      });
      
      setUserRating(rating);
      setStartup(prev => ({
        ...prev,
        average_rating: response.data.average_rating,
        total_ratings: response.data.total_ratings,
        user_rating: rating
      }));
    } catch (error) {
      console.error('Error rating startup:', error);
      alert('Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('Please log in to like this startup');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8000/api/startups/${id}/like/`);
      setStartup(prev => ({
        ...prev,
        is_liked: response.data.liked,
        total_likes: response.data.total_likes
      }));
    } catch (error) {
      console.error('Error liking startup:', error);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      alert('Please log in to bookmark this startup');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8000/api/startups/${id}/bookmark/`);
      setStartup(prev => ({
        ...prev,
        is_bookmarked: response.data.bookmarked,
        total_bookmarks: response.data.total_bookmarks
      }));
    } catch (error) {
      console.error('Error bookmarking startup:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to comment');
      return;
    }

    if (!comment.trim() || submittingComment) return;

    setSubmittingComment(true);
    try {
      const response = await axios.post(`http://localhost:8000/api/startups/${id}/comment/`, {
        text: comment
      });
      
      // Add new comment to the beginning of the list
      setStartup(prev => ({
        ...prev,
        recent_comments: [response.data.comment, ...prev.recent_comments.slice(0, 9)],
        total_comments: prev.total_comments + 1
      }));
      
      setComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const StarRating = ({ rating, onRate, interactive = false, size = 'w-5 h-5' }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRate && onRate(star)}
            disabled={!interactive || submittingRating}
            className={`${size} ${
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
            } ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            <Star fill="currentColor" />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading startup details...</p>
        </div>
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ {error || 'Startup not found'}</div>
          <button 
            onClick={() => navigate('/startups')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Startups
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building },
    { id: 'jobs', label: `Jobs (${startup.open_jobs?.length || 0})`, icon: Briefcase },
    { id: 'team', label: `Team (${startup.founders?.length || 0})`, icon: Users },
    { id: 'metrics', label: 'Metrics', icon: BarChart3 },
    { id: 'reviews', label: `Reviews (${startup.total_ratings})`, icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBookmark}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  startup.is_bookmarked
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Bookmark className={`w-4 h-4 mr-2 ${startup.is_bookmarked ? 'fill-current' : ''}`} />
                {startup.is_bookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
              
              <button
                onClick={handleLike}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  startup.is_liked
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-4 h-4 mr-2 ${startup.is_liked ? 'fill-current' : ''}`} />
                {startup.total_likes}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Startup Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start space-x-6 mb-6 lg:mb-0">
              <div className="text-6xl">{startup.logo}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{startup.name}</h1>
                  {startup.is_featured && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      <Award className="w-4 h-4 inline mr-1" />
                      Featured
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {startup.industry_detail?.icon} {startup.industry_name}
                  </span>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {startup.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Eye className="w-4 h-4 mr-1" />
                    {startup.views.toLocaleString()} views
                  </div>
                </div>

                <p className="text-gray-700 text-lg mb-6 max-w-3xl">{startup.description}</p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{startup.employee_count}</div>
                    <div className="text-sm text-gray-600">Employees</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{startup.founded_year}</div>
                    <div className="text-sm text-gray-600">Founded</div>
                  </div>
                  {startup.funding_amount && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{startup.funding_amount}</div>
                      <div className="text-sm text-gray-600">Funding</div>
                    </div>
                  )}
                  {startup.valuation && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{startup.valuation}</div>
                      <div className="text-sm text-gray-600">Valuation</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rating & Actions */}
            <div className="lg:ml-8 lg:flex-shrink-0">
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="mb-4">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {startup.average_rating.toFixed(1)}
                  </div>
                  <StarRating rating={Math.round(startup.average_rating)} />
                  <div className="text-sm text-gray-600 mt-1">
                    {startup.total_ratings} reviews
                  </div>
                </div>

                {isAuthenticated && (
                  <div className="border-t pt-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Rate this startup</div>
                    <StarRating 
                      rating={userRating} 
                      onRate={handleRate}
                      interactive={true}
                      size="w-6 h-6"
                    />
                  </div>
                )}

                {startup.website && (
                  <a
                    href={startup.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Visit Website
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h3>
                    <div className="space-y-3">
                      {startup.revenue && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Revenue</span>
                          <span className="font-medium">{startup.revenue}</span>
                        </div>
                      )}
                      {startup.user_count && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Users</span>
                          <span className="font-medium">{startup.user_count}</span>
                        </div>
                      )}
                      {startup.growth_rate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Growth Rate</span>
                          <span className="font-medium text-green-600">{startup.growth_rate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {startup.tags_list?.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Similar Startups */}
                {startup.similar_startups?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Startups</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {startup.similar_startups.map((similar) => (
                        <Link
                          key={similar.id}
                          to={`/startups/${similar.id}`}
                          className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{similar.logo}</div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{similar.name}</h4>
                              <p className="text-sm text-gray-600">{similar.industry_name}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-gray-500">{similar.location}</span>
                                <StarRating rating={Math.round(similar.average_rating)} size="w-3 h-3" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Open Positions</h3>
                  <Link
                    to={`/jobs?startup=${startup.id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                  >
                    View All Jobs
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>

                {startup.open_jobs?.length > 0 ? (
                  <div className="space-y-4">
                    {startup.open_jobs.map((job) => (
                      <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h4>
                            <p className="text-gray-600 mb-4">{job.description}</p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {job.location}
                              </div>
                              <div className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                {job.salary_range}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {job.posted_ago}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                                {job.job_type_name}
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                {job.experience_level_display}
                              </span>
                              {job.is_remote && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                                  Remote
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <Link
                            to={`/jobs/${job.id}`}
                            className="ml-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            View Job
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Open Positions</h4>
                    <p className="text-gray-600">This startup doesn't have any open positions at the moment.</p>
                  </div>
                )}
              </div>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Meet the Team</h3>
                
                {startup.founders?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {startup.founders.map((founder) => (
                      <div key={founder.id} className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">👤</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900">{founder.name}</h4>
                            <p className="text-blue-600 font-medium mb-2">{founder.title}</p>
                            {founder.bio && (
                              <p className="text-gray-600">{founder.bio}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Team Information</h4>
                    <p className="text-gray-600">Team information is not available for this startup.</p>
                  </div>
                )}
              </div>
            )}

            {/* Metrics Tab */}
            {activeTab === 'metrics' && (
              <div className="space-y-8">
                <h3 className="text-lg font-semibold text-gray-900">Engagement Metrics</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-blue-50 rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-blue-600">{startup.total_likes}</div>
                    <div className="text-sm text-gray-600">Likes</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-green-600">{startup.total_bookmarks}</div>
                    <div className="text-sm text-gray-600">Bookmarks</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-purple-600">{startup.total_comments}</div>
                    <div className="text-sm text-gray-600">Comments</div>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{startup.views}</div>
                    <div className="text-sm text-gray-600">Views</div>
                  </div>
                </div>

                {startup.engagement_metrics && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">30-Day Activity</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{startup.engagement_metrics.recent_ratings}</div>
                        <div className="text-xs text-gray-600">New Ratings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{startup.engagement_metrics.recent_comments}</div>
                        <div className="text-xs text-gray-600">New Comments</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{startup.engagement_metrics.recent_likes}</div>
                        <div className="text-xs text-gray-600">New Likes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{startup.engagement_metrics.recent_bookmarks}</div>
                        <div className="text-xs text-gray-600">New Bookmarks</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Reviews & Comments</h3>
                  <div className="text-sm text-gray-600">
                    {startup.total_ratings} reviews • {startup.total_comments} comments
                  </div>
                </div>

                {/* Add Comment Form */}
                {isAuthenticated && (
                  <form onSubmit={handleComment} className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-medium text-gray-900 mb-3">Add a Comment</h4>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts about this startup..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                      maxLength={1000}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-500">{comment.length}/1000</span>
                      <button
                        type="submit"
                        disabled={!comment.trim() || submittingComment}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submittingComment ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Recent Comments */}
                <div className="space-y-4">
                  {startup.recent_comments?.length > 0 ? (
                    startup.recent_comments.map((comment) => (
                      <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {comment.user_first_name?.charAt(0) || comment.user_name?.charAt(0) || '?'}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {comment.user_first_name || comment.user_name}
                              </div>
                              <div className="text-sm text-gray-500">{comment.time_ago}</div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No Comments Yet</h4>
                      <p className="text-gray-600">Be the first to share your thoughts about this startup!</p>
                    </div>
                  )}
                </div>

                {/* Recent Ratings */}
                {startup.recent_ratings?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Recent Ratings</h4>
                    <div className="space-y-3">
                      {startup.recent_ratings.map((rating) => (
                        <div key={rating.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {rating.user_first_name?.charAt(0) || rating.user_name?.charAt(0) || '?'}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {rating.user_first_name || rating.user_name}
                              </div>
                              <div className="text-sm text-gray-500">{rating.time_ago}</div>
                            </div>
                          </div>
                          <StarRating rating={rating.rating} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupDetail;
