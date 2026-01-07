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
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900">
      <Head>
        <title>9ja Markets | Prediction Platform</title>
      </Head>

      <Navbar />

      <main className="max-w-2xl mx-auto px-4 pt-6 pb-32">
        {/* Search Input - Polymarket Style Light */}
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
            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-12 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 shadow-sm"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 text-slate-400">
            <svg className="w-5 h-5 cursor-pointer hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            <svg className="w-5 h-5 cursor-pointer hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
          </div>
        </div>

        {/* Status Tabs - Scrollable Horizontal Light */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                  : 'bg-white text-slate-500 hover:text-slate-700 border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Markets List - Line Divided Sections */}
        <div className="space-y-0.5 divide-y divide-slate-200">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-8 h-8 border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-20 text-slate-400 font-medium bg-white rounded-2xl border border-slate-100">
              No markets found in this category
            </div>
          ) : (
            filteredQuestions.map((question) => (
              <PolymarketCard key={question.id} question={question} />
            ))
          )}
        </div>
      </main>

      {/* Mobile Bottom Nav - Updated with user links */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 md:hidden flex justify-around py-4 px-4 z-50">
        <Link href="/" className="flex flex-col items-center gap-1.5 transition-all active:scale-95">
          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Home</span>
        </Link>
        <Link href="/portfolio" className="flex flex-col items-center gap-1.5 text-slate-400 transition-all active:scale-95">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Portfolio</span>
        </Link>
        <Link href="/leaderboard" className="flex flex-col items-center gap-1.5 text-slate-400 transition-all active:scale-95">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Ranks</span>
        </Link>
        <Link href="/activity" className="flex flex-col items-center gap-1.5 text-slate-400 transition-all active:scale-95">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Activity</span>
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

  const getEmoji = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('election') || t.includes('vote') || t.includes('trump') || t.includes('biden') || t.includes('kamala')) return '🗳️';
    if (t.includes('iran') || t.includes('israel') || t.includes('war') || t.includes('conflict')) return '🌍';
    if (t.includes('crypto') || t.includes('bitcoin') || t.includes('eth')) return '🪙';
    if (t.includes('stock') || t.includes('market') || t.includes('fed') || t.includes('rate')) return '💹';
    if (t.includes('tech') || t.includes('ai') || t.includes('apple') || t.includes('google')) return '🤖';
    if (t.includes('sport') || t.includes('football') || t.includes('nba') || t.includes('soccer')) return '⚽';
    return '📝'; // Default to a more neutral memo emoji
  };

  return (
    <div className="py-6 transition-colors group">
      <Link href={`/market/${question.id}`}>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all duration-300 shadow-sm">
          <div className="flex gap-4 mb-5">
            <div className="w-14 h-14 bg-slate-50 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl overflow-hidden shadow-inner border border-slate-100">
              {getEmoji(question.title)}
            </div>
            <div className="flex-1 min-w-0 flex justify-between items-start gap-4">
              <h3 className="text-[17px] font-bold text-slate-900 leading-tight line-clamp-2 pt-0.5">
                {question.title}
              </h3>
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path className="stroke-slate-100" strokeWidth="2.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="stroke-blue-600 transition-all duration-1000" strokeWidth="2.5" strokeDasharray={`${yesPrice}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[13px] font-black leading-none text-slate-900">{yesPrice}%</span>
                  <span className="text-[7px] text-slate-400 uppercase font-black tracking-tighter mt-0.5">CHANCE</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <button className="bg-emerald-50 text-emerald-600 font-black py-3 rounded-xl border border-emerald-100 text-sm hover:bg-emerald-600 hover:text-white transition-all active:scale-[0.97] shadow-sm">
              Yes
            </button>
            <button className="bg-rose-50 text-rose-600 font-black py-3 rounded-xl border border-rose-100 text-sm hover:bg-rose-600 hover:text-white transition-all active:scale-[0.97] shadow-sm">
              No
            </button>
          </div>

          <div className="flex items-center justify-between text-[12px] text-slate-500 font-black tracking-tight">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                {formatVolume(totalVolume)} Vol.
              </span>
              <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
            </div>
            <div className="flex items-center gap-3">
               <span className="uppercase text-[9px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{question.status}</span>
               <svg className="w-5 h-5 opacity-40 hover:opacity-100 transition-opacity cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
