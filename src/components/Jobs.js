import { useState, useEffect } from "react";
import { 
  Search, Filter, X, ChevronDown, Clock, MapPin, 
  Briefcase, DollarSign, Bookmark, Zap, AlertCircle
} from "lucide-react";

export default function EnhancedJobs() {
  const [jobs, setJobs] = useState([]);
  const [filterOptions, setFilterOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("-posted_at");
  const [visibleJobDetails, setVisibleJobDetails] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Simulated data fetch - replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API delay
        setTimeout(() => {
          const mockJobs = [
            {
              id: 1,
              title: "Senior Machine Learning Engineer",
              description: "Join our AI team to develop cutting-edge machine learning models for medical diagnostics. You'll work on state-of-the-art algorithms and collaborate with medical professionals to improve healthcare outcomes.",
              startup: {
                id: 1,
                name: "HealthAI",
                logo: "🏥",
                location: "Boston, MA",
                industry: "HealthTech",
                employee_count: 45
              },
              location: "Boston, MA",
              is_remote: true,
              job_type: {
                id: 1,
                name: "Full-time"
              },
              salary_range: "$140K - $180K",
              posted_at: "2023-05-04T10:00:00Z",
              posted_ago: "2 days ago",
              is_urgent: true,
              experience_level: "senior",
              experience_level_display: "Senior Level",
              application_count: 12,
              skills: ["Python", "TensorFlow", "PyTorch", "Medical Imaging"]
            },
            {
              id: 2,
              title: "Frontend React Developer",
              description: "Build responsive and intuitive user interfaces for our electric vehicle charging platform. You'll be responsible for implementing designs, optimizing performance, and ensuring a great user experience.",
              startup: {
                id: 2,
                name: "EcoCharge",
                logo: "⚡",
                location: "Austin, TX",
                industry: "GreenTech",
                employee_count: 32
              },
              location: "Austin, TX",
              is_remote: true,
              job_type: {
                id: 1,
                name: "Full-time"
              },
              salary_range: "$110K - $140K",
              posted_at: "2023-05-03T14:30:00Z",
              posted_ago: "3 days ago",
              is_urgent: false,
              experience_level: "mid",
              experience_level_display: "Mid Level",
              application_count: 24,
              skills: ["React", "JavaScript", "TypeScript", "HTML/CSS", "Redux"]
            },
            {
              id: 3,
              title: "Blockchain Security Specialist",
              description: "Help secure our platform for institutional digital asset custody. You'll analyze smart contracts, implement security protocols, and ensure the highest level of protection for client assets.",
              startup: {
                id: 3,
                name: "CryptoSafe",
                logo: "🔐",
                location: "New York, NY",
                industry: "FinTech",
                employee_count: 28
              },
              location: "New York, NY",
              is_remote: false,
              job_type: {
                id: 1,
                name: "Full-time"
              },
              salary_range: "$150K - $190K",
              posted_at: "2023-05-05T09:15:00Z",
              posted_ago: "1 day ago",
              is_urgent: true,
              experience_level: "senior",
              experience_level_display: "Senior Level",
              application_count: 8,
              skills: ["Blockchain", "Solidity", "Cryptography", "Security Auditing"]
            },
            {
              id: 4,
              title: "Product Manager",
              description: "Lead product development for our educational platform. You'll work with stakeholders to define requirements, prioritize features, and ensure successful product launches.",
              startup: {
                id: 4,
                name: "LearnSpace",
                logo: "📚",
                location: "Chicago, IL",
                industry: "EdTech",
                employee_count: 15
              },
              location: "Chicago, IL",
              is_remote: true,
              job_type: {
                id: 1,
                name: "Full-time"
              },
              salary_range: "$120K - $150K",
              posted_at: "2023-05-01T11:45:00Z",
              posted_ago: "5 days ago",
              is_urgent: false,
              experience_level: "mid",
              experience_level_display: "Mid Level",
              application_count: 18,
              skills: ["Product Management", "Agile", "User Research", "Roadmapping"]
            },
            {
              id: 5,
              title: "DevOps Engineer",
              description: "Build and maintain our cloud infrastructure and CI/CD pipelines. You'll optimize our deployment processes and ensure reliable, scalable systems.",
              startup: {
                id: 5,
                name: "CloudScale",
                logo: "☁️",
                location: "Seattle, WA",
                industry: "Cloud Infrastructure",
                employee_count: 22
              },
              location: "Seattle, WA",
              is_remote: true,
              job_type: {
                id: 1,
                name: "Full-time"
              },
              salary_range: "$130K - $160K",
              posted_at: "2023-05-02T16:20:00Z",
              posted_ago: "4 days ago",
              is_urgent: false,
              experience_level: "mid",
              experience_level_display: "Mid Level",
              application_count: 14,
              skills: ["AWS", "Kubernetes", "Docker", "CI/CD", "Terraform"]
            }
          ];
          
          const mockFilterOptions = {
            job_types: [
              { id: 1, name: "Full-time", job_count: 42 },
              { id: 2, name: "Part-time", job_count: 13 },
              { id: 3, name: "Contract", job_count: 24 },
              { id: 4, name: "Internship", job_count: 7 }
            ],
            experience_levels: [
              { value: "entry", label: "Entry Level", count: 18 },
              { value: "mid", label: "Mid Level", count: 35 },
              { value: "senior", label: "Senior Level", count: 26 },
              { value: "lead", label: "Lead/Principal", count: 12 }
            ],
            industries: [
              { id: 1, name: "FinTech", job_count: 18 },
              { id: 2, name: "HealthTech", job_count: 15 },
              { id: 3, name: "EdTech", job_count: 12 },
              { id: 4, name: "AI/ML", job_count: 22 },
              { id: 5, name: "GreenTech", job_count: 8 }
            ],
            popular_skills: [
              "JavaScript", "Python", "React", "Machine Learning", 
              "AWS", "UI/UX", "Node.js", "Product Management"
            ],
            locations: [
              "New York, NY", "San Francisco, CA", "Boston, MA", 
              "Austin, TX", "Seattle, WA", "Chicago, IL"
            ],
            posted_since_options: [
              { value: 1, label: "Last 24 hours" },
              { value: 3, label: "Last 3 days" },
              { value: 7, label: "Last week" },
              { value: 30, label: "Last month" }
            ]
          };
          
          setJobs(mockJobs);
          setFilterOptions(mockFilterOptions);
          setHasNextPage(true);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  const handleSearch = (e) => {
    e.preventDefault();
    // In real application, this would trigger an API call with the search term
    console.log("Searching for:", searchTerm);
    
    setActiveFilters(prev => ({
      ...prev,
      search: searchTerm || undefined
    }));
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const applyFilter = (key, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Reset to first page when filters change
    setCurrentPage(1);
  };
  
  const removeFilter = (key) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };
  
  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchTerm("");
  };
  
  const loadMoreJobs = () => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    
    // Simulate API call for pagination
    setTimeout(() => {
      // Add more jobs
      const newJobs = [
        {
          id: 6,
          title: "Data Scientist",
          description: "Analyze large datasets to extract insights and build predictive models for our financial platform.",
          startup: {
            id: 6,
            name: "FinAnalytica",
            logo: "📊",
            location: "San Francisco, CA",
            industry: "FinTech",
            employee_count: 41
          },
          location: "San Francisco, CA",
          is_remote: true,
          job_type: {
            id: 1,
            name: "Full-time"
          },
          salary_range: "$130K - $170K",
          posted_at: "2023-05-02T10:15:00Z",
          posted_ago: "4 days ago",
          is_urgent: false,
          experience_level: "mid",
          experience_level_display: "Mid Level",
          application_count: 16,
          skills: ["Python", "SQL", "Data Analysis", "Machine Learning", "Statistics"]
        },
        {
          id: 7,
          title: "UX Designer",
          description: "Create intuitive and beautiful user experiences for our mobile fitness application.",
          startup: {
            id: 7,
            name: "FitTech",
            logo: "💪",
            location: "Los Angeles, CA",
            industry: "HealthTech",
            employee_count: 19
          },
          location: "Los Angeles, CA",
          is_remote: true,
          job_type: {
            id: 1,
            name: "Full-time"
          },
          salary_range: "$100K - $130K",
          posted_at: "2023-05-01T14:30:00Z",
          posted_ago: "5 days ago",
          is_urgent: false,
          experience_level: "mid",
          experience_level_display: "Mid Level",
          application_count: 22,
          skills: ["UI/UX Design", "Figma", "User Research", "Prototyping"]
        }
      ];
      
      setJobs(prevJobs => [...prevJobs, ...newJobs]);
      setCurrentPage(prevPage => prevPage + 1);
      
      // For demo purposes, stop pagination after page 2
      if (currentPage >= 1) {
        setHasNextPage(false);
      }
      
      setLoadingMore(false);
    }, 1000);
  };
  
  const toggleJobDetails = (jobId) => {
    if (visibleJobDetails === jobId) {
      setVisibleJobDetails(null);
    } else {
      setVisibleJobDetails(jobId);
    }
  };
  
  // Filter labels for display
  const filterLabels = {
    search: "Search",
    job_type: "Job Type",
    experience_level: "Experience",
    industry: "Industry",
    location: "Location",
    is_remote: "Remote",
    is_urgent: "Urgent",
    posted_since: "Posted Since",
    skills: "Skills"
  };
  
  const handleApply = (jobId) => {
    alert(`Applied to job #${jobId}`);
  };
  
  const handleBookmark = (jobId) => {
    alert(`Bookmarked job #${jobId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Opportunity</h1>
          <p className="text-lg text-gray-600">
            Discover the latest jobs at innovative startups across tech, healthcare, finance, and more.
          </p>
        </div>
        
        {/* Search & Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search job titles, skills, or companies..." 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
            <button 
              type="button"
              onClick={toggleFilters}
              className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
              {Object.keys(activeFilters).length > 0 && (
                <span className="ml-2 w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">
                  {Object.keys(activeFilters).length}
                </span>
              )}
            </button>
          </form>
          
          {/* Active Filters */}
          {Object.keys(activeFilters).length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm font-medium text-gray-700">Active filters:</span>
              
              {Object.entries(activeFilters).map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {filterLabels[key] || key}: {value}
                  <button
                    onClick={() => removeFilter(key)}
                    className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-200 focus:outline-none"
              >
                Clear all
                <X className="ml-1 w-3 h-3" />
              </button>
            </div>
          )}
          
          {/* Advanced Filters */}
          {showFilters && filterOptions && (
            <div className="border-t border-gray-200 pt-6 mt-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Job Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                  <div className="relative">
                    <select
                      value={activeFilters.job_type || ''}
                      onChange={(e) => applyFilter('job_type', e.target.value || undefined)}
                      className="w-full px-3 py-2 appearance-none bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Types</option>
                      {filterOptions.job_types.map(type => (
                        <option key={type.id} value={type.name}>
                          {type.name} ({type.job_count})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Experience Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  <div className="relative">
                    <select
                      value={activeFilters.experience_level || ''}
                      onChange={(e) => applyFilter('experience_level', e.target.value || undefined)}
                      className="w-full px-3 py-2 appearance-none bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Levels</option>
                      {filterOptions.experience_levels.map(level => (
                        <option key={level.value} value={level.label}>
                          {level.label} ({level.count})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Industry Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <div className="relative">
                    <select
                      value={activeFilters.industry || ''}
                      onChange={(e) => applyFilter('industry', e.target.value || undefined)}
                      className="w-full px-3 py-2 appearance-none bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Industries</option>
                      {filterOptions.industries.map(industry => (
                        <option key={industry.id} value={industry.name}>
                          {industry.name} ({industry.job_count})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>
