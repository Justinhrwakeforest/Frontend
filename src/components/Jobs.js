// src/components/Jobs.js - Enhanced with application modal integration
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import FilterChips from './FilterChips';
import JobApplicationModal from './JobApplicationModal';
import useSearch from '../hooks/useSearch';
import { 
  MapPin, Clock, DollarSign, Users, Building, Star, 
  ExternalLink, Briefcase, AlertCircle, CheckCircle,
  Filter, Grid, List, RefreshCw
} from 'lucide-react';

const Jobs = () => {
  const [filterOptions, setFilterOptions] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('-posted_at');
  const [viewMode, setViewMode] = useState('list');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  
  // Search hook for managing search state
  const {
    results: jobs,
    loading,
    error,
    filters,
    totalResults,
    hasNextPage,
    updateFilters,
    resetFilters,
    removeFilter,
    loadMore,
    search
  } = useSearch('http://localhost:8000/api/jobs/');

  // Load filter options and applied jobs on component mount
  useEffect(() => {
    loadFilterOptions();
    loadAppliedJobs();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/jobs/filters/');
      setFilterOptions(response.data);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const loadAppliedJobs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/jobs/my_applications/');
      const appliedJobIds = new Set(response.data.map(app => app.job));
      setAppliedJobs(appliedJobIds);
    } catch (error) {
      console.error('Error loading applied jobs:', error);
    }
  };

  // Handle search input
  const handleSearch = (searchTerm) => {
    updateFilters({ search: searchTerm });
  };

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    updateFilters({ [filterKey]: value });
  };

  // Handle sorting
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    updateFilters({ ordering: newSortBy });
  };

  // Handle job application
  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  // Handle successful application submission
  const handleApplicationSubmitted = (applicationData) => {
    setAppliedJobs(prev => new Set([...prev, selectedJob.id]));
    setShowApplicationModal(false);
    setSelectedJob(null);
  };

  // Handle application modal close
  const handleApplicationModalClose = () => {
    setShowApplicationModal(false);
    setSelectedJob(null);
  };

  // Filter labels for chips
  const filterLabels = {
    search: 'Search',
    job_type: 'Job Type',
    experience_level: 'Experience',
    location: 'Location',
    is_remote: 'Remote',
    is_urgent: 'Urgent',
    industry: 'Industry',
    posted_since: 'Posted Since',
    skills: 'Skills'
  };

  // Sorting options
  const sortOptions = [
    { value: '-posted_at', label: 'Newest First' },
    { value: 'posted_at', label: 'Oldest First' },
    { value: 'title', label: 'Title A-Z' },
    { value: '-title', label: 'Title Z-A' },
    { value: '-application_count', label: 'Most Popular' },
    { value: 'application_count', label: 'Least Popular' }
  ];

  const JobCard = ({ job, isGrid = false }) => {
    const hasApplied = appliedJobs.has(job.id);
    
    if (isGrid) {
      return (
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                {job.is_urgent && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    🚨 Urgent
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                <span className="flex items-center">
                  <Building className="w-4 h-4 mr-1" />
                  {job.startup_name}
                </span>
                <span className="text-blue-600">{job.startup_industry}</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{job.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{job.salary_range || 'Not specified'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{job.posted_ago}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{job.application_count
