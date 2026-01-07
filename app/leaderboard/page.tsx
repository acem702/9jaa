"use client";

import { useEffect, useState } from 'react';
import Head from 'next/head';
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
