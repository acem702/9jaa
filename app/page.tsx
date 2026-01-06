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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Head>
        <title>9ja Markets</title>
      </Head>

      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm group-hover:shadow-md"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Markets List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-20 text-gray-500 bg-white rounded-3xl border border-gray-100 shadow-sm">No markets found</div>
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
  
  return (
    <Link href={`/market/${question.id}`}>
      <div className="bg-white border border-gray-100 rounded-3xl p-5 hover:border-blue-200 transition-all shadow-sm hover:shadow-xl group">
        <div className="flex gap-4 mb-5">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl shadow-inner">
            {question.title.toLowerCase().includes('election') ? '🗳️' : 
             question.title.toLowerCase().includes('iran') ? '🇮🇷' : 
             question.title.toLowerCase().includes('trump') ? '🇺🇸' : '📈'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-4">
              <h3 className="text-[17px] font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                {question.title}
              </h3>
              <div className="flex flex-col items-center border border-blue-50 rounded-xl p-2 min-w-[70px] bg-blue-50/50">
                <span className="text-blue-600 font-black text-xl leading-none">{yesPrice}%</span>
                <span className="text-[10px] text-blue-400 uppercase font-black tracking-wider mt-1">chance</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="relative group/btn">
            <button className="w-full bg-emerald-50 text-emerald-600 font-black py-3 rounded-2xl border border-emerald-100 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all text-sm uppercase tracking-wide">
              Yes {yesPrice}¢
            </button>
          </div>
          <div className="relative group/btn">
            <button className="w-full bg-rose-50 text-rose-600 font-black py-3 rounded-2xl border border-rose-100 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all text-sm uppercase tracking-wide">
              No {100 - yesPrice}¢
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-[12px] text-gray-400 font-bold">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              $1M Vol.
            </span>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-blue-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}
