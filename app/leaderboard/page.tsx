"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
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
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);
  const [selectedUserRank, setSelectedUserRank] = useState<number>(0);
  const [loadingUserStats, setLoadingUserStats] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

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

  // Long press handlers for user card modal - fetch complete user stats
  const handleLongPressStart = useCallback((entry: LeaderboardEntry, rank: number) => {
    longPressTimer.current = setTimeout(async () => {
      setLoadingUserStats(true);
      try {
        // Fetch all three leaderboard types to get complete user data
        const [volumeData, profitData, accuracyData] = await Promise.all([
          api.getLeaderboard('volume', 100),
          api.getLeaderboard('profit', 100),
          api.getLeaderboard('accuracy', 100)
        ]);

        // Find the user in all three datasets
        const volumeUser = volumeData.leaderboard.find(u => u.id === entry.id);
        const profitUser = profitData.leaderboard.find(u => u.id === entry.id);
        const accuracyUser = accuracyData.leaderboard.find(u => u.id === entry.id);

        // Merge all stats into one complete object
        const completeUserData: LeaderboardEntry = {
          id: entry.id,
          name: entry.name,
          email: entry.email,
          total_volume: volumeUser?.total_volume || entry.total_volume || 0,
          trade_count: volumeUser?.trade_count || profitUser?.trade_count || accuracyUser?.trade_count || 0,
          total_invested: profitUser?.total_invested || entry.total_invested || 0,
          markets_traded: profitUser?.markets_traded || volumeUser?.markets_traded || 0,
          correct_predictions: accuracyUser?.correct_predictions || entry.correct_predictions || 0,
          total_predictions: accuracyUser?.total_predictions || entry.total_predictions || 0,
          accuracy: accuracyUser?.accuracy || entry.accuracy || 0,
        };

        setSelectedUser(completeUserData);
        setSelectedUserRank(rank);
      } catch (error) {
        console.error('Failed to fetch complete user stats:', error);
        // Fallback to showing whatever data we have
        setSelectedUser(entry);
        setSelectedUserRank(rank);
      } finally {
        setLoadingUserStats(false);
      }
    }, 500); // 500ms for long press
  }, []);

  const handleLongPressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const closeModal = () => {
    setSelectedUser(null);
    setSelectedUserRank(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <Head>
        <title>Leaderboard - 9ja Markets</title>
        <meta name="description" content="Top performing political analysts and traders. See who's leading in volume, profit, and accuracy." />
      </Head>

      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-32">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight">Leaderboard</h1>
          </div>
          <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">Top performing political analysts</p>
        </div>

        {/* Filters Section - 2 rows on mobile */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-sm p-4 md:p-6 mb-6 hover:shadow-md transition-shadow duration-200 relative z-20">
          {/* Row 1: Time + Type Filters */}
          <div className="grid grid-cols-2 gap-3 mb-3">
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
            />

            {/* Type Filter */}
            <Dropdown
              options={[
                { 
                  value: 'volume', 
                  label: 'Volume',
                  icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>'
                },
                { 
                  value: 'profit', 
                  label: 'Profit',
                  icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
                },
                { 
                  value: 'accuracy', 
                  label: 'Accuracy',
                  icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
                }
              ]}
              value={tab}
              onChange={(value) => setTab(value as 'volume' | 'profit' | 'accuracy')}
            />
          </div>

          {/* Row 2: Search and Sort */}
          <div className="grid grid-cols-[1fr_auto] gap-3">
            {/* Search Bar */}
            <div className="relative group">
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-violet-500 transition-colors duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/70 backdrop-blur-sm border border-slate-200/80 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 focus:bg-white transition-all duration-200"
              />
            </div>

            {/* Sort Button */}
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="px-4 py-2.5 bg-transparent border border-slate-200/80 rounded-xl text-sm font-bold text-slate-600 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50/50 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
            >
              {sortOrder === 'desc' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              )}
              <span className="hidden sm:inline">{sortOrder === 'desc' ? 'High' : 'Low'}</span>
            </button>
          </div>
        </div>

        {/* Hint for long press */}
        <p className="text-xs text-slate-400 font-medium text-center mb-4">Tap and hold a user to view their full stats</p>

        {/* Leaderboard */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-lg overflow-hidden">
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
              <div className="divide-y divide-slate-100">
                {filteredData.map((entry, index) => (
                  <LeaderboardRow 
                    key={entry.id} 
                    entry={entry} 
                    rank={index + 1}
                    type={tab}
                    onLongPressStart={() => handleLongPressStart(entry, index + 1)}
                    onLongPressEnd={handleLongPressEnd}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* User Stats Modal */}
      {selectedUser && !loadingUserStats && (
        <UserStatsModal 
          user={selectedUser} 
          rank={selectedUserRank}
          type={tab}
          onClose={closeModal} 
        />
      )}

      {/* Loading indicator for stats */}
      {loadingUserStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      )}

      <MobileBottomNav />
    </div>
  );
}

// User Stats Modal Component - Compact Version with All Stats
function UserStatsModal({ user, rank, type, onClose }: { user: LeaderboardEntry; rank: number; type: string; onClose: () => void }) {
  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-500';
    if (rank === 2) return 'from-slate-300 to-slate-400';
    if (rank === 3) return 'from-amber-500 to-amber-600';
    return 'from-violet-500 to-purple-500';
  };

  return (
    <>
      {/* Backdrop with blur and fade-in */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
        
        {/* Modal Card - Compact with slide-up animation */}
        <div 
          className="relative bg-white rounded-2xl shadow-2xl max-w-xs w-full overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
          style={{
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* User Info Header */}
          <div className={`bg-gradient-to-br ${getMedalColor(rank)} p-4 text-center relative overflow-hidden`}>
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-shimmer" />
            
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm text-2xl font-black text-white mb-2 shadow-lg animate-in zoom-in-50 duration-500">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-lg font-bold text-white mb-1 animate-in slide-in-from-bottom-2 duration-300 delay-100">{user.name}</h3>
              <div className="inline-block px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold animate-in slide-in-from-bottom-2 duration-300 delay-150">
                Rank #{rank}
              </div>
            </div>
          </div>
          
          {/* All Stats - Always show complete data */}
          <div className="p-4 space-y-2">
            {/* Volume - Always show */}
            <div className="animate-in slide-in-from-left-2 duration-300 delay-200">
              <StatRow 
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                label="Total Volume" 
                value={user.total_volume?.toLocaleString() || '0'}
                highlight={type === 'volume'}
              />
            </div>
            
            {/* Trades - Always show */}
            <div className="animate-in slide-in-from-left-2 duration-300 delay-[250ms]">
              <StatRow 
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>}
                label="Total Trades" 
                value={user.trade_count?.toString() || '0'}
              />
            </div>
            
            {/* Invested - Always show */}
            <div className="animate-in slide-in-from-left-2 duration-300 delay-300">
              <StatRow 
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                label="Total Invested" 
                value={user.total_invested?.toLocaleString() || '0'}
                highlight={type === 'profit'}
              />
            </div>
            
            {/* Markets - Always show */}
            <div className="animate-in slide-in-from-left-2 duration-300 delay-[350ms]">
              <StatRow 
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                label="Markets Traded" 
                value={user.markets_traded?.toString() || '0'}
              />
            </div>
            
            {/* Accuracy - Always show */}
            <div className="animate-in slide-in-from-left-2 duration-300 delay-[400ms]">
              <StatRow 
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                label="Accuracy Rate" 
                value={`${user.accuracy?.toFixed(1) || '0.0'}%`}
                highlight={type === 'accuracy'}
              />
            </div>
            
            {/* Predictions if available */}
            {user.total_predictions && user.total_predictions > 0 && (
              <div className="pt-2 mt-2 border-t border-slate-100 animate-in slide-in-from-bottom-2 duration-300 delay-[450ms]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Correct Predictions</span>
                  <span className="font-bold text-violet-600">
                    {user.correct_predictions || 0}/{user.total_predictions}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Custom keyframe animation */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}

// Stat Row Component
function StatRow({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2 px-3 rounded-lg ${
      highlight ? 'bg-violet-50 border border-violet-100' : 'bg-slate-50'
    }`}>
      <div className="flex items-center gap-2">
        <div className={highlight ? 'text-violet-600' : 'text-slate-400'}>
          {icon}
        </div>
        <span className="text-sm font-medium text-slate-600">{label}</span>
      </div>
      <span className={`text-sm font-bold ${
        highlight ? 'text-violet-600' : 'text-slate-950'
      }`}>{value}</span>
    </div>
  );
}

function LeaderboardRow({ entry, rank, type, onLongPressStart, onLongPressEnd }: { 
  entry: LeaderboardEntry; 
  rank: number; 
  type: string;
  onLongPressStart: () => void;
  onLongPressEnd: () => void;
}) {
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
    if (type === 'volume') {
      return `${entry.trade_count || 0} trades`;
    }
    if (type === 'profit') {
      return `${entry.markets_traded || 0} markets`;
    }
    if (type === 'accuracy') {
      return `${entry.correct_predictions || 0}/${entry.total_predictions || 0} correct`;
    }
    return '';
  };

  const hasBadge = entry.trade_count && entry.trade_count >= 100;
  const medal = getMedal(rank);

  return (
    <div 
      className="flex items-center gap-3 md:gap-4 p-4 md:p-6 hover:bg-gradient-to-r hover:from-violet-50/50 hover:to-transparent transition-all duration-200 group cursor-pointer select-none active:bg-violet-50"
      onMouseDown={onLongPressStart}
      onMouseUp={onLongPressEnd}
      onMouseLeave={onLongPressEnd}
      onTouchStart={onLongPressStart}
      onTouchEnd={onLongPressEnd}
    >
      {/* Rank */}
      <div className="flex-shrink-0">
        {medal ? (
          <div className="text-3xl md:text-4xl group-active:scale-110 transition-transform">{medal}</div>
        ) : (
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-sm md:text-base font-black group-active:scale-110 transition-transform ${getRankStyle(rank)}`}>
            #{rank}
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-lg md:text-xl font-black border-2 shadow-sm group-hover:scale-105 group-active:scale-110 transition-transform ${getAvatarStyle(rank)}`}>
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
