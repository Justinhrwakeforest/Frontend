// src/components/Navbar.js - Enhanced with notification bell integration
import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { NotificationBell } from './NotificationSystem';
import axios from 'axios';
import { 
  Home, Building, Briefcase, User, LogOut, Search, 
  Menu, X, ChevronDown, Settings, HelpCircle,
  Star, Bookmark, Activity, TrendingUp
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');
  const [quickSearchResults, setQuickSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showQuickSearch, setShowQuickSearch] = useState(false);

  const navItems = [
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: Home,
      description: 'Overview and insights'
    },
    { 
      path: '/startups', 
      label: 'Startups', 
      icon: Building,
      description: 'Discover innovative companies'
    },
    { 
      path: '/jobs', 
      label: 'Jobs', 
      icon: Briefcase,
      description: 'Find career opportunities'
    },
    { 
      path: '/profile', 
      label: 'Profile', 
      icon: User,
      description: 'Your account and activity'
    }
  ];

  const profileMenuItems = [
    { label: 'View Profile', icon: User, path: '/profile' },
    { label: 'Bookmarks', icon: Bookmark, path: '/bookmarks' },
    { label: 'Activity', icon: Activity, path: '/activity' },
    { label: 'Settings', icon: Settings, path: '/settings' },
    { label: 'Help', icon: HelpCircle, path: '/help' },
  ];

  // Quick search functionality
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (quickSearchQuery.trim().length > 2) {
        performQuickSearch(quickSearchQuery);
      } else {
        setQuickSearchResults([]);
        setShowQuickSearch(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [quickSearchQuery]);

  const performQuickSearch = async (query) => {
    setIsSearching(true);
    try {
      const [startupsRes, jobsRes] = await Promise.all([
        axios.get(`http://localhost:8000/api/startups/?search=${query}&page_size=3`),
        axios.get(`http://localhost:8000/api/jobs/?search=${query}&page_size=3`)
      ]);

      setQuickSearchResults({
        startups: startupsRes.data.results || [],
        jobs: jobsRes.data.results || []
      });
      setShowQuickSearch(true);
    } catch (error) {
      console.error('Quick search error:', error);
      setQuickSearchResults({ startups: [], jobs: [] });
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickSearchSubmit = (e) => {
    e.preventDefault();
