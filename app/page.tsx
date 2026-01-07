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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { questions: data } = await api.getQuestions();
      setQuestions(data);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || q.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'locked', label: 'Locked' },
    { id: 'resolved', label: 'Resolved' }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Head>
        <title>9ja Markets | Prediction Platform</title>
      </Head>

      <Navbar />

      <main className="max-w-2xl mx-auto px-4 pt-12 pb-32">
        {/* Search & Tabs Header Group */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 mb-12">
          <div className="space-y-6">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search markets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all group-hover:bg-white"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex p-1.5 bg-slate-100/50 rounded-2xl overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Markets List */}
        <div className="space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <span className="text-slate-400 font-medium">Loading markets...</span>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm px-6">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-slate-900 font-bold mb-1">No markets found</h3>
              <p className="text-slate-500 text-sm">Try adjusting your filters or search query</p>
            </div>
          ) : (
            filteredQuestions.map((question) => (
              <PolymarketCard key={question.id} question={question} />
            ))
          )}
        </div>
      </main>

      {/* Modern Bottom Nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/90 backdrop-blur-2xl border border-slate-200/50 rounded-[2rem] md:hidden flex justify-around py-4 px-6 shadow-2xl z-50 ring-1 ring-black/5">
        <Link href="/" className="flex flex-col items-center group">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          </div>
          <span className="text-[10px] mt-1 font-bold text-blue-600">Markets</span>
        </Link>
        <Link href="/portfolio" className="flex flex-col items-center group text-slate-400">
          <div className="p-2 rounded-xl transition-colors group-hover:bg-slate-50 group-hover:text-slate-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
          </div>
          <span className="text-[10px] mt-1 font-bold">Portfolio</span>
        </Link>
        <Link href="/leaderboard" className="flex flex-col items-center group text-slate-400">
          <div className="p-2 rounded-xl transition-colors group-hover:bg-slate-50 group-hover:text-slate-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          </div>
          <span className="text-[10px] mt-1 font-bold">Ranks</span>
        </Link>
      </div>
    </div>
  );
}

function PolymarketCard({ question }: { question: Question }) {
  const yesPrice = Math.round(question.market.yes_price * 100);
  const noPrice = 100 - yesPrice;
  const totalVolume = question.market.total_volume || 0;
  
  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `$${(vol / 1000).toFixed(1)}k`;
    return `$${vol}`;
  };

  return (
    <Link href={`/market/${question.id}`}>
      <div className="bg-white rounded-[2.5rem] p-8 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-500/10 group border border-slate-100">
        <div className="flex gap-6 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center text-3xl border border-white shadow-inner">
            {question.title.toLowerCase().includes('election') ? '🗳️' : 
             question.title.toLowerCase().includes('iran') ? '🇮🇷' : 
             question.title.toLowerCase().includes('trump') ? '🇺🇸' : '📈'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-4">
              <h3 className="text-[19px] font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                {question.title}
              </h3>
              <div className="flex flex-col items-center bg-blue-600 rounded-2xl px-4 py-3 min-w-[80px] shadow-lg shadow-blue-500/30 transform group-hover:scale-110 transition-transform">
                <span className="text-white font-black text-xl leading-none">{yesPrice}%</span>
                <span className="text-[8px] text-blue-100 uppercase font-black tracking-widest mt-1">CHANCE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button className="relative overflow-hidden group/btn bg-emerald-50 text-emerald-600 font-black py-4 rounded-2xl border-2 border-emerald-100/50 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all text-sm shadow-sm active:scale-[0.97]">
            <span className="relative z-10 flex items-center justify-center gap-2">
              YES {yesPrice}¢
            </span>
          </button>
          <button className="relative overflow-hidden group/btn bg-rose-50 text-rose-600 font-black py-4 rounded-2xl border-2 border-rose-100/50 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all text-sm shadow-sm active:scale-[0.97]">
            <span className="relative z-10 flex items-center justify-center gap-2">
              NO {noPrice}¢
            </span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-100 text-[13px] text-slate-400 font-bold">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              {formatVolume(totalVolume)} Vol.
            </span>
            <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 uppercase tracking-widest text-[10px]">
              {question.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-300 hover:text-blue-500 hover:scale-110 active:scale-90">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
