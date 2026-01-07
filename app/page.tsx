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
      // Ensure we have an array even if API returns something unexpected
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
    // Robust case-insensitive status matching
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
    <div className="min-h-screen bg-[#0f172a] text-slate-100">
      <Head>
        <title>9ja Markets | Prediction Platform</title>
      </Head>

      <Navbar />

      <main className="max-w-2xl mx-auto px-4 pt-6 pb-32">
        {/* Search Input - Polymarket Style */}
        <div className="relative mb-6">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1e293b] border border-slate-700/50 rounded-xl py-3 px-12 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-500 shadow-sm"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 text-slate-400">
            <svg className="w-5 h-5 cursor-pointer hover:text-slate-200 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            <svg className="w-5 h-5 cursor-pointer hover:text-slate-200 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
          </div>
        </div>

        {/* Status Tabs - Scrollable Horizontal */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Markets List - Line Divided Sections */}
        <div className="space-y-0.5 divide-y divide-slate-800/40">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-20 text-slate-500 font-medium bg-[#1e293b]/10 rounded-2xl border border-slate-800/30">
              No markets found in this category
            </div>
          ) : (
            filteredQuestions.map((question) => (
              <PolymarketCard key={question.id} question={question} />
            ))
          )}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0f172a]/90 backdrop-blur-2xl border-t border-slate-800/50 md:hidden flex justify-around py-4 px-4 z-50">
        <Link href="/" className="flex flex-col items-center gap-1.5 transition-all active:scale-95">
          <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Home</span>
        </Link>
        <Link href="/" className="flex flex-col items-center gap-1.5 text-slate-500 transition-all active:scale-95">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Search</span>
        </Link>
        <Link href="/" className="flex flex-col items-center gap-1.5 text-slate-500 transition-all active:scale-95">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Live</span>
        </Link>
        <button className="flex flex-col items-center gap-1.5 text-slate-500 transition-all active:scale-95">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
          <span className="text-[10px] font-black uppercase tracking-widest">More</span>
        </button>
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
    <div className="py-6 transition-colors group">
      <Link href={`/market/${question.id}`}>
        <div className="bg-transparent rounded-2xl p-4 border border-transparent hover:bg-[#1e293b]/20 hover:border-slate-800/30 transition-all duration-300">
          <div className="flex gap-4 mb-5">
            <div className="w-14 h-14 bg-slate-800/50 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl overflow-hidden shadow-inner border border-slate-700/30">
              {question.title.toLowerCase().includes('election') ? '🗳️' : 
               question.title.toLowerCase().includes('iran') ? '🇮🇷' : 
               question.title.toLowerCase().includes('trump') ? '🇺🇸' : '📈'}
            </div>
            <div className="flex-1 min-w-0 flex justify-between items-start gap-4">
              <h3 className="text-[17px] font-bold text-slate-100 leading-tight line-clamp-2 pt-0.5">
                {question.title}
              </h3>
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path className="stroke-slate-800/80" strokeWidth="2.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="stroke-blue-500 transition-all duration-1000" strokeWidth="2.5" strokeDasharray={`${yesPrice}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[13px] font-black leading-none text-slate-100">{yesPrice}%</span>
                  <span className="text-[7px] text-slate-500 uppercase font-black tracking-tighter mt-0.5">CHANCE</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <button className="bg-emerald-500/10 text-emerald-500 font-black py-3 rounded-xl border border-emerald-500/20 text-sm hover:bg-emerald-500 hover:text-white transition-all active:scale-[0.97] shadow-sm">
              Yes
            </button>
            <button className="bg-rose-500/10 text-rose-600 font-black py-3 rounded-xl border border-rose-500/20 text-sm hover:bg-rose-500 hover:text-white transition-all active:scale-[0.97] shadow-sm">
              No
            </button>
          </div>

          <div className="flex items-center justify-between text-[12px] text-slate-500 font-black tracking-tight">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                {formatVolume(totalVolume)} Vol.
              </span>
              <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
            </div>
            <div className="flex items-center gap-3">
               <span className="uppercase text-[9px] bg-slate-800/40 px-2 py-0.5 rounded border border-slate-700/30">{question.status}</span>
               <svg className="w-5 h-5 opacity-40 hover:opacity-100 transition-opacity cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
