// src/components/Dashboard.js - Ultra-modern enhanced UI with glassmorphism and animations
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

  const statCards = [
    {
      title: 'Innovative Startups',
      value: stats.total_startups,
      icon: Rocket,
      color: 'blue',
      gradient: 'from-blue-500 via-blue-600 to-purple-600',
      bgGradient: 'from-blue-50/80 via-indigo-50/60 to-purple-50/80',
      glowColor: 'shadow-blue-500/25',
      change: '+12%',
      changeDirection: 'up',
      subtitle: 'Growing ecosystem'
    },
    {
      title: 'Open Opportunities',
      value: stats.total_jobs,
      icon: Briefcase,
      color: 'green',
      gradient: 'from-emerald-500 via-green-600 to-teal-600',
      bgGradient: 'from-emerald-50/80 via-green-50/60 to-teal-50/80',
      glowColor: 'shadow-emerald-500/25',
      change: '+8%',
      changeDirection: 'up',
      subtitle: 'New this week'
    },
    {
      title: 'Industry Categories',
      value: stats.total_industries,
      icon: Globe,
      color: 'purple',
      gradient: 'from-purple-500 via-violet-600 to-pink-600',
      bgGradient: 'from-purple-50/80 via-violet-50/60 to-pink-50/80',
      glowColor: 'shadow-purple-500/25',
      change: '+2%',
      changeDirection: 'up',
      subtitle: 'Diverse sectors'
    },
    {
      title: 'Active Users',
      value: '1.2k',
      icon: Users,
      color: 'orange',
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      bgGradient: 'from-orange-50/80 via-amber-50/60 to-yellow-50/80',
      glowColor: 'shadow-orange-500/25',
      change: '+18%',
      changeDirection: 'up',
      subtitle: 'This month'
    }
  ];

  const quickActions = [
    {
      title: 'Browse Startups',
      description: 'Discover innovative companies',
      icon: Building,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      link: '/startups',
      glow: 'shadow-blue-500/25'
    },
    {
      title: 'Find Jobs',
      description: 'Explore career opportunities',
      icon: Briefcase,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      link: '/jobs',
      glow: 'shadow-green-500/25'
    },
    {
      title: 'My Profile',
      description: 'Update your information',
      icon: Users,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      link: '/profile',
      glow: 'shadow-purple-500/25'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}>
          </div>
        </div>
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200 border-t-purple-500 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Rocket className="w-8 h-8 text-purple-500 animate-pulse" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-8 py-6 border border-white/20">
              <p className="text-white font-medium text-lg mb-2">Loading your dashboard...</p>
              <p className="text-purple-200 text-sm">Connecting you to innovation</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Dashboard Error</h2>
          <p className="text-gray-600 mb-6">Failed to load dashboard data: {error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Enhanced Header with Glassmorphism */}
      <div className="relative bg-white/70 backdrop-blur-xl shadow-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-3">
                <div className="relative">
                  <div className="p-3 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-2xl shadow-lg">
                    <Activity className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    Dashboard
                  </h1>
                  <p className="text-gray-600 text-lg mt-1">Welcome back! Here's what's happening in the startup world.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 lg:mt-0 flex items-center space-x-4">
              <button className="p-3 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all border border-white/30 hover:scale-105">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-3 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all border border-white/30 hover:scale-105">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={fetchDashboardData}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Zap className="w-5 h-5 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Grid with Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div 
              key={index} 
              className={`group relative bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/30 hover:border-white/50 ${stat.glowColor} hover:shadow-2xl`}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`relative p-4 bg-gradient-to-r ${stat.gradient} rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <stat.icon className="w-7 h-7 text-white" />
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  {stat.changeDirection === 'up' ? (
                    <ArrowUp className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`font-semibold ${stat.changeDirection === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-3xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 group-hover:bg-clip-text transition-all duration-300">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </p>
                <p className="text-gray-700 font-semibold text-sm">{stat.title}</p>
                <p className="text-gray-500 text-xs">{stat.subtitle}</p>
              </div>
              
              {/* Animated background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10`}></div>
              
              {/* Floating particles effect */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-yellow-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`group p-6 bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/30 hover:border-white/50 ${action.glow} hover:shadow-2xl`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 ${action.color} rounded-xl shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Featured Startups - Ultra Enhanced */}
          <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/30">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="relative p-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Featured Startups</h2>
                  <p className="text-gray-600 text-sm">Handpicked innovations</p>
                </div>
              </div>
              <Link
                to="/startups"
                className="group flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                View All
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="space-y-6">
              {featuredStartups.length > 0 ? (
                featuredStartups.map((startup, index) => (
                  <Link
                    key={startup.id}
                    to={`/startups/${startup.id}`}
                    className="group block p-6 bg-white/40 backdrop-blur-sm border border-white/40 rounded-2xl hover:bg-white/60 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    style={{
                      animation: `slideInLeft 0.6s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <div className="text-4xl p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110">
                          {startup.logo}
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <Flame className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {startup.name}
                          </h3>
                          <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                            Featured
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3 font-medium">{startup.industry_name}</p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2 text-gray-700">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            <span>{startup.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-700">
                            <Users className="w-4 h-4 text-green-500" />
                            <span>{startup.employee_count} employees</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-700">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{startup.average_rating?.toFixed(1) || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
                        <div className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                          View Details
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">No featured startups available.</p>
                  <p className="text-sm text-gray-500 mt-2">Check back later or explore all startups.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity - Enhanced */}
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/30">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                <p className="text-gray-600 text-sm">Your latest actions</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { emoji: '⭐', action: 'You rated HealthAI', time: '2 hours ago', color: 'from-yellow-400 to-orange-500' },
                { emoji: '🔖', action: 'Bookmarked EcoCharge', time: '1 day ago', color: 'from-blue-400 to-cyan-500' },
                { emoji: '💼', action: 'Applied to Software Engineer', time: '2 days ago', color: 'from-green-400 to-emerald-500' },
                { emoji: '👀', action: 'Viewed PayFlow startup', time: '3 days ago', color: 'from-purple-400 to-pink-500' }
              ].map((activity, index) => (
                <div 
                  key={index}
                  className="group flex items-center space-x-4 p-4 bg-white/40 backdrop-blur-sm rounded-xl hover:bg-white/60 transition-all duration-300 transform hover:scale-105 border border-white/30"
                  style={{
                    animation: `fadeInRight 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className={`p-2 bg-gradient-to-r ${activity.color} rounded-xl shadow-lg group-hover:shadow-xl transition-all`}>
                    <span className="text-lg">{activity.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Latest Jobs - Ultra Enhanced */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/30">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative p-3 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 rounded-2xl shadow-lg">
                <Briefcase className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Latest Job Opportunities</h2>
                <p className="text-gray-600 text-sm">Fresh opportunities await</p>
              </div>
            </div>
            <Link
              to="/jobs"
              className="group flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentJobs.length > 0 ? (
              recentJobs.map((job, index) => (
                <div
                  key={job.id}
                  className="group p-6 bg-white/40 backdrop-blur-sm border border-white/40 rounded-2xl hover:bg-white/60 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">
                        {job.title}
                      </h3>
                      <Link 
                        to={`/startups/${job.startup}`}
                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                      >
                        {job.startup_name}
                      </Link>
                    </div>
                    {job.is_urgent && (
                      <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                        Urgent
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-3 text-sm text-gray-700">
                      <div className="p-1 bg-blue-100 rounded-lg">
                        <MapPin className="w-3 h-3 text-blue-600" />
                      </div>
                      <span>{job.location}</span>
                      {job.is_remote && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
                          Remote
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-700">
                      <div className="p-1 bg-green-100 rounded-lg">
                        <Clock className="w-3 h-3 text-green-600" />
                      </div>
                      <span>{job.posted_ago}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-semibold rounded-full">
                      {job.job_type_name}
                    </span>
                    <button className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-110 shadow-lg">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-10 h-10 text-green-500" />
                </div>
                <p className="text-gray-600 font-medium">No jobs available at the moment.</p>
                <p className="text-sm text-gray-500 mt-2">Check back later for new opportunities.</p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center mt-4 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
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
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/30">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Market Insights</h3>
                <p className="text-gray-600 text-sm">Latest trends and data</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-xl border border-blue-100/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">AI & Machine Learning</span>
                  <span className="text-sm font-bold text-blue-600">+24%</span>
                </div>
                <div className="w-full bg-blue-200/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 rounded-xl border border-green-100/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">FinTech</span>
                  <span className="text-sm font-bold text-green-600">+18%</span>
                </div>
                <div className="w-full bg-green-200/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-xl border border-purple-100/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">HealthTech</span>
                  <span className="text-sm font-bold text-purple-600">+15%</span>
                </div>
                <div className="w-full bg-purple-200/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full" style={{width: '55%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/30">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Trending Topics</h3>
                <p className="text-gray-600 text-sm">What's hot right now</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {[
                { tag: 'Remote Work', count: '1.2k', color: 'from-blue-500 to-cyan-500' },
                { tag: 'AI Startups', count: '890', color: 'from-purple-500 to-pink-500' },
                { tag: 'Web3', count: '650', color: 'from-orange-500 to-red-500' },
                { tag: 'Climate Tech', count: '420', color: 'from-green-500 to-emerald-500' },
                { tag: 'EdTech', count: '380', color: 'from-indigo-500 to-purple-500' },
                { tag: 'Crypto', count: '290', color: 'from-yellow-500 to-orange-500' }
              ].map((topic, index) => (
                <div 
                  key={index}
                  className={`group px-4 py-3 bg-gradient-to-r ${topic.color} text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm">{topic.tag}</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      {topic.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-gray-50/80 to-blue-50/80 rounded-xl border border-gray-100/50">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Pro Tip</p>
                  <p className="text-xs text-gray-600">Follow trending topics to discover emerging opportunities before they go mainstream.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
