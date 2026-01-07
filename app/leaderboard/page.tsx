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
    <div className="min-h-screen bg-background">
      <Head>
        <title>Leaderboard - 9ja Markets</title>
      </Head>

      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 pb-32">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-1">Rankings</h1>
          <p className="text-muted-foreground font-medium">Top performing political analysts</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex gap-2 bg-slate-100/80 p-1 rounded-lg">
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
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {data.length === 0 ? (
              <div className="p-20 text-center text-muted-foreground font-medium">No entries found</div>
            ) : (
              <div className="divide-y divide-border">
                {data.map((entry, index) => (
                  <LeaderboardRow
                    key={entry.id}
                    entry={entry}
                    rank={index + 1}
                    type={tab}
                  />
                ))}
              </div>
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
      className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${
        active
          ? 'bg-white text-slate-800 shadow-sm'
          : 'bg-transparent text-slate-500 hover:text-slate-700'
      }`}
    >
      {children}
    </button>
  );
}

function LeaderboardRow({ entry, rank, type }: { entry: LeaderboardEntry; rank: number; type: string }) {
  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-yellow-400/20 text-yellow-700 border border-yellow-400/30';
    if (rank === 2) return 'bg-slate-300/20 text-slate-700 border border-slate-300/30';
    if (rank === 3) return 'bg-amber-600/20 text-amber-700 border border-amber-600/30';
    return 'bg-slate-100 text-slate-500 border border-slate-200';
  };

  const getValue = () => {
    if (type === 'volume') return entry.total_volume?.toLocaleString() || '0';
    if (type === 'profit') return entry.total_invested?.toLocaleString() || '0';
    if (type === 'accuracy') return entry.accuracy?.toFixed(1) + '%' || '0%';
    return '0';
  };

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors group">
      <div className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold ${getRankBadge(rank)}`}>
        {rank}
      </div>

      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold border border-slate-200 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          {entry.name.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground truncate">{entry.name}</p>
        <p className="text-xs font-medium text-muted-foreground">
          {type === 'accuracy' ? `${entry.correct_predictions}/${entry.total_predictions} CORRECT` : `${entry.trade_count || 0} TRADES`}
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm font-bold text-foreground">{getValue()}</p>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{type.toUpperCase()}</p>
      </div>
    </div>
  );
}
