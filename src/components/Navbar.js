// src/components/Navbar.js - Complete Enhanced Navbar with admin link
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { NotificationBell } from './NotificationSystem';
import axios from 'axios';
import { 
  Home, Building, Briefcase, User, LogOut, Search, 
  Menu, X, ChevronDown, Settings, HelpCircle,
  Star, Bookmark, Activity, TrendingUp, Bell,
  MessageCircle, Award, Shield, CreditCard
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');
  const [quickSearchResults, setQuickSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const [userStats, setUserStats] = useState(null);
  
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

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

  // Add admin menu item dynamically for admin users
  const getMenuItems = () => {
    const items = [...profileMenuItems];
    
    // Insert admin link after "View Profile" (index 1)
    if (user?.is_staff || user?.is_superuser) {
      items.splice(1, 0, { 
        label: 'Admin Panel', 
        icon: Shield, 
        path: '/admin',
        isAdmin: true 
      });
    }
    
    return items;
  };

  // Load user stats on mount
  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          searchRef.current && !searchRef.current.contains(event.target)) {
        setShowQuickSearch(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadUserStats = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/auth/stats/');
      setUserStats(response.data);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

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
    if (quickSearchQuery.trim()) {
      navigate('/startups', { state: { searchTerm: quickSearchQuery } });
      setQuickSearchQuery('');
      setShowQuickSearch(false);
    }
  };

  const handleQuickSearchClear = () => {
    setQuickSearchQuery('');
    setQuickSearchResults([]);
    setShowQuickSearch(false);
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
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  StartupHub
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 ml-8">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = isActivePath(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
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

          {/* Search Bar */}
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
                    placeholder="Quick search startups, jobs..."
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  {quickSearchQuery && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={handleQuickSearchClear}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </form>

              {/* Quick Search Dropdown */}
              {showQuickSearch && (quickSearchResults.startups.length > 0 || quickSearchResults.jobs.length > 0) && (
                <div 
                  ref={dropdownRef}
                  className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-80 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto border border-gray-200"
                >
                  {quickSearchResults.startups.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                        Startups
                      </div>
                      {quickSearchResults.startups.map((startup) => (
                        <Link
                          key={startup.id}
                          to={`/startups/${startup.id}`}
                          className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50 text-gray-900"
                          onClick={() => setShowQuickSearch(false)}
                        >
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{startup.logo}</span>
                            <div>
                              <span className="block font-medium">{startup.name}</span>
                              <span className="block text-sm text-gray-500">{startup.industry_name}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {quickSearchResults.jobs.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                        Jobs
                      </div>
                      {quickSearchResults.jobs.map((job) => (
                        <div
                          key={job.id}
                          className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50 text-gray-900"
                          onClick={() => {
                            navigate('/jobs', { state: { searchTerm: job.title } });
                            setShowQuickSearch(false);
                          }}
                        >
                          <div className="flex items-center">
                            <Briefcase className="w-4 h-4 text-gray-400 mr-3" />
                            <div>
                              <span className="block font-medium">{job.title}</span>
                              <span className="block text-sm text-gray-500">{job.startup_name}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Search All */}
                  <div className="border-t border-gray-100 px-3 py-2">
                    <button
                      onClick={handleQuickSearchSubmit}
                      className="flex items-center w-full text-left py-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Search all for "{quickSearchQuery}"
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <NotificationBell />

            {/* User Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-3 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {getUserInitials()}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900">{getUserDisplayName()}</div>
                  {user?.is_premium && (
                    <div className="text-xs text-yellow-600 flex items-center">
                      <Award className="w-3 h-3 mr-1" />
                      Premium
                    </div>
                  )}
                  {/* Show admin badge */}
                  {(user?.is_staff || user?.is_superuser) && (
                    <div className="text-xs text-blue-600 flex items-center">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </div>
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsProfileDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                    {/* Profile Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {getUserInitials()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{getUserDisplayName()}</div>
                          <div className="text-sm text-gray-500">{user?.email}</div>
                          <div className="flex items-center space-x-3 mt-1">
                            {user?.is_premium && (
                              <div className="text-xs text-yellow-600 flex items-center">
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
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-semibold text-gray-900">{userStats.totals?.bookmarks || 0}</div>
                            <div className="text-xs text-gray-500">Bookmarks</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-gray-900">{userStats.totals?.ratings || 0}</div>
                            <div className="text-xs text-gray-500">Ratings</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-gray-900">{userStats.totals?.applications || 0}</div>
                            <div className="text-xs text-gray-500">Applications</div>
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
                            className={`flex items-center px-4 py-2 text-sm transition-colors ${
                              item.isAdmin 
                                ? 'text-blue-700 hover:bg-blue-50' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <IconComponent className={`w-4 h-4 mr-3 ${
                              item.isAdmin ? 'text-blue-600' : 'text-gray-400'
                            }`} />
                            {item.label}
                            {item.isAdmin && (
                              <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                Admin
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>

                    {/* Upgrade to Premium (if not premium) */}
                    {!user?.is_premium && (
                      <div className="px-4 py-3 border-t border-gray-100">
                        <button
                          onClick={() => {
                            navigate('/settings');
                            setIsProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-center px-3 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-colors"
                        >
                          <Award className="w-4 h-4 mr-2" />
                          Upgrade to Premium
                        </button>
                      </div>
                    )}

                    {/* Logout */}
                    <div className="px-4 py-2 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
          <div className="lg:hidden border-t border-gray-200 py-4">
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
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IconComponent className="w-4 h-4 mr-3" />
                    <div>
                      <div>{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Profile Section */}
            <div className="mt-6 pt-6 border-t border-gray-200 px-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {getUserInitials()}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{getUserDisplayName()}</div>
                  <div className="text-sm text-gray-500">{user?.email}</div>
                  {(user?.is_staff || user?.is_superuser) && (
                    <div className="text-xs text-blue-600 flex items-center mt-1">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                {getMenuItems().slice(0, 4).map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                        item.isAdmin 
                          ? 'text-blue-700 hover:bg-blue-50' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <IconComponent className={`w-4 h-4 mr-3 ${
                        item.isAdmin ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      {item.label}
                      {item.isAdmin && (
                        <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Admin
                        </span>
                      )}
                    </Link>
                  );
                })}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
