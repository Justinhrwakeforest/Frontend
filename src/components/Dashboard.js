// src/components/Dashboard.js - Updated with links to startup detail pages
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_startups: 0,
    total_jobs: 0,
    total_industries: 0
  });
  const [featuredStartups, setFeaturedStartups] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, startupsRes, jobsRes] = await Promise.all([
        axios.get('http://localhost:8000/api/stats/'),
        axios.get('http://localhost:8000/api/startups/?is_featured=true&page_size=3'),
        axios.get('http://localhost:8000/api/jobs/?page_size=3&ordering=-posted_at')
      ]);

      setStats(statsRes.data);
      setFeaturedStartups(startupsRes.data.results || []);
      setRecentJobs(jobsRes.data.results || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Startups',
      value: stats.total_startups,
      icon: '🏢',
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Open Jobs',
      value: stats.total_jobs,
      icon: '💼',
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Industries',
      value: stats.total_industries,
      icon: '🏭',
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Active Users',
      value: '1.2k',
      icon: '👥',
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back! Here's what's happening in the startup world.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Startups */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Featured Startups</h2>
              <Link
                to="/startups"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All →
              </Link>
            </div>
            
            <div className="space-y-4">
              {featuredStartups.length > 0 ? (
                featuredStartups.map((startup) => (
                  <Link
                    key={startup.id}
                    to={`/startups/${startup.id}`}
                    className="block border-l-4 border-blue-500 bg-gray-50 rounded-lg p-4 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{startup.logo}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {startup.name}
                        </h3>
                        <p className="text-sm text-gray-600">{startup.industry_name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {startup.location}
                          </span>
                          <span className="text-xs text-gray-500">
                            {startup.employee_count} employees
                          </span>
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400 text-xs">⭐</span>
                            <span className="text-xs text-gray-500">
                              {startup.average_rating?.toFixed(1) || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No featured startups found.</p>
              )}
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Latest Jobs</h2>
              <Link
                to="/jobs"
                className="text-green-600 hover:text-green-700 font-medium text-sm"
              >
                View All →
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentJobs.length > 0 ? (
                recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="border-l-4 border-green-500 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <Link 
                          to={`/startups/${job.startup}`}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {job.startup_name}
                        </Link>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {job.job_type_name}
                          </span>
                          <span className="text-xs text-gray-500">{job.location}</span>
                          {job.is_remote && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Remote
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xs text-gray-500">{job.posted_ago}</p>
                        {job.is_urgent && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                            Urgent
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No jobs found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/startups"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-white font-semibold">🚀</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Explore Startups</p>
                <p className="text-sm text-gray-500">Discover innovative companies</p>
              </div>
            </Link>
            
            <Link
              to="/jobs"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-white font-semibold">💼</span>
                </div>
              </div>
              <div className="ml-4">
