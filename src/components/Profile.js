// src/components/Profile.js - Professional modern UI
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  User, MapPin, Calendar, Edit, Save, X, 
  Star, Bookmark, MessageCircle, Heart,
  Building, Briefcase, Settings, Activity,
  TrendingUp, Award, Target, AlertCircle
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-2xl font-semibold">
                  {profile?.first_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1">
                {editMode ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={editData.first_name}
                        onChange={(e) => setEditData({...editData, first_name: e.target.value})}
                        placeholder="First Name"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={editData.last_name}
                        onChange={(e) => setEditData({...editData, last_name: e.target.value})}
                        placeholder="Last Name"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) => setEditData({...editData, location: e.target.value})}
                      placeholder="Location"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <textarea
                      value={editData.bio}
                      onChange={(e) => setEditData({...editData, bio: e.target.value})}
                      placeholder="Bio"
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ) : (
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      {profile?.first_name && profile?.last_name 
                        ? `${profile.first_name} ${profile.last_name}` 
                        : profile?.username}
                    </h1>
                    <p className="text-gray-600">{profile?.email}</p>
                    {profile?.location && (
                      <div className="flex items-center text-gray-500 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {profile?.bio && (
                      <p className="text-gray-700 mt-2">{profile.bio}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 md:mt-0 flex items-center space-x-3">
              {profile?.is_premium && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  <Award className="w-4 h-4 mr-1" />
                  Premium
                </span>
              )}
              
              {editMode ? (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-xl font-semibold text-blue-600">{profile?.total_ratings || 0}</div>
              <div className="text-sm text-gray-600">Ratings Given</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-green-600">{profile?.total_comments || 0}</div>
              <div className="text-sm text-gray-600">Comments</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-purple-600">{profile?.total_bookmarks || 0}</div>
              <div className="text-sm text-gray-600">Bookmarks</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-red-600">{profile?.total_likes || 0}</div>
              <div className="text-sm text-gray-600">Likes</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="border-b border-gray-200">
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
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* About Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Member since</span>
                        <span className="font-medium">
                          {new Date(profile?.member_since).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Type</span>
                        <span className="font-medium">
                          {profile?.is_premium ? 'Premium' : 'Free'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Activity</span>
                        <span className="font-medium">
                          {(profile?.total_ratings || 0) + (profile?.total_comments || 0) + (profile?.total_likes || 0)} actions
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Interests Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Interests</h3>
                    <div className="space-y-4">
                      <form onSubmit={handleAddInterest} className="flex space-x-2">
                        <input
                          type="text"
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          placeholder="Add an interest..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add
                        </button>
                      </form>
                      
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest) => (
                          <span
                            key={interest.id}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            {interest.interest}
                            <button
                              onClick={() => handleRemoveInterest(interest.id)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
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
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                
                {/* Recent Ratings */}
                {activity?.recent_ratings?.length > 0 && (
                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-3">Recent Ratings</h4>
                    <div className="space-y-3">
                      {activity.recent_ratings.map((rating, index) => (
                        <Link
                          key={index}
                          to={`/startups/${rating.startup_id}`}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{rating.startup_logo}</span>
                            <div>
                              <p className="font-medium text-gray-900">{rating.startup_name}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(rating.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < rating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
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
                    <h4 className="text-md font-medium text-gray-800 mb-3">Recent Comments</h4>
                    <div className="space-y-3">
                      {activity.recent_comments.map((comment, index) => (
                        <Link
                          key={index}
                          to={`/startups/${comment.startup_id}`}
                          className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-lg">{comment.startup_logo}</span>
                            <div>
                              <p className="font-medium text-gray-900">{comment.startup_name}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm">{comment.text}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {(!activity?.recent_ratings?.length && !activity?.recent_comments?.length) && (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-3">No recent activity found.</p>
                    <Link
                      to="/startups"
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Your Bookmarks</h3>
                  <span className="text-sm text-gray-500">{bookmarks.length} startups</span>
                </div>
                
                {bookmarks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bookmarks.map((startup) => (
                      <div
                        key={startup.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{startup.logo}</span>
                            <div>
                              <Link
                                to={`/startups/${startup.id}`}
                                className="font-medium text-gray-900 hover:text-blue-600"
                              >
                                {startup.name}
                              </Link>
                              <p className="text-sm text-gray-600">{startup.industry_name}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeBookmark(startup.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{startup.description}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {startup.location}
                          </span>
                          <span className="flex items-center">
                            <Star className="w-3 h-3 mr-1 text-yellow-400" />
                            {startup.average_rating?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-3">No bookmarks yet.</p>
                    <Link
                      to="/startups"
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
                
                <div className="space-y-6">
                  {/* Account Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Account Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Username</span>
                        <span className="font-medium">{profile?.username}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Email</span>
                        <span className="font-medium">{profile?.email}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Account Status</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          profile?.is_premium 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {profile?.is_premium ? 'Premium' : 'Free'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Privacy Settings</h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Show profile to other users</span>
                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Allow email notifications</span>
                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Show activity publicly</span>
                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 mb-3">Danger Zone</h4>
                    <div className="space-y-2">
                      <button className="w-full text-left px-3 py-2 text-red-700 hover:bg-red-100 rounded-lg transition-colors">
                        Change Password
                      </button>
                      <button className="w-full text-left px-3 py-2 text-red-700 hover:bg-red-100 rounded-lg transition-colors">
                        Download My Data
                      </button>
                      <button className="w-full text-left px-3 py-2 text-red-700 hover:bg-red-100 rounded-lg transition-colors">
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
