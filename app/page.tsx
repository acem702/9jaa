"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Question } from '@/types';
import Navbar from '@/components/Navbar';
import MarketCard from '@/components/MarketCard';
import MobileBottomNav from '@/components/ui/MobileBottomNav';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import SearchBar from '@/components/ui/SearchBar';
import TabButton from '@/components/ui/TabButton';
import SkeletonCard from '@/components/ui/SkeletonCard';

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

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
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { questions: data } = await api.getQuestions();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (q.status && q.status.toLowerCase() === activeTab.toLowerCase());
    return matchesSearch && matchesTab;
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
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900">
              Political Prediction Markets
            </h1>
          </div>
          <p className="text-slate-600 font-medium">
            Express your confidence on political outcomes
          </p>
        </div>

        {/* Search Input */}
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search markets..."
        />

        {/* Status Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
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

        {/* Results Count */}
        {!loading && filteredQuestions.length > 0 && (
          <div className="mb-4 text-sm font-semibold text-slate-600">
            {filteredQuestions.length} {filteredQuestions.length === 1 ? 'market' : 'markets'} found
          </div>
        )}

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
