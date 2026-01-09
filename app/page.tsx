"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Question, Category } from '@/types';
import Navbar from '@/components/Navbar';
import MarketCard from '@/components/MarketCard';
import MobileBottomNav from '@/components/ui/MobileBottomNav';
import EmptyState from '@/components/ui/EmptyState';
import TabButton from '@/components/ui/TabButton';
import SkeletonCard from '@/components/ui/SkeletonCard';
import FilterBar from '@/components/ui/FilterBar';

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'new' | 'trending' | 'volume' | 'hot' | 'controversial'>('new');
  const [showStatusTabs, setShowStatusTabs] = useState(false);

  // JSON-LD Structured Data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '9ja Markets',
    alternateName: '9ja Political Prediction Markets',
    url: 'https://9jamarkets.com',
    description: 'Express your opinions on Nigerian political outcomes. Trade prediction markets, track your portfolio, and compete on the leaderboard.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://9jamarkets.com/?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [activeTab, activeCategory, sortBy]); // Re-fetch when filters change

  const fetchCategories = async () => {
    try {
      const { categories: data } = await api.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const status = activeTab === 'all' ? undefined : activeTab;
      const category = activeCategory === 'all' ? undefined : activeCategory;
      const { questions: data } = await api.getQuestions(status, 1, category, sortBy);
      setQuestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Only filter by search query, status filtering is done by API
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'locked', label: 'Locked' },
    { id: 'resolved', label: 'Resolved' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 text-slate-900">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Navbar />

      <main className="max-w-4xl mx-auto px-4 pt-6 pb-32">
        {/* Hero Section - Simplified & Trustworthy */}
        <div className="mb-8 text-center">
          {/* Simple Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>

          {/* Clean Headline */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight mb-3 leading-tight">
            Track Public Opinion on Nigerian Politics
          </h1>

          {/* Trustworthy Description */}
          <p className="text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto mb-6">
            See what Nigerians think about political outcomes. Real sentiment data from engaged citizens.
          </p>

          {/* Trust Indicators - Simple */}
          <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">{questions.length} {questions[0]?.status || 'Active'} Topics</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Updated Daily</span>
            </div>
          </div>
        </div>

        {/* Sticky Filter Section */}
        <div className="sticky top-16 z-30 -mx-4 px-4 pb-3 bg-gradient-to-br from-slate-50/95 via-blue-50/60 to-purple-50/40 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
          {/* Category Chips - Row 1 */}
          <div className="pt-3 pb-3">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                  activeCategory === 'all'
                    ? 'bg-violet-100 text-violet-700 shadow-sm'
                    : 'text-slate-500 hover:text-violet-600 hover:bg-violet-50/50'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => setActiveCategory(category.slug)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                    activeCategory === category.slug
                      ? 'bg-violet-100 text-violet-700 shadow-sm'
                      : 'text-slate-500 hover:text-violet-600 hover:bg-violet-50/50'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-200/70 mb-3" />

          {/* Row 2: Search + Sort Icon + Filter Icon - Always one line */}
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            showStatusTabs={showStatusTabs}
            onToggleStatusTabs={() => setShowStatusTabs(!showStatusTabs)}
          />

          {/* Status Tabs - Collapsible with smooth animation */}
          <div 
            className={`overflow-hidden transition-all duration-300 ease-out ${
              showStatusTabs ? 'max-h-20 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
            }`}
          >
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {tabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  active={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </TabButton>
              ))}
            </div>
          </div>
        </div>

        {/* Spacer for sticky section */}
        <div className="h-4" />

        {/* Markets Grid - Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            // Skeleton loaders
            Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          ) : filteredQuestions.length === 0 ? (
            <div className="col-span-full">
              <EmptyState message="No markets found in this category" />
            </div>
          ) : (
            filteredQuestions.map((question) => (
              <MarketCard key={question.id} question={question} />
            ))
          )}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}
