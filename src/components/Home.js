// src/components/Home.js - Fixed welcome page with proper navigation
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, ChevronDown, ChevronRight, Filter, MapPin, 
  Briefcase, Building, Users, Rocket, Zap, Award, 
  DollarSign, TrendingUp, ArrowRight, Star, Calendar
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_startups: 0,
    total_jobs: 0,
    total_industries: 0
  });
  const [featuredStartups, setFeaturedStartups] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [activeSlide, setActiveSlide] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [industries, setIndustries] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Simulated data fetch - replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API delay
        setTimeout(() => {
          setStats({
            total_startups: 1248,
            total_jobs: 567,
            total_industries: 26
          });
          
          setFeaturedStartups([
            {
              id: 1,
              name: "HealthAI",
              logo: "🏥",
              description: "AI-powered diagnostic platform revolutionizing healthcare with real-time analysis and predictive insights for medical professionals.",
              industry_name: "HealthTech",
              location: "Boston, MA",
              employee_count: 45,
              funding_amount: "$15M Series A",
              valuation: "$80M",
              growth_rate: "175% YoY",
              tags_list: ["AI", "Healthcare", "SaaS"]
            },
            {
              id: 2,
              name: "EcoCharge",
              logo: "⚡",
              description: "Sustainable energy solutions focused on ultra-fast charging infrastructure for electric vehicles using renewable energy sources.",
              industry_name: "GreenTech",
              location: "Austin, TX",
              employee_count: 32,
              funding_amount: "$12M Series A",
              valuation: "$60M",
              growth_rate: "210% YoY",
              tags_list: ["CleanTech", "EV", "Infrastructure"]
            },
            {
              id: 3,
              name: "CryptoSafe",
              logo: "🔐",
              description: "Enterprise-grade security platform for digital assets with institutional-level custody solutions and multi-signature protection.",
              industry_name: "FinTech",
              location: "New York, NY",
              employee_count: 28,
              funding_amount: "$8.5M Seed",
              valuation: "$45M",
              growth_rate: "156% YoY",
              tags_list: ["Blockchain", "Security", "Enterprise"]
            }
          ]);
          
          setRecentJobs([
            {
              id: 1,
              title: "Senior Machine Learning Engineer",
              startup_name: "HealthAI",
              location: "Boston, MA",
              is_remote: true,
              job_type_name: "Full-time",
              salary_range: "$140K - $180K",
              posted_ago: "2 days ago",
              is_urgent: true
            },
            {
              id: 2,
              title: "Frontend React Developer",
              startup_name: "EcoCharge",
              location: "Austin, TX",
              is_remote: true,
              job_type_name: "Full-time",
              salary_range: "$110K - $140K",
              posted_ago: "3 days ago",
              is_urgent: false
            },
            {
              id: 3,
              title: "Blockchain Security Specialist",
              startup_name: "CryptoSafe",
              location: "New York, NY",
              is_remote: false,
              job_type_name: "Full-time",
              salary_range: "$150K - $190K",
              posted_ago: "1 day ago",
              is_urgent: true
            }
          ]);
          
          // Add upcoming events data
          setUpcomingEvents([
            {
              id: 1,
              title: "StartupHub Pitch Night",
              date: "June 15, 2025",
              time: "6:00 PM - 9:00 PM",
              location: "San Francisco, CA",
              isVirtual: false,
              description: "Watch 10 promising startups pitch to a panel of top investors."
            },
            {
              id: 2,
              title: "AI in Healthcare Webinar",
              date: "June 10, 2025",
              time: "1:00 PM - 2:30 PM",
              location: "Online",
              isVirtual: true,
              description: "Learn how artificial intelligence is transforming healthcare delivery and research."
            },
            {
              id: 3,
              title: "Fundraising Masterclass",
              date: "June 22, 2025",
              time: "10:00 AM - 12:00 PM",
              location: "Online",
              isVirtual: true,
              description: "Expert tips and strategies for early-stage startup fundraising."
            }
          ]);
          
          // Add industries
          setIndustries([
            { id: 1, name: "FinTech", icon: "💰", count: 187 },
            { id: 2, name: "HealthTech", icon: "🏥", count: 143 },
            { id: 3, name: "EdTech", icon: "📚", count: 102 },
            { id: 4, name: "AI/ML", icon: "🤖", count: 237 },
            { id: 5, name: "CleanTech", icon: "🌱", count: 89 },
            { id: 6, name: "E-commerce", icon: "🛒", count: 156 }
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();

    // Auto-cycle through featured startups
    const interval = setInterval(() => {
      setActiveSlide(prevSlide => 
        prevSlide === featuredStartups.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000);
    
    // Scroll listener for navbar
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [featuredStartups.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      return;
    }
    
    // Navigate to authenticated startups page with search
    navigate('/auth', { state: { redirectTo: '/startups', searchTerm } });
  };

  const handleExploreStartups = () => {
    navigate('/auth', { state: { redirectTo: '/startups' } });
  };

  const handleBrowseJobs = () => {
    navigate('/auth', { state: { redirectTo: '/jobs' } });
  };

  const handleGetStarted = () => {
    navigate('/auth', { state: { showSignUp: true } });
  };

  const handleSignUp = () => {
    navigate('/auth', { state: { showSignUp: true } });
  };

  const handleLogin = () => {
    navigate('/auth', { state: { showSignUp: false } });
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const statCards = [
    {
      title: 'Innovative Startups',
      value: stats.total_startups.toLocaleString(),
      icon: <Building className="w-6 h-6" />,
      color: 'blue',
      description: 'Discover groundbreaking companies'
    },
    {
      title: 'Open Opportunities',
      value: stats.total_jobs.toLocaleString(),
      icon: <Briefcase className="w-6 h-6" />,
      color: 'green',
      description: 'Find your dream job in tech'
    },
    {
      title: 'Industry Categories',
      value: stats.total_industries.toLocaleString(),
      icon: <Award className="w-6 h-6" />,
      color: 'purple',
      description: 'Explore diverse sectors'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">Loading StartupHub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Page Navbar - Different from authenticated navbar */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-white bg-opacity-10 backdrop-blur-sm py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className={`ml-3 text-xl font-bold transition-colors ${
                isScrolled 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' 
                  : 'text-white'
              }`}>
                StartupHub
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={handleExploreStartups}
                className={`transition-colors ${
                  isScrolled ? 'text-gray-600 hover:text-blue-600' : 'text-white hover:text-blue-200'
                }`}
              >
                Startups
              </button>
              <button 
                onClick={handleBrowseJobs}
                className={`transition-colors ${
                  isScrolled ? 'text-gray-600 hover:text-blue-600' : 'text-white hover:text-blue-200'
                }`}
              >
                Jobs
              </button>
              <button className={`transition-colors ${
                isScrolled ? 'text-gray-600 hover:text-blue-600' : 'text-white hover:text-blue-200'
              }`}>
                Events
              </button>
              <button className={`transition-colors ${
                isScrolled ? 'text-gray-600 hover:text-blue-600' : 'text-white hover:text-blue-200'
              }`}>
                About
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogin}
                className={`hidden md:block px-4 py-2 rounded-lg border transition-colors ${
                  isScrolled 
                    ? 'border-gray-200 text-gray-600 hover:bg-gray-50' 
                    : 'border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                Login
              </button>
              <button
                onClick={handleSignUp}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isScrolled 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-white text-blue-700 hover:bg-blue-50'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 overflow-hidden pt-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjMDAwIiBvcGFjaXR5PSIuMDUiIGQ9Ik0wIDBoMTQ0MHY3NjBIMHoiLz48cGF0aCBkPSJNLTQ3MS41IDE5MS41YzAtMzMuMTM3IDI2Ljg2My02MCA2MC02MEg2OTQuNWMzMy4xMzcgMCA2MCAyNi44NjMgNjAgNjB2NjUxYzAgMzMuMTM3LTI2Ljg2MyA2MC02MCA2MEgtNDExLjVjLTMzLjEzNyAwLTYwLTI2Ljg2My02MC02MHYtNjUxeiIgc3Ryb2tlPSJ1cmwoI2EpIiBzdHJva2Utd2lkdGg9IjEuNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTQzIC0yMzguNDMgNTg1LjQwMykiLz48cGF0aCBkPSJNLTIyMyAzNjljMC0zMy4xMzcgMjYuODYzLTYwIDYwLTYwaDEyMDZjMzMuMTM3IDAgNjAgMjYuODYzIDYwIDYwdjIyMGMwIDMzLjEzNy0yNi44NjMgNjAtNjAgNjBILTE2M2MtMzMuMTM3IDAtNjAtMjYuODYzLTYwLTYwVjM2OXoiIHN0cm9rZT0idXJsKCNiKSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHRyYW5zZm9ybT0icm90YXRlKC00MyAtMjA2LjcyOSA1MTYuMjM0KSIvPjwvZz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjQiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iMCIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9Ii40Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9IjAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4=')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Discover the Next Wave of <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">Innovation</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Connect with cutting-edge startups, find your dream role, and be part of building the future.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={handleExploreStartups}
                className="px-8 py-4 bg-white text-blue-700 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
              >
                Explore Startups
              </button>
              <button 
                onClick={handleBrowseJobs}
                className="px-8 py-4 bg-blue-800 bg-opacity-30 text-white border-2 border-white border-opacity-30 backdrop-blur-sm rounded-xl font-bold text-lg hover:bg-opacity-40 transition-colors shadow-lg"
              >
                Browse Jobs
              </button>
            </div>
          </div>
          
          <div className="relative mt-16 max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 transform -rotate-1 rounded-2xl shadow-2xl"></div>
            <div className="relative bg-white rounded-2xl p-6 md:p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Quick Search</h2>
                <span className="text-blue-600 text-sm">Find what you're looking for</span>
              </div>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search startups, jobs, or industries..." 
                      className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                      className="appearance-none w-full md:w-40 px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    >
                      <option value="all">All Categories</option>
                      <option value="startups">Startups</option>
                      <option value="jobs">Jobs</option>
                      <option value="industries">Industries</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <button 
                    type="submit" 
                    className="bg-blue-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Search</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-500">Popular:</span>
                    <button 
                      type="button" 
                      onClick={() => setSearchTerm("AI Startups")}
                      className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700 transition-colors"
                    >
                      AI Startups
                    </button>
                    <button 
                      type="button"
                      onClick={() => setSearchTerm("Remote Jobs")}
                      className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700 transition-colors"
                    >
                      Remote Jobs
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setSearchTerm("FinTech");
                        setSearchCategory("industries");
                      }}
                      className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700 transition-colors"
                    >
                      FinTech
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    onClick={toggleFilters}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Filter className="w-4 h-4 mr-1" />
                    {showFilters ? 'Hide Filters' : 'Advanced Filters'}
                  </button>
                </div>
                
                {showFilters && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 animate-fadeIn">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
                        <option value="">Any Location</option>
                        <option value="sf">San Francisco, CA</option>
                        <option value="nyc">New York, NY</option>
                        <option value="austin">Austin, TX</option>
                        <option value="remote">Remote Only</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
                        <option value="">All Industries</option>
                        {industries.map(industry => (
                          <option key={industry.id} value={industry.id}>
                            {industry.icon} {industry.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
                        <option value="">Any Size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201+">201+ employees</option>
                      </select>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Fastest Growing Startup Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of founders, job-seekers, and investors building the future together
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {statCards.map((card, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-200"
              >
                <div className={`w-14 h-14 rounded-full bg-${card.color}-100 flex items-center justify-center mb-6`}>
                  <div className={`text-${card.color}-600`}>{card.icon}</div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{card.value}</h3>
                <p className="text-lg font-medium text-gray-700 mb-2">{card.title}</p>
                <p className="text-gray-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Startups Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Startups</h2>
              <p className="text-gray-600 max-w-2xl">
                Discover innovative companies that are changing the world and defining the future
              </p>
            </div>
            <button 
              onClick={handleExploreStartups}
              className="text-blue-600 font-medium flex items-center hover:text-blue-700"
            >
              View All
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Featured Startup Spotlight */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl overflow-hidden shadow-xl">
              {featuredStartups.length > 0 && (
                <div className="p-8 text-white relative h-full">
                  <div className="absolute right-8 top-8 text-6xl animate-bounce">
                    {featuredStartups[activeSlide].logo}
                  </div>
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm mb-4">
                    Featured Startup
                  </span>
                  <h3 className="text-3xl font-bold mb-2">{featuredStartups[activeSlide].name}</h3>
                  <p className="text-blue-100 mb-6">{featuredStartups[activeSlide].industry_name}</p>
                  <p className="text-lg text-blue-50 mb-6 max-w-md">
                    {featuredStartups[activeSlide].description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <div className="flex items-center text-blue-100 mb-1">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        <span className="font-medium">Growth</span>
                      </div>
                      <div className="text-xl font-bold">{featuredStartups[activeSlide].growth_rate}</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <div className="flex items-center text-blue-100 mb-1">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span className="font-medium">Funding</span>
                      </div>
                      <div className="text-xl font-bold">{featuredStartups[activeSlide].funding_amount}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{featuredStartups[activeSlide].location}</span>
                      <span className="text-blue-200">•</span>
                      <Users className="w-4 h-4" />
                      <span>{featuredStartups[activeSlide].employee_count} employees</span>
                    </div>
                    <div className="flex space-x-1">
                      {featuredStartups.map((_, index) => (
                        <button 
                          key={index}
                          onClick={() => setActiveSlide(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === activeSlide ? 'w-6 bg-white' : 'bg-white/40'
                          }`}
                          aria-label={`View startup ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Recent Jobs */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Latest Opportunities</h3>
                  <button 
                    onClick={handleBrowseJobs}
                    className="text-green-600 font-medium flex items-center hover:text-green-700"
                  >
                    View All
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </button>
                </div>
                
                <div className="space-y-5">
                  {recentJobs.map((job) => (
                    <div 
                      key={job.id} 
                      className="border-l-4 border-green-500 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors group cursor-pointer"
                      onClick={handleBrowseJobs}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">{job.title}</h4>
                          <p className="text-sm text-gray-600">{job.startup_name}</p>
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
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{job.posted_ago}</p>
                          {job.is_urgent && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                              Urgent
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <button 
                    onClick={handleBrowseJobs}
                    className="inline-block px-5 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Find Your Next Role
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
              <p className="text-gray-600 max-w-2xl">
                Connect with the startup community through virtual and in-person events
              </p>
            </div>
            <button className="text-purple-600 font-medium flex items-center hover:text-purple-700">
              View All Events
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.map(event => (
              <div 
                key={event.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className={`h-3 ${event.isVirtual ? 'bg-purple-500' : 'bg-green-500'}`}></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.isVirtual 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {event.isVirtual ? 'Virtual' : 'In-Person'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleSignUp}
                    className="mt-6 w-full px-4 py-2 bg-white border border-purple-500 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center"
                  >
                    <span>Register Now</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Industry Exploration Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore by Industry</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover startups and jobs across different sectors
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {industries.map((industry) => (
              <button 
                key={industry.id}
                onClick={handleExploreStartups}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 text-center"
              >
                <div className="text-4xl mb-3">{industry.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{industry.name}</h3>
                <p className="text-sm text-gray-600">{industry.count} startups</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose StartupHub</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The complete platform for startup discovery, networking, and growth
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Startup Discovery</h3>
              <p className="text-gray-600">
                Find and connect with innovative startups across all industries. Get detailed insights into their growth, funding, and vision.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Career Opportunities</h3>
              <p className="text-gray-600">
                Explore thousands of jobs at the most exciting companies. Find remote, hybrid, or on-site roles that match your skills and aspirations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Industry Insights</h3>
              <p className="text-gray-600">
                Stay updated with the latest trends, funding rounds, and innovations. Get data-driven insights to make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjMDAwIiBvcGFjaXR5PSIuMDUiIGQ9Ik0wIDBoMTQ0MHY3NjBIMHoiLz48cGF0aCBkPSJNLTQ3MS41IDE5MS41YzAtMzMuMTM3IDI2Ljg2My02MCA2MC02MEg2OTQuNWMzMy4xMzcgMCA2MCAyNi44NjMgNjAgNjB2NjUxYzAgMzMuMTM3LTI2Ljg2MyA2MC02MCA2MEgtNDExLjVjLTMzLjEzNyAwLTYwLTI2Ljg2My02MC02MHYtNjUxeiIgc3Ryb2tlPSJ1cmwoI2EpIiBzdHJva2Utd2lkdGg9IjEuNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTQzIC0yMzguNDMgNTg1LjQwMykiLz48cGF0aCBkPSJNLTIyMyAzNjljMC0zMy4xMzcgMjYuODYzLTYwIDYwLTYwaDEyMDZjMzMuMTM3IDAgNjAgMjYuODYzIDYwIDYwdjIyMGMwIDMzLjEzNy0yNi44NjMgNjAtNjAgNjBILTE2M2MtMzMuMTM3IDAtNjAtMjYuODYzLTYwLTYwVjM2OXoiIHN0cm9rZT0idXJsKCNiKSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHRyYW5zZm9ybT0icm90YXRlKC00MyAtMjA2LjcyOSA1MTYuMjM0KSIvPjwvZz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjQiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iMCIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9Ii40Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9IjAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4=')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Discover Your Next Opportunity?</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Join thousands of professionals connecting with innovative startups and finding their dream roles.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleSignUp}
              className="px-8 py-4 bg-white text-blue-700 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              Create Account
            </button>
            <button 
              onClick={handleExploreStartups}
              className="px-8 py-4 bg-blue-800 bg-opacity-30 text-white border-2 border-white border-opacity-30 backdrop-blur-sm rounded-xl font-bold text-lg hover:bg-opacity-40 transition-colors shadow-lg"
            >
              Explore Platform
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">StartupHub</h3>
                </div>
              </div>
              <p className="text-gray-400 mb-6">
                Connecting talent with opportunity in the startup ecosystem.
              </p>
              <div className="flex space-x-4">
                <button className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-3">
                <li><button onClick={handleExploreStartups} className="text-gray-400 hover:text-white transition-colors">Startups</button></li>
                <li><button onClick={handleBrowseJobs} className="text-gray-400 hover:text-white transition-colors">Jobs</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">Investors</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">Events</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">Insights</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><button className="text-gray-400 hover:text-white transition-colors">Blog</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">Help Center</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">Guides</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">Community</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">Podcast</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li><button className="text-gray-400 hover:text-white transition-colors">About Us</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">Careers</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">Press</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">Contact</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">Partnerships</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 StartupHub. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <button className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</button>
              <button className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</button>
              <button className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
