// src/components/Footer.js - Startlinker Modern Minimalistic Design
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, 
  Briefcase, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Instagram,
  Github,
  Heart,
  ArrowUp,
  Shield,
  HelpCircle,
  FileText,
  Users,
  Award,
  TrendingUp,
  Globe,
  Zap,
  Link as LinkIcon
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { label: 'Discover Startups', href: '/startups', icon: Building },
        { label: 'Find Jobs', href: '/jobs', icon: Briefcase },
        { label: 'For Startups', href: '/for-startups', icon: Users },
        { label: 'For Job Seekers', href: '/for-job-seekers', icon: User },
        { label: 'Success Stories', href: '/success-stories', icon: Award },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Startup Guide', href: '/guides/startup', icon: FileText },
        { label: 'Career Tips', href: '/guides/career', icon: TrendingUp },
        { label: 'Industry Reports', href: '/reports', icon: Globe },
        { label: 'Blog', href: '/blog', icon: Zap },
        { label: 'Help Center', href: '/help', icon: HelpCircle },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about', icon: null },
        { label: 'Contact', href: '/contact', icon: null },
        { label: 'Careers', href: '/careers', icon: null },
        { label: 'Press Kit', href: '/press', icon: null },
        { label: 'Partnership', href: '/partnership', icon: null },
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy', icon: Shield },
        { label: 'Terms of Service', href: '/terms', icon: FileText },
        { label: 'Cookie Policy', href: '/cookies', icon: null },
        { label: 'GDPR', href: '/gdpr', icon: null },
        { label: 'Security', href: '/security', icon: Shield },
      ]
    }
  ];

  const socialLinks = [
    { 
      name: 'Twitter', 
      href: 'https://twitter.com/startlinker', 
      icon: Twitter,
      color: 'hover:text-blue-400'
    },
    { 
      name: 'LinkedIn', 
      href: 'https://linkedin.com/company/startlinker', 
      icon: Linkedin,
      color: 'hover:text-blue-600'
    },
    { 
      name: 'Facebook', 
      href: 'https://facebook.com/startlinker', 
      icon: Facebook,
      color: 'hover:text-blue-500'
    },
    { 
      name: 'Instagram', 
      href: 'https://instagram.com/startlinker', 
      icon: Instagram,
      color: 'hover:text-pink-500'
    },
    { 
      name: 'GitHub', 
      href: 'https://github.com/startlinker', 
      icon: Github,
      color: 'hover:text-gray-600'
    }
  ];

  const stats = [
    { label: 'Active Startups', value: '10,000+' },
    { label: 'Job Listings', value: '50,000+' },
    { label: 'Success Stories', value: '2,500+' },
    { label: 'Countries', value: '150+' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Stats Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <LinkIcon className="text-white w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                  Startlinker
                </h2>
              </div>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Connecting innovative startups with talented professionals. 
              Discover your next opportunity or find the perfect team member 
              to grow your startup.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm">hello@startlinker.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 ${social.color} transition-colors p-2.5 rounded-xl hover:bg-gray-800`}
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h3 className="text-white font-semibold mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2 hover:translate-x-1 duration-200"
                      >
                        {IconComponent && <IconComponent className="w-4 h-4" />}
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md mx-auto text-center lg:max-w-none lg:text-left lg:flex lg:items-center lg:justify-between">
            <div className="lg:flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Stay Connected
              </h3>
              <p className="text-gray-400 text-sm">
                Get the latest startup news and job opportunities delivered to your inbox.
              </p>
            </div>
            <div className="mt-6 lg:mt-0 lg:ml-8">
              <form className="sm:flex sm:max-w-md">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  name="email-address"
                  id="email-address"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 border border-gray-600 rounded-l-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto mt-3 sm:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-r-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium shadow-lg"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 text-gray-400 text-sm">
              <span>© {currentYear} Startlinker. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500" />
                <span>for entrepreneurs</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
              
              <button
                onClick={scrollToTop}
                className="text-gray-400 hover:text-white transition-colors p-2.5 rounded-xl hover:bg-gray-800 group"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-5 h-5 group-hover:translate-y-[-2px] transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
