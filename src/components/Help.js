// src/components/Help.js - Complete Help Component
import React, { useState } from 'react';
import { 
  HelpCircle, Search, Book, MessageCircle, Mail, 
  Phone, ChevronRight, ChevronDown, ExternalLink,
  User, Building, Briefcase, Settings, Star,
  Bookmark, Activity, Bell, Shield, CreditCard
} from 'lucide-react';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('general');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    { id: 'general', label: 'General', icon: HelpCircle },
    { id: 'account', label: 'Account & Profile', icon: User },
    { id: 'startups', label: 'Startups', icon: Building },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'features', label: 'Platform Features', icon: Star },
    { id: 'billing', label: 'Billing & Premium', icon: CreditCard },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'technical', label: 'Technical Issues', icon: Settings }
  ];

  const faqs = {
    general: [
      {
        id: 1,
        question: "What is StartupHub?",
        answer: "StartupHub is a comprehensive platform for discovering innovative startups, exploring job opportunities, and connecting with the startup ecosystem. Our mission is to bridge the gap between talented individuals and groundbreaking companies."
      },
      {
        id: 2,
        question: "How do I get started on StartupHub?",
        answer: "Getting started is easy! Simply create a free account, complete your profile, and start exploring startups and job opportunities. You can bookmark startups, apply for jobs, and engage with the community through ratings and comments."
      },
      {
        id: 3,
        question: "Is StartupHub free to use?",
        answer: "Yes! StartupHub offers a robust free tier that includes startup discovery, job searching, and basic community features. We also offer a Premium subscription with advanced features like priority support, enhanced analytics, and exclusive startup insights."
      },
      {
        id: 4,
        question: "How often is the startup data updated?",
        answer: "We continuously update our startup database with new companies, funding rounds, and company information. Our team reviews and verifies all startup information to ensure accuracy and relevance."
      }
    ],
    account: [
      {
        id: 5,
        question: "How do I update my profile information?",
        answer: "Navigate to your profile page and click the 'Edit Profile' button. You can update your personal information, bio, location, and interests. Don't forget to save your changes!"
      },
      {
        id: 6,
        question: "How do I change my password?",
        answer: "Go to Settings > Security and use the 'Change Password' section. You'll need to enter your current password and create a new one. Make sure your new password is at least 8 characters long."
      },
      {
        id: 7,
        question: "Can I delete my account?",
        answer: "Yes, you can delete your account by going to Settings > Account and clicking 'Delete Account' in the Danger Zone. Please note that this action is irreversible and will permanently remove all your data."
      },
      {
        id: 8,
        question: "How do I export my data?",
        answer: "You can export all your data by going to Settings > Account and clicking 'Export Your Data'. This will download a JSON file containing all your profile information, bookmarks, ratings, and activity history."
      }
    ],
    startups: [
      {
        id: 9,
        question: "How do I bookmark a startup?",
        answer: "Click the bookmark button on any startup card or in the startup detail page. Bookmarked startups will appear in your Bookmarks section for easy access later."
      },
      {
        id: 10,
        question: "How do I rate and review a startup?",
        answer: "Visit the startup's detail page and use the star rating system. You can give a rating from 1-5 stars and leave detailed comments about your experience or thoughts about the company."
      },
      {
        id: 11,
        question: "How do I submit a new startup to the platform?",
        answer: "Currently, our team manually curates and adds startups to ensure quality and accuracy. If you'd like to suggest a startup, please contact us through the support channels with the company details."
      },
      {
        id: 12,
        question: "What does the 'Featured' badge mean?",
        answer: "Featured startups are companies that have been highlighted by our editorial team for their innovation, growth potential, or recent significant milestones like funding rounds or product launches."
      }
    ],
    jobs: [
      {
        id: 13,
        question: "How do I apply for a job?",
        answer: "Browse jobs on the Jobs page or in startup profiles, then click 'Apply Now' on any position that interests you. You can include a cover letter with your application."
      },
      {
        id: 14,
        question: "Can I track my job applications?",
        answer: "Yes! Go to your Profile > Activity or Jobs > My Applications to see all your submitted applications and their current status (pending, under review, interview scheduled, etc.)."
      },
      {
        id: 15,
        question: "How do I set up job alerts?",
        answer: "In your Settings > Notifications, you can enable job alerts. We'll notify you about new positions that match your interests, skills, and preferences."
      },
      {
        id: 16,
        question: "Can I save jobs for later?",
        answer: "While we don't have a dedicated 'save job' feature yet, you can bookmark the startup posting the job and check their jobs section later. This feature is coming soon!"
      }
    ],
    features: [
      {
        id: 17,
        question: "How do notifications work?",
        answer: "Click the bell icon in the navigation bar to see your notifications. You'll receive alerts for job applications, startup updates, and community interactions. Manage your notification preferences in Settings."
      },
      {
        id: 18,
        question: "What can I see in my Activity page?",
        answer: "Your Activity page shows a comprehensive timeline of your actions on StartupHub, including ratings given, comments made, bookmarks added, and job applications submitted."
      },
      {
        id: 19,
        question: "How do the search and filter features work?",
        answer: "Use the search bar to find startups by name, industry, or keywords. Apply filters for location, company size, funding status, and more. Your active filters are shown as removable chips above the results."
      },
      {
        id: 20,
        question: "What are interests and how do I manage them?",
        answer: "Interests help us personalize your experience. Add interests in your Profile settings, and we'll use them to recommend relevant startups and jobs. You can add or remove interests anytime."
      }
    ],
    billing: [
      {
        id: 21,
        question: "What Premium features are available?",
        answer: "Premium users get access to advanced analytics, priority customer support, exclusive startup insights, early access to new features, and an ad-free experience."
      },
      {
        id: 22,
        question: "How much does Premium cost?",
        answer: "Premium subscription is $9.99/month or $99/year (save 17%). We offer a 14-day free trial so you can explore all Premium features before committing."
      },
      {
        id: 23,
        question: "How do I cancel my Premium subscription?",
        answer: "You can cancel your Premium subscription anytime in Settings > Account > Subscription. Your Premium features will remain active until the end of your current billing period."
      },
      {
        id: 24,
        question: "Do you offer refunds?",
        answer: "We offer a 30-day money-back guarantee for annual subscriptions. Monthly subscriptions can be cancelled anytime without charge for the following month."
      }
    ],
    privacy: [
      {
        id: 25,
        question: "How is my data protected?",
        answer: "We use industry-standard encryption to protect your data. Your personal information is never sold to third parties, and we follow strict data protection guidelines including GDPR compliance."
      },
      {
        id: 26,
        question: "Can I control who sees my profile?",
        answer: "Yes! In Settings > Privacy, you can control your profile visibility, whether your activity is public, and who can send you messages."
      },
      {
        id: 27,
        question: "How do you use my data?",
        answer: "We use your data to personalize your experience, show relevant startups and jobs, and improve our platform. Read our detailed Privacy Policy for complete information about data usage."
      },
      {
        id: 28,
        question: "Can I see what data you have about me?",
        answer: "Absolutely! You can export all your data from Settings > Account > Export Data. This includes your profile, activity history, bookmarks, and all interactions on the platform."
      }
    ],
    technical: [
      {
        id: 29,
        question: "The website is loading slowly. What should I do?",
        answer: "Try refreshing the page, clearing your browser cache, or checking your internet connection. If the issue persists, please report it to our support team with details about your browser and device."
      },
      {
        id: 30,
        question: "I'm having trouble logging in. What should I do?",
        answer: "Make sure you're using the correct email and password. Try the 'Forgot Password' link if needed. Clear your browser cookies and cache if the problem continues."
      },
      {
        id: 31,
        question: "Some features aren't working properly. How do I report a bug?",
        answer: "Please contact our support team with detailed information about the issue, including what you were trying to do, what happened instead, and your browser/device information."
      },
      {
        id: 32,
        question: "Is StartupHub available on mobile?",
        answer: "Yes! StartupHub is fully responsive and works great on mobile browsers. We're also working on native mobile apps that will be available soon."
      }
    ]
  };

  const contactMethods = [
    {
      title: "Email Support",
      description: "Get help via email - we respond within 24 hours",
      contact: "support@startuphub.com",
      icon: Mail,
      color: "blue"
    },
    {
      title: "Live Chat",
      description: "Chat with our support team (Premium users get priority)",
      contact: "Available 9 AM - 6 PM EST",
      icon: MessageCircle,
      color: "green"
    },
    {
      title: "Phone Support",
      description: "Premium users can call our support line",
      contact: "+1 (555) 123-4567",
      icon: Phone,
      color: "purple"
    }
  ];

  const quickLinks = [
    { title: "Getting Started Guide", url: "#", icon: Book },
    { title: "Video Tutorials", url: "#", icon: ExternalLink },
    { title: "API Documentation", url: "#", icon: Book },
    { title: "Community Forum", url: "#", icon: MessageCircle },
    { title: "Feature Requests", url: "#", icon: Star },
    { title: "Status Page", url: "#", icon: Activity }
  ];

  const filteredFaqs = faqs[activeCategory]?.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <HelpCircle className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Help Center</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to your questions and get the most out of StartupHub
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for help articles, guides, or FAQs..."
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 border border-gray-200 hover:border-blue-300"
              >
                <link.icon className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-900 text-center">{link.title}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeCategory === category.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <category.icon className="w-5 h-5" />
                    <span className="font-medium">{category.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* FAQs */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {categories.find(c => c.id === activeCategory)?.label} FAQs
                </h2>
                <span className="text-sm text-gray-500">
                  {filteredFaqs.length} {filteredFaqs.length === 1 ? 'article' : 'articles'}
                </span>
              </div>

              {filteredFaqs.length > 0 ? (
                <div className="space-y-4">
                  {filteredFaqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {expandedFaq === faq.id ? (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      {expandedFaq === faq.id && (
                        <div className="px-4 pb-4 text-gray-700 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">
                    {searchTerm ? 'No articles found matching your search.' : 'No articles available in this category.'}
                  </p>
                </div>
              )}
            </div>

            {/* Contact Support */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Still Need Help?</h2>
              <p className="text-gray-600 mb-6">
                Can't find what you're looking for? Our support team is here to help!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {contactMethods.map((method, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-xl border-2 border-gray-200 hover:border-${method.color}-300 transition-colors`}
                  >
                    <div className={`w-12 h-12 bg-${method.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                      <method.icon className={`w-6 h-6 text-${method.color}-600`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{method.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                    <p className={`text-sm font-medium text-${method.color}-600`}>{method.contact}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Premium Support</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Premium users get priority support with faster response times and access to phone support.
                      <a href="/settings" className="underline ml-1">Upgrade to Premium</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
