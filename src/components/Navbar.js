// src/components/Navbar.js - Enhanced Original Design with Working Search
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { NotificationBell } from './NotificationSystem';
import axios from 'axios';
import { 
  Home, Building, Briefcase, User, LogOut, Search, 
  Menu, X, ChevronDown, Settings, HelpCircle,
  Star, Bookmark, Activity, TrendingUp, Bell,
  MessageCircle, Award, Shield, CreditCard,
  Link as LinkIcon, Clock, Zap, Coffee, Code,
  Heart, Users, Calendar, Target, Rocket
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');
  const [quickSearchResults, setQuickSearchResults] = useState({ startups: [], jobs: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const searchDebounceRef = useRef(null);

  const navItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: Home,
      description: 'Dashboard overview'
    },
    { 
      path: '/startups', 
      label: 'Startups', 
      icon: Building,
      description: 'Discover companies'
    },
    { 
      path: '/jobs', 
      label: 'Jobs', 
      icon: Briefcase,
      description: 'Find opportunities'
    }
  ];

  const profileMenuItems = [
    { label: 'Profile', icon: User, path: '/profile' },
    { label: 'Bookmarks', icon: Bookmark, path: '/bookmarks' },
    { label: 'Activity', icon: Activity, path: '/activity' },
    { label: 'My Claims', icon: Shield, path: '/my-claims', description: 'Track your startup claims' },
    { label: 'Settings', icon: Settings, path: '/settings' },
    { label: 'Help', icon: HelpCircle, path: '/help' },
  ];

  // Mock search suggestions
  const trendingSearches = [
    'AI startups',
    'Remote jobs',
    'Series A funding',
    'Frontend developer',
    'FinTech companies',
    'Product manager roles'
  ];

  // Add admin menu items dynamically for admin users
  const getMenuItems = () => {
    const items = [...profileMenuItems];
    
    if (user?.is_staff || user?.is_superuser) {
      items.splice(1, 0, { 
        label: 'Admin Panel', 
        icon: Shield, 
        path: '/admin',
        isAdmin: true 
      });
      
      items.splice(2, 0, { 
        label: 'Job Admin', 
        icon: Briefcase, 
        path: '/job-admin',
        isAdmin: true 
      });
    }
    
    return items;
  };

  // Load user stats and recent searches on mount
  useEffect(() => {
    if (user) {
      loadUserStats();
    }
    loadRecentSearches();
  }, [user]);

  const loadRecentSearches = () => {
    try {
      const saved = localStorage.getItem('recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  // Enhanced search functionality with debouncing
  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    if (quickSearchQuery.trim().length > 1) {
      setIsSearching(true);
      searchDebounceRef.current = setTimeout(() => {
        performQuickSearch(quickSearchQuery);
      }, 300);
    } else {
      setQuickSearchResults({ startups: [], jobs: [] });
      setIsSearching(false);
    }

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [quickSearchQuery]);

  // Show search dropdown when focused
  useEffect(() => {
    if (searchFocused) {
      setShowQuickSearch(true);
    }
  }, [searchFocused]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          searchRef.current && !searchRef.current.contains(event.target)) {
        setShowQuickSearch(false);
        setSearchFocused(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock/unlock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isMobileMenuOpen]);

  const loadUserStats = async () => {
    try {
      // Mock user stats - replace with actual API call
      setUserStats({
        totals: {
          bookmarks: 15,
          ratings: 23,
          applications: 8
        }
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const performQuickSearch = async (query) => {
    try {
      // Mock search results - replace with actual API call
      const mockStartups = [
        { id: 1, name: 'TechFlow AI', industry_name: 'AI/ML', logo: '🚀' },
        { id: 2, name: 'DataTech Pro', industry_name: 'Analytics', logo: '📊' },
        { id: 3, name: 'CloudTech Solutions', industry_name: 'Cloud', logo: '☁️' }
      ].filter(s => s.name.toLowerCase().includes(query.toLowerCase()));

      const mockJobs = [
        { id: 1, title: 'Senior Frontend Developer', startup_name: 'TechFlow AI' },
        { id: 2, title: 'Product Manager', startup_name: 'DataTech Pro' },
        { id: 3, title: 'DevOps Engineer', startup_name: 'CloudTech Solutions' }
      ].filter(j => j.title.toLowerCase().includes(query.toLowerCase()));

      setQuickSearchResults({
        startups: mockStartups.slice(0, 3),
        jobs: mockJobs.slice(0, 3)
      });
      setIsSearching(false);
    } catch (error) {
      console.error('Quick search error:', error);
      setQuickSearchResults({ startups: [], jobs: [] });
      setIsSearching(false);
    }
  };

  const saveRecentSearch = (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    
    const updated = [trimmed, ...recentSearches.filter(s => s !== trimmed)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  };

  const handleQuickSearchSubmit = (e) => {
    e.preventDefault();
    if (quickSearchQuery.trim()) {
      saveRecentSearch(quickSearchQuery);
      navigate('/startups', { state: { searchTerm: quickSearchQuery } });
      setQuickSearchQuery('');
      setShowQuickSearch(false);
      setSearchFocused(false);
    }
  };

  const handleQuickSearchClear = () => {
    setQuickSearchQuery('');
    setQuickSearchResults({ startups: [], jobs: [] });
  };

  const handleSearchItemClick = (type, item) => {
    if (type === 'startup') {
      navigate(`/startups/${item.id}`);
    } else if (type === 'job') {
      navigate(`/jobs/${item.id}`);
    } else if (type === 'search') {
      saveRecentSearch(item);
      navigate('/startups', { state: { searchTerm: item } });
    }
    setQuickSearchQuery('');
    setShowQuickSearch(false);
    setSearchFocused(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/welcome');
    setIsProfileDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
    }
    return user?.username?.charAt(0)?.toUpperCase() || 'U';
  };

  const getUserDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.username || 'User';
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <LinkIcon className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Startlinker
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = isActivePath(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    title={item.description}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Enhanced Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8" ref={searchRef}>
            <div className="relative w-full">
              <form onSubmit={handleQuickSearchSubmit} className="w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {isSearching ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                    ) : (
                      <Search className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={quickSearchQuery}
                    onChange={(e) => setQuickSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    placeholder="Search startups, jobs..."
                    className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white text-sm transition-all duration-200"
                  />
                  {quickSearchQuery && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={handleQuickSearchClear}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </form>

              {/* Enhanced Quick Search Dropdown */}
              {showQuickSearch && searchFocused && (
                <div 
                  ref={dropdownRef}
                  className="absolute z-50 mt-2 w-full bg-white shadow-xl max-h-96 rounded-xl py-2 text-base ring-1 ring-black ring-opacity-5 overflow-auto border border-gray-100"
                >
                  {/* Search Results */}
                  {quickSearchQuery.length > 1 && (quickSearchResults.startups.length > 0 || quickSearchResults.jobs.length > 0) ? (
                    <>
                      {quickSearchResults.startups.length > 0 && (
                        <div>
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-50">
                            Startups
                          </div>
                          {quickSearchResults.startups.map((startup) => (
                            <button
                              key={startup.id}
                              onClick={() => handleSearchItemClick('startup', startup)}
                              className="w-full cursor-pointer select-none relative py-3 pl-4 pr-9 hover:bg-gray-50 text-gray-900 transition-colors flex items-center"
                            >
                              <span className="text-lg mr-3">{startup.logo}</span>
                              <div className="text-left">
                                <span className="block font-medium">{startup.name}</span>
                                <span className="block text-sm text-gray-500">{startup.industry_name}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {quickSearchResults.jobs.length > 0 && (
                        <div>
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-50">
                            Jobs
                          </div>
                          {quickSearchResults.jobs.map((job) => (
                            <button
                              key={job.id}
                              onClick={() => handleSearchItemClick('job', job)}
                              className="w-full cursor-pointer select-none relative py-3 pl-4 pr-9 hover:bg-gray-50 text-gray-900 transition-colors flex items-center"
                            >
                              <Briefcase className="w-4 h-4 text-gray-400 mr-3" />
                              <div className="text-left">
                                <span className="block font-medium">{job.title}</span>
                                <span className="block text-sm text-gray-500">{job.startup_name}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : quickSearchQuery.length === 0 ? (
                    <>
                      {/* Recent Searches */}
                      {recentSearches.length > 0 && (
                        <div>
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-50 flex items-center justify-between">
                            <span>Recent Searches</span>
                            <button
                              onClick={() => {
                                setRecentSearches([]);
                                localStorage.removeItem('recent_searches');
                              }}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium normal-case"
                            >
                              Clear
                            </button>
                          </div>
                          {recentSearches.map((search, index) => (
                            <button
                              key={index}
                              onClick={() => handleSearchItemClick('search', search)}
                              className="w-full cursor-pointer select-none relative py-3 pl-4 pr-9 hover:bg-gray-50 text-gray-900 transition-colors flex items-center"
                            >
                              <Clock className="w-4 h-4 text-gray-400 mr-3" />
                              <span className="text-left">{search}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Trending Searches */}
                      <div>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-50">
                          Trending Searches
                        </div>
                        {trendingSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearchItemClick('search', search)}
                            className="w-full cursor-pointer select-none relative py-3 pl-4 pr-9 hover:bg-gray-50 text-gray-900 transition-colors flex items-center"
                          >
                            <TrendingUp className="w-4 h-4 text-gray-400 mr-3" />
                            <span className="text-left">{search}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : null}

                  {/* Search All Option */}
                  {quickSearchQuery.length > 1 && (
                    <div className="border-t border-gray-50 px-4 py-2">
                      <button
                        onClick={handleQuickSearchSubmit}
                        className="flex items-center w-full text-left py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Search all for "{quickSearchQuery}"
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <NotificationBell />

            {/* Enhanced User Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 p-1.5 hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-medium text-sm">
                    {getUserInitials()}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900">{getUserDisplayName()}</div>
                  {user?.is_premium && (
                    <div className="text-xs text-amber-600 flex items-center">
                      <Award className="w-3 h-3 mr-1" />
                      Premium
                    </div>
                  )}
                  {(user?.is_staff || user?.is_superuser) && (
                    <div className="text-xs text-blue-600 flex items-center">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </div>
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Enhanced Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsProfileDropdownOpen(false)} 
                  />
                  <div className="fixed right-4 top-16 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 max-h-[calc(100vh-80px)] overflow-y-auto sm:absolute sm:right-0 sm:top-auto sm:mt-2">
                    {/* Profile Header */}
                    <div className="px-4 py-3 border-b border-gray-50 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                          <span className="text-white font-medium">
                            {getUserInitials()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900 truncate">{getUserDisplayName()}</div>
                          <div className="text-sm text-gray-500 truncate">{user?.email}</div>
                          <div className="flex items-center space-x-3 mt-1">
                            {user?.is_premium && (
                              <div className="text-xs text-amber-600 flex items-center">
                                <Award className="w-3 h-3 mr-1" />
                                Premium
                              </div>
                            )}
                            {(user?.is_staff || user?.is_superuser) && (
                              <div className="text-xs text-blue-600 flex items-center">
                                <Shield className="w-3 h-3 mr-1" />
                                Admin
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* User Stats */}
                    {userStats && (
                      <div className="px-4 py-3 border-b border-gray-50">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-2 bg-gray-50 rounded-lg">
                            <div className="text-lg font-semibold text-gray-900">{userStats.totals?.bookmarks || 0}</div>
                            <div className="text-xs text-gray-500">Bookmarks</div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded-lg">
                            <div className="text-lg font-semibold text-gray-900">{userStats.totals?.ratings || 0}</div>
                            <div className="text-xs text-gray-500">Ratings</div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded-lg">
                            <div className="text-lg font-semibold text-gray-900">{userStats.totals?.applications || 0}</div>
                            <div className="text-xs text-gray-500">Applied</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Menu Items */}
                    <div className="py-2">
                      {getMenuItems().map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-2.5 text-sm transition-colors ${
                              item.isAdmin 
                                ? 'text-blue-700 hover:bg-blue-50' 
                                : item.path === '/my-claims'
                                  ? 'text-orange-700 hover:bg-orange-50'
                                  : 'text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setIsProfileDropdownOpen(false)}
                            title={item.description}
                          >
                            <IconComponent className={`w-4 h-4 mr-3 flex-shrink-0 ${
                              item.isAdmin 
                                ? 'text-blue-600' 
                                : item.path === '/my-claims'
                                  ? 'text-orange-600'
                                  : 'text-gray-400'
                            }`} />
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.isAdmin && (
                              <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex-shrink-0">
                                Admin
                              </span>
                            )}
                            {item.path === '/my-claims' && (
                              <span className="ml-auto bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full flex-shrink-0">
                                New
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>

                    {/* Upgrade to Premium (if not premium) */}
                    {!user?.is_premium && (
                      <div className="px-4 py-3 border-t border-gray-50">
                        <button
                          onClick={() => {
                            navigate('/settings');
                            setIsProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-center px-3 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl hover:from-amber-500 hover:to-orange-600 transition-colors font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          <Rocket className="w-4 h-4 mr-2" />
                          Upgrade to Premium
                        </button>
                      </div>
                    )}

                    {/* Logout */}
                    <div className="px-4 py-2 border-t border-gray-50">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 max-h-[calc(100vh-64px)] overflow-y-auto">
            {/* Mobile Search */}
            <div className="px-4 mb-4 md:hidden">
              <form onSubmit={handleQuickSearchSubmit}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={quickSearchQuery}
                    onChange={(e) => setQuickSearchQuery(e.target.value)}
                    placeholder="Search startups, jobs..."
                    className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all"
                  />
                </div>
              </form>
            </div>

            {/* Mobile Navigation */}
            <div className="space-y-1 px-4">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = isActivePath(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IconComponent className="w-4 h-4 mr-3 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate">{item.label}</div>
                      <div className="text-xs text-gray-500 truncate">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Profile Section */}
            <div className="mt-6 pt-6 border-t border-gray-100 px-4">
              <div className="flex items-center space-x-3 mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                  <span className="text-white font-medium">
                    {getUserInitials()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 truncate">{getUserDisplayName()}</div>
                  <div className="text-sm text-gray-500 truncate">{user?.email}</div>
                  {(user?.is_staff || user?.is_superuser) && (
                    <div className="text-xs text-blue-600 flex items-center mt-1">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                {getMenuItems().map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-3 py-2.5 text-sm rounded-xl transition-colors ${
                        item.isAdmin 
                          ? 'text-blue-700 hover:bg-blue-50' 
                          : item.path === '/my-claims'
                            ? 'text-orange-700 hover:bg-orange-50'
                            : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <IconComponent className={`w-4 h-4 mr-3 flex-shrink-0 ${
                        item.isAdmin 
                          ? 'text-blue-600' 
                          : item.path === '/my-claims'
                            ? 'text-orange-600'
                            : 'text-gray-400'
                      }`} />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.isAdmin && (
                        <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex-shrink-0">
                          Admin
                        </span>
                      )}
                      {item.path === '/my-claims' && (
                        <span className="ml-auto bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full flex-shrink-0">
                          New
                        </span>
                      )}
                    </Link>
                  );
                })}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
