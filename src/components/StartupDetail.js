// src/components/StartupDetail.js - Fixed version
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { 
  ChevronLeft, MapPin, Users, Star, DollarSign, TrendingUp, 
  Briefcase, ExternalLink, Heart, Bookmark, MessageCircle, 
  Share2, ThumbsUp, Clock, Award, Building, Plus
} from "lucide-react";

export default function StartupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [submittingAction, setSubmittingAction] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchStartupDetail();
    }
  }, [id]);

  const fetchStartupDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/startups/${id}/`);
      const startupData = response.data;
      
      setStartup(startupData);
      setIsBookmarked(startupData.is_bookmarked || false);
      setIsLiked(startupData.is_liked || false);
      setUserRating(startupData.user_rating || 0);
      
      console.log('Startup data loaded:', startupData);
    } catch (error) {
      console.error('Error fetching startup detail:', error);
      if (error.response?.status === 404) {
        navigate('/startups');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (rating) => {
    if (submittingAction) return;
    
    setSubmittingAction(true);
    try {
      const response = await axios.post(`http://localhost:8000/api/startups/${id}/rate/`, {
        rating: rating
      });
      
      setUserRating(rating);
      setStartup(prev => ({
        ...prev,
        average_rating: response.data.average_rating,
        total_ratings: response.data.total_ratings
      }));
      
      console.log('Rating submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleLike = async () => {
    if (submittingAction) return;
    
    setSubmittingAction(true);
    try {
      const response = await axios.post(`http://localhost:8000/api/startups/${id}/like/`);
      
      setIsLiked(response.data.liked);
      setStartup(prev => ({
        ...prev,
        total_likes: response.data.total_likes
      }));
      
      console.log('Like toggled successfully:', response.data);
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Failed to update like. Please try again.');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleBookmark = async () => {
    if (submittingAction) return;
    
    setSubmittingAction(true);
    try {
      const response = await axios.post(`http://localhost:8000/api/startups/${id}/bookmark/`);
      
      setIsBookmarked(response.data.bookmarked);
      setStartup(prev => ({
        ...prev,
        total_bookmarks: response.data.total_bookmarks
      }));
      
      console.log('Bookmark toggled successfully:', response.data);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      alert('Failed to update bookmark. Please try again.');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || submittingAction) return;
    
    setSubmittingAction(true);
    try {
      const response = await axios.post(`http://localhost:8000/api/startups/${id}/comment/`, {
        text: comment
      });
      
      // Add new comment to the list
      setStartup(prev => ({
        ...prev,
        recent_comments: [response.data.comment, ...(prev.recent_comments || [])],
        total_comments: (prev.total_comments || 0) + 1
      }));
      
      setComment('');
      console.log('Comment submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setSubmittingAction(false);
    }
  };

  const StarRating = ({ rating, onRate, interactive = false }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRate && onRate(star)}
            disabled={!interactive || submittingAction}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
            }`}
          >
            <Star 
              className={`w-5 h-5 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          </button>
        ))}
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Building className="w-4 h-4" /> },
    { id: 'jobs', label: 'Jobs', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'team', label: 'Team', icon: <Users className="w-4 h-4" /> },
    { id: 'metrics', label: 'Metrics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'reviews', label: 'Reviews', icon: <MessageCircle className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">Loading startup details...</p>
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Startup not found</div>
          <Link 
            to="/startups"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Startups
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/startups"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Startups
            </Link>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBookmark}
                disabled={submittingAction}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  isBookmarked
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-blue-700' : ''}`} />
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
              
              <button
                onClick={handleLike}
                disabled={submittingAction}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  isLiked
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-red-700' : ''}`} />
                <span>{startup.total_likes || 0}</span>
              </button>
              
              <button className="flex items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4 mr-2" />
                Share
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
              <div className="flex-shrink-0 w-20 h-20 bg-blue-100 rounded-xl flex items-center justify-center text-4xl">
                {startup.logo}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{startup.name}</h1>
                  {startup.is_featured && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center">
                      <Award className="w-4 h-4 mr-1" /> Featured
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {startup.industry_detail?.icon} {startup.industry_detail?.name}
                  </span>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" /> {startup.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" /> Since {startup.founded_year}
                  </div>
                </div>

                <p className="text-gray-700 text-lg mb-6 max-w-3xl">{startup.description}</p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{startup.employee_count}</div>
                    <div className="text-sm text-gray-600 flex items-center justify-center">
                      <Users className="w-4 h-4 mr-1" /> Employees
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{startup.founded_year}</div>
                    <div className="text-sm text-gray-600 flex items-center justify-center">
                      <Building className="w-4 h-4 mr-1" /> Founded
                    </div>
                  </div>
                  {startup.funding_amount && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{startup.funding_amount}</div>
                      <div className="text-sm text-gray-600 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 mr-1" /> Funding
                      </div>
                    </div>
                  )}
                  {startup.valuation && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{startup.valuation}</div>
                      <div className="text-sm text-gray-600 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 mr-1" /> Valuation
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rating & Actions */}
            <div className="lg:ml-8 lg:flex-shrink-0 bg-gray-50 rounded-xl p-6 text-center">
              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {startup.average_rating?.toFixed(1) || 'N/A'}
                </div>
                <StarRating rating={Math.round(startup.average_rating || 0)} />
                <div className="text-sm text-gray-600 mt-1">
                  {startup.total_ratings} reviews
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Rate this startup</div>
                <StarRating 
                  rating={userRating} 
                  onRate={handleRate}
                  interactive={true}
                />
              </div>

              {startup.website && (
                <a
                  href={startup.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" /> Visit Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label} {tab.id === 'jobs' && `(${startup.open_jobs?.length || 0})`}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">About {startup.name}</h3>
                  <p className="whitespace-pre-line">{startup.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h3>
                    <div className="space-y-3 bg-gray-50 rounded-lg p-4">
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
                      {startup.tags?.map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          {tag.tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Similar Startups */}
                {startup.similar_startups && startup.similar_startups.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Startups</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {startup.similar_startups.map((similar) => (
                        <Link
                          key={similar.id}
                          to={`/startups/${similar.id}`}
                          className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                              {similar.logo}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{similar.name}</h4>
                              <p className="text-sm text-gray-600">{similar.industry_name}</p>
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
                    to="/jobs"
                    className="text-blue-600 font-medium flex items-center hover:text-blue-700"
                  >
                    View All Positions <ChevronLeft className="w-4 h-4 ml-1 rotate-180" />
                  </Link>
                </div>
                
                {startup.open_jobs?.length > 0 ? (
                  <div className="space-y-6">
                    {startup.open_jobs.map((job) => (
                      <div key={job.id} className="border border-gray-200 hover:border-blue-300 rounded-lg p-6 hover:shadow-md transition-all">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h4>
                            <div className="flex items-center space-x-3 text-sm text-gray-600 mb-3">
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" /> {job.location}
                              </span>
                              {job.salary_range && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center">
                                    <DollarSign className="w-4 h-4 mr-1" /> {job.salary_range}
                                  </span>
                                </>
                              )}
                              <span>•</span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" /> {job.posted_ago}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-4">{job.description}</p>
                            <div className="flex flex-wrap gap-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {job.job_type_name}
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {job.experience_level_display}
                              </span>
                              {job.is_remote && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Remote
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="ml-6">
                            <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
                              Apply Now
                            </button>
                          </div>
                        </div>
                        
                        {/* Skills */}
                        {job.skills_list && job.skills_list.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="text-sm font-medium text-gray-700 mb-2">Required Skills:</div>
                            <div className="flex flex-wrap gap-2">
                              {job.skills_list.map((skill, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">No open positions available at the moment.</p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Get Notified of New Positions
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Meet the Team</h3>
                {startup.founders?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {startup.founders.map((founder) => (
                      <div key={founder.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <div className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                {founder.name.charAt(0)}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gray-900">{founder.name}</h4>
                              <p className="text-blue-600 font-medium mb-2">{founder.title}</p>
                              <p className="text-gray-600 text-sm">{founder.bio}</p>
                            </div>
                          </div>
                        </div>
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
                      disabled={!comment.trim() || submittingAction}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                    >
                      {submittingAction ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Posting...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-1" /> Post Comment
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Comments */}
                <div className="space-y-4">
                  {startup.recent_comments?.length > 0 ? (
                    startup.recent_comments.map((comment) => (
                      <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-200 transition-all">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {comment.user_first_name?.charAt(0) || comment.user_name?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {comment.user_first_name || comment.user_name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" /> {comment.time_ago}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{comment.text}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <button className="flex items-center hover:text-blue-600 transition-colors">
                            <ThumbsUp className="w-4 h-4 mr-1" /> 
                            <span>{comment.likes}</span>
                          </button>
                          <span className="mx-2">•</span>
                          <button className="hover:text-blue-600 transition-colors">
                            Reply
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No comments yet. Be the first to share your thoughts!</p>
                    </div>
                  )}
                </div>
                
                {startup.recent_comments?.length > 0 && (
                  <div className="text-center mt-6">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                      Load More Comments
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
