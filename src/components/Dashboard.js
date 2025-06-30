// src/components/Dashboard.js - Startlinker Modern Minimalistic Design (Updated)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  TrendingUp, Star, MapPin, Users, Clock, ChevronRight, 
  Briefcase, Building, Award, Activity, Calendar, 
  ArrowUp, ArrowDown, Eye, Heart, Bookmark, Search,
  Zap, Target, Rocket, Filter, AlertCircle, Plus,
  Globe, DollarSign, Flame, Mail, Bell, Settings, BarChart3,
  ExternalLink, Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const [featuredStartups, setFeaturedStartups] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching dashboard data...');

      // Fetch featured startups
      const startupsRes = await axios.get('http://localhost:8000/api/startups/', {
        params: { is_featured: true, page_size: 3 }
      });
      console.log('Featured startups response:', startupsRes.data);
      setFeaturedStartups(startupsRes.data.results || []);

      // Fetch recent jobs
      const jobsRes = await axios.get('http://localhost:8000/api/jobs/', {
        params: { page_size: 3, ordering: '-posted_at' }
      });
      console.log('Recent jobs response:', jobsRes.data);
      setRecentJobs(jobsRes.data.results || []);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
      
      setFeaturedStartups([]);
      setRecentJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Discover Startups',
      description: 'Explore innovative companies',
      icon: Building,
      link: '/startups',
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Find Opportunities',
      description: 'Browse career openings',
      icon: Briefcase,
      link: '/jobs',
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'My Profile',
      description: 'Manage your account',
      icon: Users,
      link: '/profile',
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-4">Failed to load dashboard data: {error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Hero Welcome Section */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Welcome to <span className="text-blue-600">Startlinker</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Connect with innovative startups and discover your next opportunity
              </p>
              
              {/* Quick Actions - Redesigned as hero buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className={`group relative p-6 ${action.bgColor} ${action.borderColor} border-2 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
                  >
                    <div className="text-center">
                      <div className={`inline-flex p-4 bg-gradient-to-br ${action.gradient} rounded-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
          
          {/* Left Column - Featured Startups (2/3 width) */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 border-b border-amber-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Featured Startups</h2>
                      <p className="text-amber-700">Discover the most promising companies</p>
                    </div>
                  </div>
                  <Link
                    to="/startups"
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-amber-200 text-amber-700 font-medium rounded-xl hover:bg-amber-50 transition-colors"
                  >
                    <span>View all</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              
              <div className="p-8">
                {featuredStartups.length > 0 ? (
                  <div className="space-y-6">
                    {featuredStartups.map((startup) => (
                      <Link
                        key={startup.id}
                        to={`/startups/${startup.id}`}
                        className="block p-6 border-2 border-gray-100 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 group bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-white"
                      >
                        <div className="flex items-center space-x-6">
                          <div className="text-3xl p-4 bg-white border-2 border-gray-200 rounded-2xl group-hover:border-blue-300 group-hover:shadow-md transition-all duration-300">
                            {startup.logo}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {startup.name}
                              </h3>
                              <span className="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-sm font-bold rounded-xl border border-amber-200">
                                Featured
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3 font-medium">{startup.industry_name}</p>
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>{startup.location}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4" />
                                <span>{startup.employee_count} employees</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Star className="w-4 h-4 text-amber-500" />
                                <span>{startup.average_rating?.toFixed(1) || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Featured Startups</h3>
                    <p className="text-gray-500">Check back soon for featured companies.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Recent Activity (1/3 width) */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden h-fit">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                    <p className="text-blue-700 text-sm">Your latest interactions</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { icon: Star, action: 'You rated HealthAI', time: '2 hours ago', color: 'bg-amber-50 text-amber-600 border-amber-200' },
                    { icon: Bookmark, action: 'Bookmarked EcoCharge', time: '1 day ago', color: 'bg-blue-50 text-blue-600 border-blue-200' },
                    { icon: Briefcase, action: 'Applied to Software Engineer', time: '2 days ago', color: 'bg-purple-50 text-purple-600 border-purple-200' },
                    { icon: Eye, action: 'Viewed PayFlow startup', time: '3 days ago', color: 'bg-green-50 text-green-600 border-green-200' }
                  ].map((activity, index) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-4 p-4 rounded-xl border-2 border-gray-100 hover:shadow-md transition-all duration-200"
                    >
                      <div className={`p-2 ${activity.color} border rounded-xl`}>
                        <activity.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Jobs - Full Width */}
        <div className="mb-12">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 border-b border-purple-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Latest Opportunities</h2>
                    <p className="text-purple-700">Find your next career move</p>
                  </div>
                </div>
                <Link
                  to="/jobs"
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-purple-200 text-purple-700 font-medium rounded-xl hover:bg-purple-50 transition-colors"
                >
                  <span>View all</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div className="p-8">
              {recentJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-6 border-2 border-gray-100 rounded-2xl hover:border-purple-300 hover:shadow-lg transition-all duration-300 group bg-gradient-to-br from-gray-50 to-white hover:from-purple-50"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                            {job.title}
                          </h3>
                          <Link 
                            to={`/startups/${job.startup}`}
                            className="text-sm text-blue-600 hover:text-blue-500 font-semibold"
                          >
                            {job.startup_name}
                          </Link>
                        </div>
                        {job.is_urgent && (
                          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-xl border border-red-200">
                            Urgent
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                          {job.is_remote && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-lg">
                              Remote
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{job.posted_ago}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="px-4 py-2 bg-green-100 text-green-800 text-sm font-bold rounded-xl border border-green-200">
                          {job.job_type_name}
                        </span>
                        <button className="p-2 text-purple-600 hover:text-purple-500 hover:bg-purple-50 rounded-xl transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Jobs Available</h3>
                  <p className="text-gray-500 mb-6">Check back soon for new opportunities.</p>
                  <Link
                    to="/jobs"
                    className="inline-flex items-center px-6 py-3 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Explore All Jobs
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Insights - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Market Trends */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-green-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Market Trends</h3>
                  <p className="text-green-700 text-sm">Growing industries</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-700">AI & Machine Learning</span>
                    <span className="text-sm font-bold text-blue-600 bg-white px-2 py-1 rounded-lg">+24%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm" style={{width: '75%'}}></div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border-2 border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-700">FinTech</span>
                    <span className="text-sm font-bold text-green-600 bg-white px-2 py-1 rounded-lg">+18%</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm" style={{width: '65%'}}></div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-700">HealthTech</span>
                    <span className="text-sm font-bold text-purple-600 bg-white px-2 py-1 rounded-lg">+15%</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full shadow-sm" style={{width: '55%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Topics */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 border-b border-orange-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Popular Topics</h3>
                  <p className="text-orange-700 text-sm">Trending discussions</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { tag: 'Remote Work', count: '1.2k', color: 'bg-blue-100 text-blue-800 border-blue-200' },
                  { tag: 'AI Startups', count: '890', color: 'bg-purple-100 text-purple-800 border-purple-200' },
                  { tag: 'Web3', count: '650', color: 'bg-orange-100 text-orange-800 border-orange-200' },
                  { tag: 'Climate Tech', count: '420', color: 'bg-green-100 text-green-800 border-green-200' },
                  { tag: 'EdTech', count: '380', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
                  { tag: 'Crypto', count: '290', color: 'bg-amber-100 text-amber-800 border-amber-200' }
                ].map((topic, index) => (
                  <div 
                    key={index}
                    className={`px-3 py-3 ${topic.color} border-2 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-1`}
                  >
                    <div className="text-center">
                      <div className="font-bold text-sm mb-1">{topic.tag}</div>
                      <div className="text-xs bg-white bg-opacity-80 px-2 py-1 rounded-lg font-medium">
                        {topic.count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200">
                <div className="flex items-start space-x-3">
                  <Zap className="w-6 h-6 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">Pro Tip</p>
                    <p className="text-sm text-gray-600">Follow trending topics to discover emerging opportunities before they go mainstream.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
