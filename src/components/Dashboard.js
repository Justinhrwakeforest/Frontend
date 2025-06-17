// src/components/Dashboard.js - Professional modern UI
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  TrendingUp, Star, MapPin, Users, Clock, ChevronRight, 
  Briefcase, Building, Award, Activity, Calendar, 
  ArrowUp, ArrowDown, Eye, Heart, Bookmark, Search,
  Zap, Target, Rocket, Filter, AlertCircle, Plus,
  Globe, DollarSign, Flame, Mail, Bell, Settings, BarChart3
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
      title: 'Browse Startups',
      description: 'Discover innovative companies',
      icon: Building,
      link: '/startups'
    },
    {
      title: 'Find Jobs',
      description: 'Explore career opportunities',
      icon: Briefcase,
      link: '/jobs'
    },
    {
      title: 'My Profile',
      description: 'Update your information',
      icon: Users,
      link: '/profile'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-4">Failed to load dashboard data: {error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
        {/* Quick Actions Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="group p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <action.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Featured Startups */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-lg font-semibold text-gray-900">Featured Startups</h2>
                </div>
                <Link
                  to="/startups"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  View all
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              {featuredStartups.length > 0 ? (
                <div className="space-y-6">
                  {featuredStartups.map((startup) => (
                    <Link
                      key={startup.id}
                      to={`/startups/${startup.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl p-3 bg-gray-50 rounded-lg">
                          {startup.logo}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-medium text-gray-900">
                              {startup.name}
                            </h3>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                              Featured
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{startup.industry_name}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{startup.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{startup.employee_count} employees</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4" />
                              <span>{startup.average_rating?.toFixed(1) || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No featured startups available.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { icon: Star, action: 'You rated HealthAI', time: '2 hours ago' },
                  { icon: Bookmark, action: 'Bookmarked EcoCharge', time: '1 day ago' },
                  { icon: Briefcase, action: 'Applied to Software Engineer', time: '2 days ago' },
                  { icon: Eye, action: 'Viewed PayFlow startup', time: '3 days ago' }
                ].map((activity, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <activity.icon className="w-4 h-4 text-gray-600" />
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
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Briefcase className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Latest Job Opportunities</h2>
              </div>
              <Link
                to="/jobs"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                View all
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            {recentJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-base font-medium text-gray-900 mb-1">
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
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                        {job.is_remote && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
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
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        {job.job_type_name}
                      </span>
                      <button className="p-2 text-blue-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-3">No jobs available at the moment.</p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Explore All Jobs
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Insights Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Market Insights */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Market Insights</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">AI & Machine Learning</span>
                    <span className="text-sm font-semibold text-blue-600">+24%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">FinTech</span>
                    <span className="text-sm font-semibold text-green-600">+18%</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '65%'}}></div>
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">HealthTech</span>
                    <span className="text-sm font-semibold text-purple-600">+15%</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '55%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Trending Topics</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-3 mb-6">
                {[
                  { tag: 'Remote Work', count: '1.2k', color: 'bg-blue-100 text-blue-800' },
                  { tag: 'AI Startups', count: '890', color: 'bg-purple-100 text-purple-800' },
                  { tag: 'Web3', count: '650', color: 'bg-orange-100 text-orange-800' },
                  { tag: 'Climate Tech', count: '420', color: 'bg-green-100 text-green-800' },
                  { tag: 'EdTech', count: '380', color: 'bg-indigo-100 text-indigo-800' },
                  { tag: 'Crypto', count: '290', color: 'bg-yellow-100 text-yellow-800' }
                ].map((topic, index) => (
                  <div 
                    key={index}
                    className={`px-3 py-2 ${topic.color} rounded-full hover:shadow-sm transition-shadow cursor-pointer`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{topic.tag}</span>
                      <span className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded-full">
                        {topic.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Target className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Pro Tip</p>
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
