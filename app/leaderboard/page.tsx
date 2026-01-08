"use client";

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import MobileBottomNav from '@/components/ui/MobileBottomNav';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Dropdown from '@/components/ui/Dropdown';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [timeFilter, setTimeFilter] = useState<'monthly' | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'volume' | 'profit' | 'accuracy'>('all');

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

  // Filter and sort data
  const filteredData = data
    .filter(entry => 
      entry.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let aVal = 0;
      let bVal = 0;
      
      if (tab === 'volume') {
        aVal = a.total_volume || 0;
        bVal = b.total_volume || 0;
      } else if (tab === 'profit') {
        aVal = a.total_invested || 0;
        bVal = b.total_invested || 0;
      } else if (tab === 'accuracy') {
        aVal = a.accuracy || 0;
        bVal = b.accuracy || 0;
      }
      
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <Head>
        <title>Leaderboard - 9ja Markets</title>
        <meta name="description" content="Top performing political analysts and traders. See who's leading in volume, profit, and accuracy." />
      </Head>

      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-32">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-10 h-10 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight">Leaderboard</h1>
          </div>
          <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">Top performing political analysts</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6 mb-6">
          {/* Top Row - Dropdowns */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            {/* Time Filter */}
            <Dropdown
              options={[
                { 
                  value: 'all', 
                  label: 'All Time',
                  icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>'
                },
                { 
                  value: 'monthly', 
                  label: 'Monthly',
                  icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
                }
              ]}
              value={timeFilter}
              onChange={(value) => setTimeFilter(value as 'monthly' | 'all')}
              className="flex-1"
            />

            {/* Type Filter */}
            <Dropdown
              options={[
                { 
                  value: 'volume', 
                  label: 'Volume Leaders',
                  icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>'
                },
                { 
                  value: 'profit', 
                  label: 'Profit Leaders',
                  icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
                },
                { 
                  value: 'accuracy', 
                  label: 'Accuracy Leaders',
                  icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
                }
              ]}
              value={tab}
              onChange={(value) => setTab(value as 'volume' | 'profit' | 'accuracy')}
              className="flex-1"
            />
          </div>

          {/* Bottom Row - Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>

            {/* Sort Button */}
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 bg-white"
            >
              <span>{sortOrder === 'desc' ? 'Highest First' : 'Lowest First'}</span>
              <svg className={`w-4 h-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
            {filteredData.length === 0 ? (
              <div className="p-12 md:p-20 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-slate-400 font-bold">
                  {searchQuery ? 'No users match your search' : 'No entries found'}
                </p>
              </div>
            ) : (
              <div className="divide-y-2 divide-slate-100">
                {filteredData.map((entry, index) => (
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

      <MobileBottomNav />
    </div>
  );
}

function LeaderboardRow({ entry, rank, type }: { entry: LeaderboardEntry; rank: number; type: string }) {
  const getMedal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-yellow-900 shadow-lg shadow-yellow-200';
    if (rank === 2) return 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-900 shadow-lg shadow-slate-200';
    if (rank === 3) return 'bg-gradient-to-br from-amber-600 to-amber-700 text-amber-50 shadow-lg shadow-amber-300';
    return 'bg-slate-100 text-slate-600';
  };

  const getAvatarStyle = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-700 border-yellow-300';
    if (rank === 2) return 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 border-slate-300';
    if (rank === 3) return 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 border-amber-300';
    return 'bg-slate-100 text-slate-600 border-slate-200';
  };

  const getValue = () => {
    if (type === 'volume') return entry.total_volume?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0';
    if (type === 'profit') return entry.total_invested?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0';
    if (type === 'accuracy') return entry.accuracy?.toFixed(1) + '%' || '0%';
    return '0';
  };

  const getSubtext = () => {
    if (type === 'accuracy') {
      return `${entry.correct_predictions || 0}/${entry.total_predictions || 0} correct`;
    }
    return `${entry.trade_count || 0} trades`;
  };

  const hasBadge = entry.trade_count && entry.trade_count >= 100;
  const medal = getMedal(rank);

  return (
    <div className="flex items-center gap-3 md:gap-4 p-4 md:p-6 hover:bg-gradient-to-r hover:from-violet-50/50 hover:to-transparent transition-all group">
      {/* Rank */}
      <div className="flex-shrink-0">
        {medal ? (
          <div className="text-3xl md:text-4xl">{medal}</div>
        ) : (
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-sm md:text-base font-black ${getRankStyle(rank)}`}>
            #{rank}
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-lg md:text-xl font-black border-2 shadow-sm group-hover:scale-105 transition-transform ${getAvatarStyle(rank)}`}>
          {entry.name.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Name & Stats */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-base md:text-lg font-bold text-slate-950 truncate">{entry.name}</p>
          {hasBadge && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold rounded-full">
              ⭐ PRO
            </span>
          )}
        </div>
        <p className="text-xs md:text-sm text-slate-500 font-medium">
          {getSubtext()}
        </p>
      </div>

      {/* Value */}
      <div className="text-right">
        <p className="text-lg md:text-xl font-bold text-slate-950">{getValue()}</p>
        <p className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">{type}</p>
      </div>
    </div>
  );
}
