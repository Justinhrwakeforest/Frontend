// src/components/SearchBar.js - Enhanced with suggestions and recent searches
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';

const SearchBar = ({ 
  value = '', 
  onChange, 
  onClear, 
  placeholder = 'Search...', 
  suggestions = [],
  loading = false,
  className = '',
  showRecentSearches = true,
  showTrendingSearches = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches] = useState([
    'AI startups', 'FinTech', 'Remote jobs', 'Series A', 'Healthcare AI',
    'E-commerce', 'Machine Learning', 'Blockchain', 'SaaS', 'GreenTech'
  ]);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    setIsOpen((suggestions.length > 0 && value.length > 0) || (value.length === 0 && (recentSearches.length > 0 || trendingSearches.length > 0)));
    setHighlightedIndex(-1);
  }, [suggestions, value, recentSearches, trendingSearches]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveRecentSearch = (searchTerm) => {
    if (!searchTerm.trim()) return;
    
    const updatedRecents = [
      searchTerm,
      ...recentSearches.filter(item => item !== searchTerm)
    ].slice(0, 5); // Keep only 5 recent searches
    
    setRecentSearches(updatedRecents);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecents));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    const allItems = [
      ...suggestions,
      ...(value.length === 0 ? recentSearches : []),
      ...(value.length === 0 ? trendingSearches : [])
    ];

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < allItems.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : allItems.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          const selectedItem = allItems[highlightedIndex];
          handleSelect(selectedItem);
        } else if (value.trim()) {
          handleSelect(value);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSelect = (searchTerm) => {
    onChange(searchTerm);
    saveRecentSearch(searchTerm);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const renderDropdownContent = () => {
    if (value.length > 0 && suggestions.length > 0) {
      // Show suggestions when typing
      return (
        <div>
          <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
            Search Suggestions
          </div>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50 ${
                index === highlightedIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
              }`}
              onClick={() => handleSelect(suggestion)}
            >
              <div className="flex items-center">
                <Search className="w-4 h-4 text-gray-400 mr-3" />
                <span className="block truncate font-normal">{suggestion}</span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (value.length === 0) {
      // Show recent and trending when no input
      return (
        <div>
          {/* Recent Searches */}
          {showRecentSearches && recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                <span className="text-xs font-medium text-gray-500">Recent Searches</span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <div
                  key={`recent-${index}`}
                  className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50 ${
                    index === highlightedIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                  }`}
                  onClick={() => handleSelect(search)}
                >
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="block truncate font-normal">{search}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Trending Searches */}
          {showTrendingSearches && (
            <div>
              <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                Trending Searches
              </div>
              {trendingSearches.map((trending, index) => {
                const adjustedIndex = index + recentSearches.length;
                return (
                  <div
                    key={`trending-${index}`}
                    className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50 ${
                      adjustedIndex === highlightedIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                    }`}
                    onClick={() => handleSelect(trending)}
                  >
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="block truncate font-normal">{trending}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative" ref={searchRef}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        
        {value && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              onClick={() => {
                onClear();
                setIsOpen(false);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Dropdown */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-80 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none border border-gray-200"
        >
          {renderDropdownContent()}
          
          {/* Quick Actions */}
          {value.length > 0 && (
            <div className="border-t border-gray-100 px-3 py-2">
              <button
                onClick={() => handleSelect(value)}
                className="flex items-center w-full text-left py-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <Search className="w-4 h-4 mr-2" />
                Search for "{value}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
