// src/components/Profile.js - Responsive Enhanced Version
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  User, MapPin, Calendar, Edit, Save, X, 
  Star, Bookmark, MessageCircle, Heart,
  Building, Briefcase, Settings, Activity,
  TrendingUp, Award, Target, AlertCircle,
  Sparkles, ExternalLink, ChevronDown, Menu
} from 'lucide-react';

const Profile = () => {
  const { user, token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [activity, setActivity] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState('');
  const [isTabMenuOpen, setIsTabMenuOpen] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const [profileRes, activityRes, bookmarksRes, interestsRes] = await Promise.all([
        axios.get('http://localhost:8000/api/auth/profile/'),
        axios.get('http://localhost:8000/api/auth/activity/'),
        fetchBookmarks(),
        axios.get('http://localhost:8000/api/auth/interests/')
      ]);

      setProfile(profileRes.data);
      setActivity(activityRes.data);
      setInterests(interestsRes.data);
      setEditData({
        first_name: profileRes.data.first_name || '',
        last_name: profileRes.data.last_name || '',
        bio: profileRes.data.bio || '',
        location: profileRes.data.location || ''
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      // Get user's bookmarked startups
      const response = await axios.get('http://localhost:8000/api/startups/', {
        params: { bookmarked: true }
      });
      setBookmarks(response.data.results || []);
      return response;
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      return { data: [] };
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Cancel edit
      setEditData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        bio: profile.bio || '',
        location: profile.location || ''
      });
    }
    setEditMode(!editMode);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.patch('http://localhost:8000/api/auth/profile/', editData);
      setProfile(response.data);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleAddInterest = async (e) => {
    e.preventDefault();
    if (!newInterest.trim()) return;

    try {
      await axios.post('http://localhost:8000/api/auth/interests/', {
        interest: newInterest.trim()
      });
      setNewInterest('');
      // Refresh interests
      const response = await axios.get('http://localhost:8000/api/auth/interests/');
      setInterests(response.data);
    } catch (error) {
      console.error('Error adding interest:', error);
    }
  };

  const handleRemoveInterest = async (interestId) => {
    try {
      await axios.delete(`http://localhost:8000/api/auth/interests/${interestId}/`);
      setInterests(interests.filter(i => i.id !== interestId));
    } catch (error) {
      console.error('Error removing interest:', error);
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-2 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 mx-auto sm:mx-0">
                <span className="text-white text-xl sm:text-2xl font-bold">
                  {profile?.first_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                {editMode ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={editData.first_name}
                        onChange={(e) => setEditData({...editData, first_name: e.target.value})}
                        placeholder="First Name"
                        className="px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      />
                      <input
                        type="text"
                        value={editData.last_name}
                        onChange={(e) => setEditData({...editData, last_name: e.target.value})}
                        placeholder="Last Name"
                        className="px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      />
                    </div>
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) => setEditData({...editData, location: e.target.value})}
                      placeholder="Location"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    />
                    <textarea
                      value={editData.bio}
                      onChange={(e) => setEditData({...editData, bio: e.target.value})}
                      placeholder="Bio"
                      rows="3"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    />
                  </div>
                ) : (
                  <div>
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                      {profile?.first_name && profile?.last_name 
                        ? `${profile.first_name} ${profile.last_name}` 
                        : profile?.username}
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base">{profile?.email}</p>
                    {profile?.location && (
                      <div className="flex items-center justify-center sm:justify-start text-gray-500 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{profile.location}</span>
                      </div>
                    )}
                    {profile?.bio && (
                      <p className="text-gray-700 mt-2 text-sm sm:text-base">{profile.bio}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              {profile?.is_premium && (
                <span className="inline-flex items-center px-2 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-300">
                  <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Premium
                </span>
              )}
              
              {editMode ? (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center px-3 sm:px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
                  >
                    <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Save
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center px-3 sm:px-4 py-2.5 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="flex items-center px-3 sm:px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
                >
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Edit Profile</span>
                  <span className="sm:hidden">Edit</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{profile?.total_ratings || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600">Ratings Given</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-600">{profile?.total_comments || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600">Comments</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-purple-600">{profile?.total_bookmarks || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600">Bookmarks</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-red-600">{profile?.total_likes || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600">Likes</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 sm:mb-6">
          {/* Mobile Tab Menu */}
          <div className="md:hidden border-b border-gray-100">
            <button
              onClick={() => setIsTabMenuOpen(!isTabMenuOpen)}
              className="flex items-center justify-between w-full px-4 sm:px-6 py-4 text-left"
            >
              <div className="flex items-center space-x-2">
                {tabs.find(tab => tab.id === activeTab)?.icon && (
                  React.createElement(tabs.find(tab => tab.id === activeTab).icon, { className: "w-4 h-4 text-blue-600" })
                )}
                <span className="font-medium text-gray-900 text-sm sm:text-base">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isTabMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isTabMenuOpen && (
              <div className="border-t border-gray-100">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsTabMenuOpen(false);
                      }}
                      className={`flex items-center w-full px-4 sm:px-6 py-3 text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      <span className="font-medium text-sm sm:text-base">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop Tab Navigation */}
          <div className="hidden md:block border-b border-gray-100">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* About Section */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">About</h3>
                    <div className="bg-gray-50 rounded-xl p-3 sm:p-4 space-y-3 border border-gray-100">
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Member since</span>
                        <span className="font-medium text-sm">
                          {new Date(profile?.member_since).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Account Type</span>
                        <span className="font-medium text-sm">
                          {profile?.is_premium ? 'Premium' : 'Free'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Total Activity</span>
                        <span className="font-medium text-sm">
                          {(profile?.total_ratings || 0) + (profile?.total_comments || 0) + (profile?.total_likes || 0)} actions
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Interests Section */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Interests</h3>
                    <div className="space-y-4">
                      <form onSubmit={handleAddInterest} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <input
                          type="text"
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          placeholder="Add an interest..."
                          className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
                        >
                          Add
                        </button>
                      </form>
                      
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest) => (
                          <span
                            key={interest.id}
                            className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                          >
                            {interest.interest}
                            <button
                              onClick={() => handleRemoveInterest(interest.id)}
                              className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Activity</h3>
                
                {/* Recent Ratings */}
                {activity?.recent_ratings?.length > 0 && (
                  <div>
                    <h4 className="text-sm sm:text-md font-medium text-gray-800 mb-3">Recent Ratings</h4>
                    <div className="space-y-3">
                      {activity.recent_ratings.map((rating, index) => (
                        <Link
                          key={index}
                          to={`/startups/${rating.startup_id}`}
                          className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100"
                        >
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <span className="text-lg sm:text-xl flex-shrink-0">{rating.startup_logo}</span>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{rating.startup_name}</p>
                              <p className="text-xs sm:text-sm text-gray-500">
                                {new Date(rating.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                  i < rating.rating ? 'text-amber-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Comments */}
                {activity?.recent_comments?.length > 0 && (
                  <div>
                    <h4 className="text-sm sm:text-md font-medium text-gray-800 mb-3">Recent Comments</h4>
                    <div className="space-y-3">
                      {activity.recent_comments.map((comment, index) => (
                        <Link
                          key={index}
                          to={`/startups/${comment.startup_id}`}
                          className="block p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100"
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-lg flex-shrink-0">{comment.startup_logo}</span>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{comment.startup_name}</p>
                              <p className="text-xs sm:text-sm text-gray-500">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-700 text-xs sm:text-sm">{comment.text}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {(!activity?.recent_ratings?.length && !activity?.recent_comments?.length) && (
                  <div className="text-center py-8">
                    <Activity className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 mb-3 text-sm sm:text-base">No recent activity found.</p>
                    <Link
                      to="/startups"
                      className="inline-block px-4 sm:px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
                    >
                      Explore Startups
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Bookmarks Tab */}
            {activeTab === 'bookmarks' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Your Bookmarks</h3>
                  <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-xl w-fit">{bookmarks.length} startups</span>
                </div>
                
                {bookmarks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bookmarks.map((startup) => (
                      <div
                        key={startup.id}
                        className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-gray-200 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                            <span className="text-lg sm:text-xl flex-shrink-0">{startup.logo}</span>
                            <div className="min-w-0 flex-1">
                              <Link
                                to={`/startups/${startup.id}`}
                                className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-sm sm:text-base truncate block"
                              >
                                {startup.name}
                              </Link>
                              <p className="text-xs sm:text-sm text-gray-600 truncate">{startup.industry_name}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeBookmark(startup.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50 flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <p className="text-gray-700 text-xs sm:text-sm mb-3 line-clamp-2">{startup.description}</p>
                        
                        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                          <span className="flex items-center min-w-0">
                            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{startup.location}</span>
                          </span>
                          <span className="flex items-center flex-shrink-0 ml-2">
                            <Star className="w-3 h-3 mr-1 text-amber-400" />
                            {startup.average_rating?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bookmark className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 mb-3 text-sm sm:text-base">No bookmarks yet.</p>
                    <Link
                      to="/startups"
                      className="inline-block px-4 sm:px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
                    >
                      Browse Startups
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Account Settings</h3>
                
                <div className="space-y-6">
                  {/* Account Information */}
                  <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">Account Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Username</span>
                        <span className="font-medium text-sm">{profile?.username}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Email</span>
                        <span className="font-medium text-sm truncate ml-2">{profile?.email}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Account Status</span>
                        <span className={`px-3 py-1 rounded-xl text-xs font-medium ${
                          profile?.is_premium 
                            ? 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-300' 
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {profile?.is_premium ? 'Premium' : 'Free'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">Privacy Settings</h4>
                    <div className="space-y-4">
                      {[
                        { key: 'profile_public', label: 'Show profile to other users' },
                        { key: 'email_notifications', label: 'Allow email notifications' },
                        { key: 'activity_public', label: 'Show activity publicly' }
                      ].map((setting) => (
                        <label key={setting.key} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
                          <span className="text-gray-700 font-medium text-sm sm:text-base flex-1 mr-3">{setting.label}</span>
                          <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0" defaultChecked />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Upgrade Section (if not premium) */}
                  {!profile?.is_premium && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 sm:p-6 border border-amber-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 flex-shrink-0" />
                        <h4 className="font-semibold text-amber-900 text-sm sm:text-base">Upgrade to Premium</h4>
                      </div>
                      <p className="text-amber-800 mb-4 text-sm sm:text-base">Unlock exclusive features and get priority support.</p>
                      <button className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-colors font-medium text-sm sm:text-base">
                        Upgrade Now
                      </button>
                    </div>
                  )}

                  {/* Danger Zone */}
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-6">
                    <h4 className="font-semibold text-red-900 mb-4 text-sm sm:text-base">Danger Zone</h4>
                    <div className="space-y-2">
                      <button className="w-full text-left px-4 py-3 text-red-700 hover:bg-red-100 rounded-xl transition-colors font-medium text-sm sm:text-base">
                        Change Password
                      </button>
                      <button className="w-full text-left px-4 py-3 text-red-700 hover:bg-red-100 rounded-xl transition-colors font-medium text-sm sm:text-base">
                        Download My Data
                      </button>
                      <button className="w-full text-left px-4 py-3 text-red-700 hover:bg-red-100 rounded-xl transition-colors font-medium text-sm sm:text-base">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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
      `}</style>
    </div>
  );
};

export default Profile;
