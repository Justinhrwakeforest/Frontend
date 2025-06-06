// First, create src/components/StartupDetail.js with the correct import case-sensitivity

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

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
            ⭐
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
    { id: 'overview', label: 'Overview', icon: '🏢' },
    { id: 'jobs', label: `Jobs (${startup.open_jobs?.length || 0})`, icon: '💼' },
    { id: 'team', label: `Team (${startup.founders?.length || 0})`, icon: '👥' },
    { id: 'metrics', label: 'Metrics', icon: '📊' },
    { id: 'reviews', label: `Reviews (${startup.total_ratings})`, icon: '⭐' },
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
              ← Back
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
                🔖 {startup.is_bookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
              
              <button
                onClick={handleLike}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  startup.is_liked
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                ❤️ {startup.total_likes}
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
                      🏆 Featured
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {startup.industry_detail?.icon} {startup.industry_name}
                  </span>
                  <div className="flex items-center text-gray-600">
                    📍 {startup.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    👁️ {startup.views.toLocaleString()} views
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
                    {startup.average_rating?.toFixed(1) || 'N/A'}
                  </div>
                  <StarRating rating={Math.round(startup.average_rating || 0)} />
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
                    🌐 Visit Website →
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
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
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
              </div>
            )}

            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Open Positions</h3>
                {startup.open_jobs?.length > 0 ? (
                  <div className="space-y-4">
                    {startup.open_jobs.map((job) => (
                      <div key={job.id} className="border border-gray-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h4>
                        <p className="text-gray-600 mb-4">{job.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>📍 {job.location}</span>
                          <span>💰 {job.salary_range}</span>
                          <span>⏰ {job.posted_ago}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No open positions available.</p>
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
                        <h4 className="text-lg font-semibold text-gray-900">{founder.name}</h4>
                        <p className="text-blue-600 font-medium mb-2">{founder.title}</p>
                        {founder.bio && <p className="text-gray-600">{founder.bio}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No team information available.</p>
                )}
              </div>
            )}

            {/* Metrics Tab */}
            {activeTab === 'metrics' && (
              <div className="space-y-8">
                <h3 className="text-lg font-semibold text-gray-900">Engagement Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-blue-50 rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-blue-600">{startup.total_likes || 0}</div>
                    <div className="text-sm text-gray-600">Likes</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-green-600">{startup.total_bookmarks || 0}</div>
                    <div className="text-sm text-gray-600">Bookmarks</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-purple-600">{startup.total_comments || 0}</div>
                    <div className="text-sm text-gray-600">Comments</div>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{startup.views}</div>
                    <div className="text-sm text-gray-600">Views</div>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Reviews & Comments</h3>

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
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {submittingComment ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Comments */}
                <div className="space-y-4">
                  {startup.recent_comments?.length > 0 ? (
                    startup.recent_comments.map((comment) => (
                      <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center space-x-3 mb-3">
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
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupDetail;
