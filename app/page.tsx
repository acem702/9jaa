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

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
        {/* Search & Tabs Header */}
        <div className="mb-8 space-y-6">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm group-hover:shadow-md"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex p-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Markets List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <span className="text-slate-400 font-medium">Loading markets...</span>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm px-6">
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
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl md:hidden flex justify-around py-3 px-4 shadow-2xl z-50 ring-1 ring-black/5">
        <button className="flex flex-col items-center group">
          <div className="p-1 rounded-lg bg-blue-50 text-blue-600 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          </div>
          <span className="text-[10px] mt-1 font-bold text-blue-600">Home</span>
        </button>
        <button className="flex flex-col items-center group text-slate-400">
          <svg className="w-6 h-6 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <span className="text-[10px] mt-1 font-bold">Search</span>
        </button>
        <button className="flex flex-col items-center group text-slate-400">
          <svg className="w-6 h-6 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
          <span className="text-[10px] mt-1 font-bold">Breaking</span>
        </button>
        <button className="flex flex-col items-center group text-slate-400">
          <svg className="w-6 h-6 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
          <span className="text-[10px] mt-1 font-bold">More</span>
        </button>
      </div>
    </div>
  );
}

function PolymarketCard({ question }: { question: Question }) {
  const yesPrice = Math.round(question.market.yes_price * 100);
  const noPrice = 100 - yesPrice;
  
  return (
    <Link href={`/market/${question.id}`}>
      <div className="bg-white rounded-3xl p-5 hover:scale-[1.01] transition-all shadow-sm hover:shadow-xl group border border-slate-100">
        <div className="flex gap-4 mb-6">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl border border-slate-100 shadow-inner">
            {question.title.toLowerCase().includes('election') ? '🗳️' : 
             question.title.toLowerCase().includes('iran') ? '🇮🇷' : 
             question.title.toLowerCase().includes('trump') ? '🇺🇸' : '📈'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-3">
              <h3 className="text-[17px] font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                {question.title}
              </h3>
              <div className="flex flex-col items-center bg-blue-600 rounded-2xl p-2.5 min-w-[72px] shadow-lg shadow-blue-200">
                <span className="text-white font-black text-xl leading-none">{yesPrice}%</span>
                <span className="text-[9px] text-white/80 uppercase font-black tracking-widest mt-1">chance</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button className="relative overflow-hidden group/btn bg-emerald-50 text-emerald-600 font-black py-3.5 rounded-2xl border border-emerald-100 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all text-sm active:scale-[0.97]">
            <span className="relative z-10 flex items-center justify-center gap-2">
              Yes {yesPrice}¢
            </span>
          </button>
          <button className="relative overflow-hidden group/btn bg-rose-50 text-rose-600 font-black py-3.5 rounded-2xl border border-rose-100 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all text-sm active:scale-[0.97]">
            <span className="relative z-10 flex items-center justify-center gap-2">
              No {noPrice}¢
            </span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-[12px] text-slate-400 font-bold">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              $1M Vol.
            </span>
            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
              {question.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-blue-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
