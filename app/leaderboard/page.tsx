"use client";

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';

interface LeaderboardEntry {
  id: number;
  name: string;
  email?: string;
  total_volume?: number;
  trade_count?: number;
  total_invested?: number;
  markets_traded?: number;
  correct_predictions?: number;
  total_predictions?: number;
  accuracy?: number;
}

export default function Leaderboard() {
  const [tab, setTab] = useState<'volume' | 'profit' | 'accuracy'>('volume');
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [tab]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await api.getLeaderboard(tab);
      setData(response.leaderboard || []);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <Head>
        <title>Leaderboard - 9ja Markets</title>
      </Head>

      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-32">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Rankings</h1>
          <p className="text-slate-500 font-bold text-sm">Top performing political analysts</p>
        </div>

        {/* Tabs - Mobile Optimized Light */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
          <TabButton active={tab === 'volume'} onClick={() => setTab('volume')}>
            Volume
          </TabButton>
          <TabButton active={tab === 'profit'} onClick={() => setTab('profit')}>
            Invested
          </TabButton>
          <TabButton active={tab === 'accuracy'} onClick={() => setTab('accuracy')}>
            Accuracy
          </TabButton>
        </div>

        {/* Leaderboard - Clean List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
            {data.length === 0 ? (
              <div className="p-20 text-center text-slate-400 font-bold">No entries found</div>
            ) : (
              data.map((entry, index) => (
                <LeaderboardRow 
                  key={entry.id} 
                  entry={entry} 
                  rank={index + 1}
                  type={tab}
                />
              ))
            )}
          </div>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 md:hidden flex justify-around py-4 px-4 z-50">
        <Link href="/" className="flex flex-col items-center gap-1.5 transition-all active:scale-95">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Home</span>
        </Link>
        <Link href="/portfolio" className="flex flex-col items-center gap-1.5 text-slate-400 transition-all active:scale-95">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Portfolio</span>
        </Link>
        <Link href="/leaderboard" className="flex flex-col items-center gap-1.5 text-blue-600 transition-all active:scale-95">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Ranks</span>
        </Link>
        <Link href="/activity" className="flex flex-col items-center gap-1.5 text-slate-400 transition-all active:scale-95">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Activity</span>
        </Link>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-xl text-sm font-black whitespace-nowrap transition-all border ${
        active
          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
          : 'bg-white text-slate-500 hover:text-slate-700 border-slate-200'
      }`}
    >
      {children}
    </button>
  );
}

function LeaderboardRow({ entry, rank, type }: { entry: LeaderboardEntry; rank: number; type: string }) {
  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-yellow-400 text-yellow-900';
    if (rank === 2) return 'bg-slate-300 text-slate-900';
    if (rank === 3) return 'bg-amber-600 text-amber-50';
    return 'bg-slate-100 text-slate-500';
  };

  const getValue = () => {
    if (type === 'volume') return entry.total_volume?.toLocaleString() || '0';
    if (type === 'profit') return entry.total_invested?.toLocaleString() || '0';
    if (type === 'accuracy') return entry.accuracy?.toFixed(1) + '%' || '0%';
    return '0';
  };

  return (
    <div className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors group">
      {/* Rank */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${getRankBadge(rank)} shadow-sm`}>
        {rank}
      </div>

      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black border border-slate-200 shadow-inner group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
          {entry.name.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-slate-900 truncate uppercase tracking-tight">{entry.name}</p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {type === 'accuracy' ? `${entry.correct_predictions}/${entry.total_predictions} CORRECT` : `${entry.trade_count || 0} TRADES`}
        </p>
      </div>

      {/* Value */}
      <div className="text-right">
        <p className="text-sm font-black text-slate-900">{getValue()}</p>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{type.toUpperCase()}</p>
      </div>
    </div>
  );
}
