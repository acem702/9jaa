"use client";

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Question } from '@/types';
import Navbar from '@/components/Navbar';

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('active');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, [filter]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { questions: data } = await api.getQuestions(filter === 'all' ? undefined : filter);
      setQuestions(data);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(q =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Head>
        <title>Political Sentiment Markets</title>
        <meta name="description" content="Express your confidence on political outcomes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200/50 shadow-lg mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-gray-700">Live Markets</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
              Express Your
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                Political Confidence
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Trade on political outcomes using influence credits. Watch sentiment shift in real-time.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <StatBadge icon="📊" label="Active Markets" value={questions.filter(q => q.status === 'active').length.toString()} />
              <StatBadge icon="👥" label="Active Traders" value="1.2k+" />
              <StatBadge icon="💎" label="Total Volume" value="2.4M" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-10">
          <div className="relative max-w-3xl mx-auto group">
            <input
              type="text"
              placeholder="Search markets by topic, keyword, or question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-8 py-5 pl-16 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-xl bg-white/80 backdrop-blur-sm group-hover:shadow-2xl"
            />
            <svg
              className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-gray-400 group-focus-within:text-blue-500 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {['all', 'active', 'locked', 'resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-8 py-3.5 rounded-2xl font-bold transition-all transform hover:scale-105 ${
                filter === status
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-500/40'
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border-2 border-gray-200 hover:border-gray-300 shadow-lg'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Markets Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-96">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-t-4 border-indigo-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading markets...</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-gray-200">
            <div className="text-gray-400 mb-6">
              <svg className="w-20 h-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-gray-700 mb-2">No markets found</p>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredQuestions.map((question) => (
              <ModernMarketCard key={question.id} question={question} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function StatBadge({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all">
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function ModernMarketCard({ question }: { question: Question }) {
  const yesPrice = Math.round(question.market.yes_price * 100);
  const noPrice = Math.round(question.market.no_price * 100);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/30';
      case 'locked':
        return 'bg-gradient-to-r from-yellow-500 to-orange-600 shadow-yellow-500/30';
      case 'resolved':
        return 'bg-gradient-to-r from-gray-500 to-slate-600 shadow-gray-500/30';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  return (
    <Link href={`/market/${question.id}`}>
      <div className="group relative bg-white rounded-3xl border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 cursor-pointer overflow-hidden h-full flex flex-col transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative p-6 flex-1 flex flex-col">
          {/* Status Badges */}
          <div className="flex items-center justify-between mb-4">
            <span className={`px-4 py-1.5 rounded-full text-xs font-black text-white shadow-lg ${getStatusStyle(question.status)}`}>
              {status.toUpperCase()}
            </span>
            {question.resolution !== null && (
              <span className={`px-4 py-1.5 rounded-full text-xs font-black shadow-lg ${
                question.resolution 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/30' 
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/30'
              }`}>
                {question.resolution ? '✓ YES WON' : '✗ NO WON'}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-black text-gray-900 mb-4 line-clamp-3 group-hover:text-blue-600 transition-colors flex-1 leading-tight">
            {question.title}
          </h3>

          {/* Price Display */}
          <div className="space-y-4">
            {/* YES */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/30"></div>
                  <span className="text-sm font-bold text-gray-700">YES</span>
                </div>
                <span className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {yesPrice}¢
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500 rounded-full shadow-lg"
                  style={{ width: `${yesPrice}%` }}
                />
              </div>
            </div>

            {/* NO */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-rose-600 shadow-lg shadow-red-500/30"></div>
                  <span className="text-sm font-bold text-gray-700">NO</span>
                </div>
                <span className="text-3xl font-black bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                  {noPrice}¢
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-500 rounded-full shadow-lg"
                  style={{ width: `${noPrice}%` }}
                />
              </div>
            </div>
          </div>

          {/* Volume */}
          {question.market.total_volume !== undefined && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-semibold">Trading Volume</span>
                <span className="text-lg font-black text-gray-900">
                  {question.market.total_volume.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Hover Arrow */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 group-hover:from-blue-50 group-hover:to-indigo-50 transition-all border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-600 group-hover:text-blue-600 transition-colors">
              View Details
            </span>
            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-2 transition-all"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}