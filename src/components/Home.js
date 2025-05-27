import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Users, DollarSign, Star, Heart, Bookmark, TrendingUp } from 'lucide-react';
import { startupsAPI, industriesAPI, statsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Home = ({ onStartupClick }) => {
  const [startups, setStartups] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [featuredStartups, setFeaturedStartups] = useState([]);
  const [currentFeatured, setCurrentFeatured] = useState(0);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadStartups();
  }, [searchTerm, selectedIndustry]);

  useEffect(() => {
    if (featuredStartups.length > 0) {
      const interval = setInterval(() => {
        setCurrentFeatured((prev) => (prev + 1) % featuredStartups.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [featuredStartups]);

  const loadInitialData = async () => {
    try {
      const [industriesRes, statsRes, featuredRes] = await Promise.all([
        industriesAPI.getAll().catch(() => ({ data: [] })),
        statsAPI.getDashboard().catch(() => ({ data: {} })),
        startupsAPI.getFeatured().catch(() => ({ data: [] })),
      ]);
      
      setIndustries(industriesRes.data);
      setStats(statsRes.data);
      setFeaturedStartups(featuredRes.data);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const loadStartups = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedIndustry) params.industry = selectedIndustry;
      
      const response = await startupsAPI.getAll(params);
      setStartups(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading startups:', error);
      // Fallback to sample data if API fails
      setStartups([
        {
          id: 1,
          name: "TechFlow AI",
          logo: "🤖",
          description: "Revolutionary AI platform that automates complex business workflows.",
          industry_name: "Tech",
          location: "San Francisco, CA",
          employee_count: 45,
          funding_amount: "$15M Series A",
          average_rating: 4.5,
          total_ratings: 12,
          is_featured: true,
          is_liked: false,
          is_bookmarked: false,
          tags_list: ["AI", "Automation", "Enterprise"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (startupId, e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please login to like startups');
      return;
    }
    
    try {
      const result = await startupsAPI.like(startupId);
      console.log('Like result:', result.data);
      loadStartups(); // Refresh data
    } catch (error) {
      console.error('Error liking startup:', error);
    }
  };

  const handleBookmark = async (startupId, e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please login to bookmark startups');
      return;
    }
    
    try {
      const result = await startupsAPI.bookmark(startupId);
      console.log('Bookmark result:', result.data);
      loadStartups(); // Refresh data
    } catch (error) {
      console.error('Error bookmarking startup:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading StartupHub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">{stats.total_startups || 0}</div>
          <div className="text-gray-600 font-medium">Innovative Startups</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">{stats.total_jobs || 0}</div>
          <div className="text-gray-600 font-medium">Open Positions</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
          <div className="text-4xl font-bold text-purple-600 mb-2">{stats.total_industries || 0}</div>
          <div className="text-gray-600 font-medium">Industries</div>
        </div>
      </div>

      {/* Featured Carousel */}
      {featuredStartups.length > 0 && (
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 grid md:grid-cols-3 gap-6 items-center">
            <div className="text-center">
              <div className="text-8xl mb-4 animate-bounce">{featuredStartups[currentFeatured]?.logo}</div>
              <div className="flex justify-center space-x-2">
                {featuredStartups.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentFeatured ? 'bg-white w-8' : 'bg-white/50 w-2'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-4xl font-bold mb-2">{featuredStartups[currentFeatured]?.name}</h3>
                <p className="text-blue-100 text-lg mb-4">{featuredStartups[currentFeatured]?.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center text-green-400 mb-2">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Growth</span>
                  </div>
                  <div className="text-2xl font-bold">{featuredStartups[currentFeatured]?.growth_rate || 'N/A'}</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center text-yellow-400 mb-2">
                    <DollarSign className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Valuation</span>
                  </div>
                  <div className="text-2xl font-bold">{featuredStartups[currentFeatured]?.valuation || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-8 border border-gray-200/50">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Discover Your Next Opportunity</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search startups, industries, or technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all text-lg"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white/90 backdrop-blur-sm transition-all text-lg"
            >
              <option value="">🌟 All Industries</option>
              {industries.map((industry) => (
                <option key={industry.id} value={industry.id}>
                  {industry.icon} {industry.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Startups Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {startups.map((startup) => (
          <div
            key={startup.id}
            onClick={() => onStartupClick(startup)}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 border border-gray-100 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 rounded-2xl"></div>
            
            <div className="p-6 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                    {startup.logo}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {startup.name}
                    </h3>
                    <div className="text-sm text-gray-600">{startup.industry_name}</div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  {startup.is_featured && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </span>
                  )}
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => handleLike(startup.id, e)}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        startup.is_liked 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-500'
                      }`}
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleBookmark(startup.id, e)}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        startup.is_bookmarked 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-500'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2 group-hover:text-gray-700 transition-colors">
                {startup.description}
              </p>
              
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {startup.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {startup.employee_count} employees
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {startup.funding_amount}
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= (startup.average_rating || 0) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs">({startup.total_ratings || 0})</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {(startup.tags_list || []).slice(0, 3).map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {startups.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="text-8xl mb-6">🔍</div>
          <h3 className="text-2xl font-bold text-gray-600 mb-4">No startups found</h3>
          <p className="text-gray-500 text-lg">Try adjusting your search or filter criteria</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedIndustry('');
            }}
            className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;