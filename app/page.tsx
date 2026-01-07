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
    <div className="min-h-screen bg-background text-foreground">
      <Head>
        <title>9ja Markets | Prediction Platform</title>
      </Head>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32">
        {/* Search Input & Filters */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-8">
          <div className="relative md:w-80">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search markets"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200/80 rounded-lg py-2.5 px-12 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 bg-slate-100/80 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'bg-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Markets List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full py-20 flex justify-center">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="col-span-full text-center py-20 text-slate-400 font-medium bg-white rounded-lg border border-slate-200/80">
              No markets found in this category
            </div>
          ) : (
            filteredQuestions.map((question) => (
              <PolymarketCard key={question.id} question={question} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function PolymarketCard({ question }: { question: Question }) {
  const yesPrice = Math.round(question.market.yes_price * 100);
  const totalVolume = question.market.total_volume || 0;
  
  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `$${(vol / 1000).toFixed(1)}k`;
    return `$${vol}`;
  };

  return (
    <Link href={`/market/${question.id}`} className="transition-colors group bg-white rounded-lg p-4 border border-slate-200/80 hover:border-slate-300/80 hover:bg-slate-50/50 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start gap-4 mb-4">
          <h3 className="text-base font-bold text-slate-800 leading-tight">
            {question.title}
          </h3>
          <div className="relative w-12 h-12 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path className="stroke-slate-200" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="stroke-slate-800 transition-all duration-1000" strokeWidth="3" strokeDasharray={`${yesPrice}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-bold text-slate-900">{yesPrice}%</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <button className="bg-emerald-500/10 text-emerald-700 font-bold py-2.5 rounded-md border border-emerald-500/20 text-sm hover:bg-emerald-500/20 transition-all active:scale-[0.98]">
            Yes {yesPrice}¢
          </button>
          <button className="bg-rose-500/10 text-rose-700 font-bold py-2.5 rounded-md border border-rose-500/20 text-sm hover:bg-rose-500/20 transition-all active:scale-[0.98]">
            No {100 - yesPrice}¢
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
          <div className="flex items-center gap-2">
            <span className="bg-slate-100/80 px-2 py-1 rounded border border-slate-200/80 uppercase text-[10px] tracking-wider">
              {formatVolume(totalVolume)} Vol.
            </span>
            <span className="bg-slate-100/80 px-2 py-1 rounded border border-slate-200/80 uppercase text-[10px] tracking-wider">
              {question.status}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
