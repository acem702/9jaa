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
      setData(response.leaderboard);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Leaderboard - Political Sentiment</title>
      </Head>

      <Navbar />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        {/* Header - Compact */}
        <div className="mb-3 sm:mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Top performers</p>
        </div>

        {/* Tabs - Mobile Optimized */}
        <div className="flex gap-2 mb-3 sm:mb-4 overflow-x-auto hide-scrollbar">
          <TabButton active={tab === 'volume'} onClick={() => setTab('volume')}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Volume
          </TabButton>
          <TabButton active={tab === 'profit'} onClick={() => setTab('profit')}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Invested
          </TabButton>
          <TabButton active={tab === 'accuracy'} onClick={() => setTab('accuracy')}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Accuracy
          </TabButton>
        </div>

        {/* Leaderboard - Polymarket Style */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
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

        <p className="text-xs text-gray-400 text-center mt-3">Updated just now</p>
      </main>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
      }`}
    >
      {children}
    </button>
  );
}

function LeaderboardRow({ entry, rank, type }: { entry: LeaderboardEntry; rank: number; type: string }) {
  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const getValue = () => {
    if (type === 'volume') return entry.total_volume?.toLocaleString() || '0';
    if (type === 'profit') return entry.total_invested?.toLocaleString() || '0';
    if (type === 'accuracy') return entry.accuracy?.toFixed(1) + '%' || '0%';
    return '0';
  };

  const getSubtext = () => {
    if (type === 'volume') return `${entry.trade_count || 0} trades`;
    if (type === 'profit') return `${entry.markets_traded || 0} markets`;
    if (type === 'accuracy') return `${entry.correct_predictions || 0}/${entry.total_predictions || 0} correct`;
    return '';
  };

  return (
    <div className="flex items-center gap-3 p-3 sm:p-4 hover:bg-gray-50 transition-colors">
      {/* Rank */}
      <div className="flex-shrink-0 w-8 sm:w-10">
        {getMedalEmoji(rank) ? (
          <span className="text-xl sm:text-2xl">{getMedalEmoji(rank)}</span>
        ) : (
          <span className="text-sm sm:text-base font-bold text-gray-400">#{rank}</span>
        )}
      </div>

      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <span className="text-xs sm:text-sm font-bold text-white">
            {entry.name.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">{entry.name}</p>
        <p className="text-xs text-gray-500">{getSubtext()}</p>
      </div>

      {/* Value */}
      <div className="text-right">
        <p className="text-sm sm:text-base font-bold text-gray-900">{getValue()}</p>
      </div>
    </div>
  );
}