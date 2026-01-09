'use client';

import { useState, useRef, useEffect } from 'react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: 'new' | 'trending' | 'volume' | 'hot' | 'controversial') => void;
  showStatusTabs: boolean;
  onToggleStatusTabs: () => void;
}

export default function FilterBar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  showStatusTabs,
  onToggleStatusTabs,
}: FilterBarProps) {
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortClicked, setSortClicked] = useState(false);
  const [filterClicked, setFilterClicked] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  const sortOptions = [
    { value: 'new', label: 'New', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { value: 'trending', label: 'Trending', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { value: 'volume', label: 'Volume', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { value: 'hot', label: 'Hot', icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z' },
    { value: 'controversial', label: 'Controversial', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  const currentSort = sortOptions.find(o => o.value === sortBy) || sortOptions[0];

  // Close sort menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Micro-interaction handlers
  const handleSortClick = () => {
    setSortClicked(true);
    setTimeout(() => setSortClicked(false), 150);
    setShowSortMenu(!showSortMenu);
  };

  const handleFilterClick = () => {
    setFilterClicked(true);
    setTimeout(() => setFilterClicked(false), 150);
    onToggleStatusTabs();
  };

  return (
    <div className="flex items-center gap-2">
      {/* Search Input - Glassy */}
      <div className="flex-1 relative group">
        <svg 
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-violet-500 transition-colors duration-200" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search"
          className="w-full pl-9 pr-4 py-2.5 bg-white/70 backdrop-blur-sm border border-slate-200/80 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 focus:bg-white transition-all duration-200"
        />
      </div>

      {/* Sort Icon Button - Transparent with micro-interaction */}
      <div className="relative" ref={sortMenuRef}>
        <button
          onClick={handleSortClick}
          className={`p-2.5 rounded-xl border backdrop-blur-sm transition-all duration-200 ${
            showSortMenu
              ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/25'
              : 'bg-transparent border-slate-200/80 text-slate-500 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50/50'
          } ${sortClicked ? 'scale-90' : 'scale-100'}`}
          aria-label="Sort options"
        >
          <svg 
            className={`w-5 h-5 transition-transform duration-300 ${showSortMenu ? 'rotate-180' : 'rotate-0'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
        </button>

        {/* Sort Dropdown Menu - Glassy */}
        {showSortMenu && (
          <div className="absolute right-0 top-full mt-2 w-44 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {sortOptions.map((option, index) => (
              <button
                key={option.value}
                onClick={() => {
                  onSortChange(option.value as any);
                  setShowSortMenu(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm font-medium flex items-center gap-2 transition-all duration-150 ${
                  sortBy === option.value
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-700 hover:bg-violet-50 hover:text-violet-700'
                }`}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <svg className={`w-4 h-4 transition-transform duration-200 ${sortBy === option.value ? 'scale-110' : 'scale-100'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={option.icon} />
                </svg>
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Toggle Icon Button - Transparent with micro-interaction */}
      <button
        onClick={handleFilterClick}
        className={`p-2.5 rounded-xl border backdrop-blur-sm transition-all duration-200 ${
          showStatusTabs
            ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/25'
            : 'bg-transparent border-slate-200/80 text-slate-500 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50/50'
        } ${filterClicked ? 'scale-90' : 'scale-100'}`}
        aria-label="Toggle status filters"
      >
        <svg 
          className={`w-5 h-5 transition-transform duration-300 ${showStatusTabs ? 'rotate-90' : 'rotate-0'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </button>
    </div>
  );
}
