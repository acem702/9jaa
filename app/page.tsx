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

  const filteredQuestions = questions.filter(q =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Head>
        <title>Polymarket Clone</title>
      </Head>

      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
        {/* Search & Categories */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1e293b] border border-slate-700 rounded-xl py-3 px-12 text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center space-x-4 overflow-x-auto pb-2 scrollbar-hide">
            <button className="bg-blue-600/20 text-blue-400 px-4 py-1.5 rounded-lg font-medium whitespace-nowrap">All</button>
            <button className="text-slate-400 px-4 py-1.5 rounded-lg font-medium whitespace-nowrap hover:text-white">Trump</button>
            <button className="text-slate-400 px-4 py-1.5 rounded-lg font-medium whitespace-nowrap hover:text-white">Venezuela</button>
            <button className="text-slate-400 px-4 py-1.5 rounded-lg font-medium whitespace-nowrap hover:text-white">Iran</button>
            <button className="text-slate-400 px-4 py-1.5 rounded-lg font-medium whitespace-nowrap hover:text-white">Greenland</button>
          </div>
        </div>

        {/* Markets List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-20 text-slate-500">No markets found</div>
          ) : (
            filteredQuestions.map((question) => (
              <PolymarketCard key={question.id} question={question} />
            ))
          )}
        </div>
      </main>

      {/* Bottom Nav Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0f172a]/80 backdrop-blur-md border-t border-slate-800 md:hidden flex justify-around py-3 px-4 z-50">
        <button className="flex flex-col items-center text-white">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span className="text-[10px] mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center text-slate-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <span className="text-[10px] mt-1">Search</span>
        </button>
        <button className="flex flex-col items-center text-slate-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
          <span className="text-[10px] mt-1">Breaking</span>
        </button>
        <button className="flex flex-col items-center text-slate-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
          <span className="text-[10px] mt-1">More</span>
        </button>
      </div>
    </div>
  );
}

function PolymarketCard({ question }: { question: Question }) {
  const yesPrice = Math.round(question.market.yes_price * 100);
  
  return (
    <Link href={`/market/${question.id}`}>
      <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-colors group">
        <div className="flex gap-4 mb-4">
          <div className="w-12 h-12 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-xl">
              {question.title.toLowerCase().includes('iran') ? '🇮🇷' : 
               question.title.toLowerCase().includes('venezuela') ? '🇻🇪' : '🗳️'}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="text-[15px] font-bold leading-tight pr-4 group-hover:text-blue-400 transition-colors">
                {question.title}
              </h3>
              <div className="flex flex-col items-center border border-slate-700 rounded-lg p-2 min-w-[64px] bg-[#0f172a]">
                <span className="text-blue-400 font-bold text-lg">{yesPrice}%</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">chance</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button className="bg-[#10b981]/10 text-[#10b981] font-bold py-2.5 rounded-xl border border-[#10b981]/20 hover:bg-[#10b981]/20 transition-all active:scale-[0.98]">Yes</button>
          <button className="bg-[#ef4444]/10 text-[#ef4444] font-bold py-2.5 rounded-xl border border-[#ef4444]/20 hover:bg-[#ef4444]/20 transition-all active:scale-[0.98]">No</button>
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-bold">
          <div className="flex items-center gap-2">
            <span>$1M Vol.</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg>
          </div>
          <button className="hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
          </button>
        </div>
      </div>
    </Link>
  );
}
