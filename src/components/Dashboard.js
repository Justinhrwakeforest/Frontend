// src/components/Dashboard.js - Startlinker Modern Minimalistic Design
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
  const [stats, setStats] = useState({
    total_startups: 0,
    total_jobs: 0,
    total_industries: 0
  });
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
      
      // Fetch stats
      const statsRes = await axios.get('http://localhost:8000/api/stats/');
      console.log('Stats response:', statsRes.data);
      setStats(statsRes.data);

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
      
      // Set some default values if API fails
      setStats({
        total_startups: 0,
        total_jobs: 0,
        total_industries: 0
      });
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
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Find Opportunities',
      description: 'Browse career openings',
      icon: Briefcase,
      link: '/jobs',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'My Profile',
      description: 'Manage your account',
      icon: Users,
      link: '/profile',
      gradient: 'from-green-500 to-green-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Startlinker</h1>
          <p className="text-gray-600">Connect with innovative startups and discover your next opportunity</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Startups</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_startups.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-purple-50 rounded-xl">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Job Opportunities</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_jobs.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-xl">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Industries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_industries}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="group relative p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-200`}></div>
                <div className="relative flex items-center space-x-4">
                  <div className={`p-3 bg-gradient-to-br ${action.gradient} rounded-xl shadow-sm`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Featured Startups */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-6 border-b border-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h2 className="text-lg font-semibold text-gray-900">Featured Startups</h2>
                </div>
                <Link
                  to="/startups"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors flex items-center space-x-1"
                >
                  <span>View all</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              {featuredStartups.length > 0 ? (
                <div className="space-y-4">
                  {featuredStartups.map((startup) => (
                    <Link
                      key={startup.id}
                      to={`/startups/${startup.id}`}
                      className="block p-4 border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl p-3 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors">
                          {startup.logo}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {startup.name}
                            </h3>
                            <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                              Featured
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2 text-sm">{startup.industry_name}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{startup.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{startup.employee_count} employees</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-amber-400" />
                              <span>{startup.average_rating?.toFixed(1) || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No featured startups available.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-6 border-b border-gray-50">
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {[
                  { icon: Star, action: 'You rated HealthAI', time: '2 hours ago', color: 'bg-amber-50 text-amber-600' },
                  { icon: Bookmark, action: 'Bookmarked EcoCharge', time: '1 day ago', color: 'bg-blue-50 text-blue-600' },
                  { icon: Briefcase, action: 'Applied to Software Engineer', time: '2 days ago', color: 'bg-purple-50 text-purple-600' },
                  { icon: Eye, action: 'Viewed PayFlow startup', time: '3 days ago', color: 'bg-green-50 text-green-600' }
                ].map((activity, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-2 ${activity.color} rounded-lg`}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Latest Jobs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8">
          <div className="p-6 border-b border-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Rocket className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">Latest Opportunities</h2>
              </div>
              <Link
                to="/jobs"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors flex items-center space-x-1"
              >
                <span>View all</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            {recentJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all duration-200 group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>
                        <Link 
                          to={`/startups/${job.startup}`}
                          className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                        >
                          {job.startup_name}
                        </Link>
                      </div>
                      {job.is_urgent && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          Urgent
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>{job.location}</span>
                        {job.is_remote && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                            Remote
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{job.posted_ago}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        {job.job_type_name}
                      </span>
                      <button className="p-2 text-blue-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-3">No jobs available at the moment.</p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Explore All Jobs
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Market Trends */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-6 border-b border-gray-50">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Market Trends</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">AI & Machine Learning</span>
                    <span className="text-sm font-bold text-blue-600">+24%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">FinTech</span>
                    <span className="text-sm font-bold text-green-600">+18%</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '65%'}}></div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">HealthTech</span>
                    <span className="text-sm font-bold text-purple-600">+15%</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '55%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Topics */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-6 border-b border-gray-50">
              <div className="flex items-center space-x-3">
                <Flame className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Popular Topics</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-3 mb-6">
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
                    className={`px-3 py-2 ${topic.color} border rounded-xl hover:shadow-sm transition-shadow cursor-pointer`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{topic.tag}</span>
                      <span className="text-xs bg-white bg-opacity-70 px-2 py-1 rounded-full">
                        {topic.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Pro Tip</p>
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
