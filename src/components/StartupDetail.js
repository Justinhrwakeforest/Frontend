import { useState, useEffect } from "react";
import { 
  ChevronLeft, MapPin, Users, Star, DollarSign, TrendingUp, 
  Briefcase, ExternalLink, Heart, Bookmark, MessageCircle, 
  Share2, ThumbsUp, Clock, Award, Building, Plus
} from "lucide-react";

export default function EnhancedStartupDetail() {
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [submittingAction, setSubmittingAction] = useState(false);
  
  useEffect(() => {
    // Simulated data fetch - replace with actual API call
    setTimeout(() => {
      setStartup({
        id: 1,
        name: "HealthAI",
        logo: "🏥",
        description: "AI-powered diagnostic platform revolutionizing healthcare with real-time analysis and predictive insights for medical professionals, enabling faster and more accurate diagnoses.",
        long_description: "HealthAI is building the next generation of AI-powered diagnostic tools to transform healthcare delivery worldwide. Our platform combines machine learning with medical expertise to provide real-time analysis and predictive insights for healthcare professionals.\n\nFounded in 2019 by a team of medical doctors and AI researchers, HealthAI has quickly grown to become a leading innovator in the healthtech space. Our mission is to improve patient outcomes through faster and more accurate diagnoses, while reducing the cognitive load on medical professionals.",
        industry: {
          id: 2,
          name: "HealthTech",
          icon: "🏥",
          description: "Companies using technology to improve healthcare delivery, diagnostics, and patient outcomes."
        },
        location: "Boston, MA",
        website: "https://healthai.example.com",
        funding_amount: "$15M Series A",
        valuation: "$100M",
        employee_count: 45,
        founded_year: 2019,
        is_featured: true,
        revenue: "$5M ARR",
        user_count: "1K+",
        growth_rate: "200% YoY",
        average_rating: 4.7,
        total_ratings: 28,
        views: 1458,
        total_likes: 243,
        total_bookmarks: 126,
        total_comments: 37,
        founders: [
          {
            id: 1,
            name: "Dr. James Wilson",
            title: "CEO & Co-Founder",
            bio: "Harvard Medical School graduate with 10 years of experience in clinical diagnostics and machine learning applications in healthcare.",
            image: "https://randomuser.me/api/portraits/men/32.jpg"
          },
          {
            id: 2,
            name: "Dr. Sarah Chen",
            title: "CTO & Co-Founder",
            bio: "MIT PhD in Artificial Intelligence with a focus on medical imaging analysis and diagnostic models.",
            image: "https://randomuser.me/api/portraits/women/44.jpg"
          }
        ],
        tags: [
          { id: 1, tag: "AI" },
          { id: 2, tag: "Healthcare" },
          { id: 3, tag: "Machine Learning" },
          { id: 4, tag: "Diagnostics" },
          { id: 5, tag: "SaaS" }
        ],
        open_jobs: [
          {
            id: 1,
            title: "Senior Machine Learning Engineer",
            description: "Join our AI team to develop cutting-edge machine learning models for medical diagnostics.",
            location: "Boston, MA",
            salary_range: "$140K - $180K",
            is_remote: true,
            job_type_name: "Full-time",
            experience_level: "Senior",
            posted_ago: "2 days ago",
            skills_list: ["Python", "TensorFlow", "PyTorch", "Medical Imaging"]
          },
          {
            id: 2,
            title: "UX/UI Designer",
            description: "Design intuitive interfaces for healthcare professionals to interact with our AI diagnostic platform.",
            location: "Boston, MA",
            salary_range: "$90K - $120K",
            is_remote: true,
            job_type_name: "Full-time",
            experience_level: "Mid-level",
            posted_ago: "1 week ago",
            skills_list: ["Figma", "UI Design", "User Research", "Prototyping"]
          },
          {
            id: 3,
            title: "Medical Data Scientist",
            description: "Work with our research team to analyze medical datasets and improve diagnostic algorithms.",
            location: "Boston, MA",
            salary_range: "$130K - $160K",
            is_remote: false,
            job_type_name: "Full-time",
            experience_level: "Senior",
            posted_ago: "3 days ago",
            skills_list: ["Data Science", "Python", "Statistics", "Medical Knowledge"]
          }
        ],
        recent_comments: [
          {
            id: 1,
            user: {
              id: 101,
              name: "John Smith",
              first_name: "John",
              username: "jsmith"
            },
            text: "Their diagnostic platform is impressive. I've been testing it for our hospital and the accuracy rates are well above industry standards.",
            likes: 12,
            time_ago: "2 days ago"
          },
          {
            id: 2,
            user: {
              id: 102,
              name: "Emily Davis",
              first_name: "Emily",
              username: "emilyd"
            },
            text: "Met the founding team at a healthcare conference. They're passionate and knowledgeable. Definitely a startup to watch!",
            likes: 8,
            time_ago: "1 week ago"
          },
          {
            id: 3,
            user: {
              id: 103,
              name: "Michael Wong",
              first_name: "Michael",
              username: "mwong"
            },
            text: "Great tech but I wonder about their go-to-market strategy. Healthcare is notoriously slow to adopt new technologies.",
            likes: 5,
            time_ago: "2 weeks ago"
          }
        ],
        similar_startups: [
          {
            id: 4,
            name: "MedVision",
            logo: "👁️",
            industry_name: "HealthTech",
            location: "San Francisco, CA",
            employee_count: 28,
            is_featured: false
          },
          {
            id: 5,
            name: "BioAI",
            logo: "🧬",
            industry_name: "BioTech",
            location: "Cambridge, MA",
            employee_count: 35,
            is_featured: true
          },
          {
            id: 6,
            name: "PredictRx",
            logo: "💊",
            industry_name: "HealthTech",
            location: "New York, NY",
            employee_count: 19,
            is_featured: false
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleRate = (rating) => {
    if (submittingAction) return;
    
    setSubmittingAction(true);
    // Simulate API call
    setTimeout(() => {
      setUserRating(rating);
      setStartup(prev => ({
        ...prev,
        average_rating: ((prev.average_rating * prev.total_ratings) + rating) / (prev.total_ratings + (userRating === 0 ? 1 : 0)),
        total_ratings: userRating === 0 ? prev.total_ratings + 1 : prev.total_ratings
      }));
      setSubmittingAction(false);
    }, 500);
  };

  const handleLike = () => {
    if (submittingAction) return;
    
    setSubmittingAction(true);
    // Simulate API call
    setTimeout(() => {
      setIsLiked(!isLiked);
      setStartup(prev => ({
        ...prev,
        total_likes: isLiked ? prev.total_likes - 1 : prev.total_likes + 1
      }));
      setSubmittingAction(false);
    }, 500);
  };

  const handleBookmark = async () => {
  if (submittingAction) return;
  
  setSubmittingAction(true);
  try {
    const response = await axios.post(`http://localhost:8000/api/startups/${startup.id}/bookmark/`);
    
    setIsBookmarked(response.data.bookmarked);
    setStartup(prev => ({
      ...prev,
      total_bookmarks: response.data.total_bookmarks
    }));
    
    console.log('Bookmark toggled successfully:', response.data);
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    alert('Failed to update bookmark. Please try again.');
  } finally {
    setSubmittingAction(false);
  }
};

  const handleComment = (e) => {
    e.preventDefault();
    if (!comment.trim() || submittingAction) return;
    
    setSubmittingAction(true);
    // Simulate API call
    setTimeout(() => {
      const newComment = {
        id: Date.now(),
        user: {
          id: 104,
          name: "Current User",
          first_name: "Current",
          username: "currentuser"
        },
        text: comment,
        likes: 0,
        time_ago: "Just now"
      };
      
      setStartup(prev => ({
        ...prev,
        recent_comments: [newComment, ...prev.recent_comments],
        total_comments: prev.total_comments + 1
      }));
      
      setComment('');
      setSubmittingAction(false);
    }, 800);
  };

  const StarRating = ({ rating, onRate, interactive = false }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRate && onRate(star)}
            disabled={!interactive || submittingAction}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
            }`}
          >
            <Star 
              className={`w-5 h-5 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          </button>
        ))}
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Building className="w-4 h-4" /> },
    { id: 'jobs', label: 'Jobs', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'team', label: 'Team', icon: <Users className="w-4 h-4" /> },
    { id: 'metrics', label: 'Metrics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'reviews', label: 'Reviews', icon: <MessageCircle className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">Loading startup details...</p>
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Startup not found</div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Back to Startups
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Startups
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBookmark}
                disabled={submittingAction}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  isBookmarked
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-blue-700' : ''}`} />
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
              
              <button
                onClick={handleLike}
                disabled={submittingAction}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  isLiked
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-red-700' : ''}`} />
                <span>{startup.total_likes}</span>
              </button>
              
              <button className="flex items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Startup Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start space-x-6 mb-6 lg:mb-0">
              <div className="flex-shrink-0 w-20 h-20 bg-blue-100 rounded-xl flex items-center justify-center text-4xl">
                {startup.logo}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{startup.name}</h1>
                  {startup.is_featured && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center">
                      <Award className="w-4 h-4 mr-1" /> Featured
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {startup.industry.icon} {startup.industry.name}
                  </span>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" /> {startup.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" /> Since {startup.founded_year}
                  </div>
                </div>

                <p className="text-gray-700 text-lg mb-6 max-w-3xl">{startup.description}</p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{startup.employee_count}</div>
                    <div className="text-sm text-gray-600 flex items-center justify-center">
                      <Users className="w-4 h-4 mr-1" /> Employees
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{startup.founded_year}</div>
                    <div className="text-sm text-gray-600 flex items-center justify-center">
                      <Building className="w-4 h-4 mr-1" /> Founded
                    </div>
                  </div>
                  {startup.funding_amount && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{startup.funding_amount}</div>
                      <div className="text-sm text-gray-600 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 mr-1" /> Funding
                      </div>
                    </div>
                  )}
                  {startup.valuation && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{startup.valuation}</div>
                      <div className="text-sm text-gray-600 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 mr-1" /> Valuation
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rating & Actions */}
            <div className="lg:ml-8 lg:flex-shrink-0 bg-gray-50 rounded-xl p-6 text-center">
              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {startup.average_rating?.toFixed(1) || 'N/A'}
                </div>
                <StarRating rating={Math.round(startup.average_rating || 0)} />
                <div className="text-sm text-gray-600 mt-1">
                  {startup.total_ratings} reviews
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Rate this startup</div>
                <StarRating 
                  rating={userRating} 
                  onRate={handleRate}
                  interactive={true}
                />
              </div>

              {startup.website && (
                <a
                  href={startup.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" /> Visit Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label} {tab.id === 'jobs' && `(${startup.open_jobs?.length || 0})`}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">About {startup.name}</h3>
                  <p className="whitespace-pre-line">{startup.long_description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h3>
                    <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                      {startup.revenue && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Revenue</span>
                          <span className="font-medium">{startup.revenue}</span>
                        </div>
                      )}
                      {startup.user_count && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Users</span>
                          <span className="font-medium">{startup.user_count}</span>
                        </div>
                      )}
                      {startup.growth_rate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Growth Rate</span>
                          <span className="font-medium text-green-600">{startup.growth_rate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {startup.tags?.map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          {tag.tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Similar Startups */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Startups</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {startup.similar_startups.map((similar) => (
                      <div 
                        key={similar.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                            {similar.logo}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{similar.name}</h4>
                            <p className="text-sm text-gray-600">{similar.industry_name}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Open Positions</h3>
                  <button className="text-blue-600 font-medium flex items-center hover:text-blue-700">
                    View All Positions <ChevronLeft className="w-4 h-4 ml-1 rotate-180" />
                  </button>
                </div>
                
                {startup.open_jobs?.length > 0 ? (
                  <div className="space-y-6">
                    {startup.open_jobs.map((job) => (
                      <div key={job.id} className="border border-gray-200 hover:border-blue-300 rounded-lg p-6 hover:shadow-md transition-all">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h4>
                            <div className="flex items-center space-x-3 text-sm text-gray-600 mb-3">
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" /> {job.location}
                              </span>
                              <span>•</span>
                              <span className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" /> {job.salary_range}
                              </span>
                              <span>•</span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" /> {job.posted_ago}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-4">{job.description}</p>
                            <div className="flex flex-wrap gap-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {job.job_type_name}
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {job.experience_level}
                              </span>
                              {job.is_remote && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Remote
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="ml-6">
                            <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
                              Apply Now
                            </button>
                          </div>
                        </div>
                        
                        {/* Skills */}
                        {job.skills_list && job.skills_list.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="text-sm font-medium text-gray-700 mb-2">Required Skills:</div>
                            <div className="flex flex-wrap gap-2">
                              {job.skills_list.map((skill, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">No open positions available at the moment.</p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Get Notified of New Positions
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Meet the Team</h3>
                {startup.founders?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {startup.founders.map((founder) => (
                      <div key={founder.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <div className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <img 
                                src={founder.image} 
                                alt={founder.name} 
                                className="w-16 h-16 rounded-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gray-900">{founder.name}</h4>
                              <p className="text-blue-600 font-medium mb-2">{founder.title}</p>
                              <p className="text-gray-600 text-sm">{founder.bio}</p>
                              
                              <div className="mt-4 flex space-x-2">
                                <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                  </svg>
                                </button>
                                <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No team information available.</p>
                )}
              </div>
            )}

            {/* Metrics Tab */}
            {activeTab === 'metrics' && (
              <div className="space-y-8">
                <h3 className="text-lg font-semibold text-gray-900">Engagement Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-blue-50 rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-blue-600">{startup.total_likes || 0}</div>
                    <div className="text-sm text-gray-600">Likes</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-green-600">{startup.total_bookmarks || 0}</div>
                    <div className="text-sm text-gray-600">Bookmarks</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-purple-600">{startup.total_comments || 0}</div>
                    <div className="text-sm text-gray-600">Comments</div>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{startup.views}</div>
                    <div className="text-sm text-gray-600">Views</div>
                  </div>
                </div>
                
                {/* Growth metrics - could be visualized with charts */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Trajectory</h3>
                  <div className="text-center py-10">
                    <p className="text-gray-500">Growth visualization would go here.</p>
                    <p className="text-gray-500">Consider using Recharts or other visualization libraries.</p>
                  </div>
                </div>
                
                {/* Funding history */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Funding History</h3>
                  <div className="relative">
                    {/* Timeline connector */}
                    <div className="absolute left-3.5 top-5 bottom-5 w-0.5 bg-gray-200"></div>
                    
                    <div className="space-y-6 relative">
                      <div className="flex">
                        <div className="flex-shrink-0 h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center z-10">
                          <div className="h-3 w-3 rounded-full bg-white"></div>
                        </div>
                        <div className="ml-6">
                          <div className="text-sm font-medium text-gray-900">Series A - $15M</div>
                          <div className="mt-1 text-xs text-gray-500">April 2022</div>
                          <div className="mt-1 text-sm text-gray-600">Led by Sequoia Capital with participation from Accel Partners</div>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="flex-shrink-0 h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center z-10">
                          <div className="h-3 w-3 rounded-full bg-white"></div>
                        </div>
                        <div className="ml-6">
                          <div className="text-sm font-medium text-gray-900">Seed Round - $3.5M</div>
                          <div className="mt-1 text-xs text-gray-500">November 2020</div>
                          <div className="mt-1 text-sm text-gray-600">Led by Y Combinator with angel investors</div>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="flex-shrink-0 h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center z-10">
                          <div className="h-3 w-3 rounded-full bg-white"></div>
                        </div>
                        <div className="ml-6">
                          <div className="text-sm font-medium text-gray-900">Pre-seed - $500K</div>
                          <div className="mt-1 text-xs text-gray-500">January 2020</div>
                          <div className="mt-1 text-sm text-gray-600">Friends and family round</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Reviews & Comments</h3>

                {/* Add Comment Form */}
                <form onSubmit={handleComment} className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-medium text-gray-900 mb-3">Add a Comment</h4>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this startup..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                    maxLength={1000}
                  />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500">{comment.length}/1000</span>
                    <button
                      type="submit"
                      disabled={!comment.trim() || submittingAction}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                    >
                      {submittingAction ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Posting...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-1" /> Post Comment
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Comments */}
                <div className="space-y-4">
                  {startup.recent_comments?.length > 0 ? (
                    startup.recent_comments.map((comment) => (
                      <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-200 transition-all">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {comment.user.first_name?.charAt(0) || comment.user.name?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {comment.user.first_name || comment.user.name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" /> {comment.time_ago}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{comment.text}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <button className="flex items-center hover:text-blue-600 transition-colors">
                            <ThumbsUp className="w-4 h-4 mr-1" /> 
                            <span>{comment.likes}</span>
                          </button>
                          <span className="mx-2">•</span>
                          <button className="hover:text-blue-600 transition-colors">
                            Reply
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No comments yet. Be the first to share your thoughts!</p>
                    </div>
                  )}
                </div>
                
                {startup.recent_comments?.length > 0 && (
                  <div className="text-center mt-6">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                      Load More Comments
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
