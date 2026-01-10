"use client";

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Position } from '@/types';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import MobileBottomNav from '@/components/ui/MobileBottomNav';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Dropdown from '@/components/ui/Dropdown';

function ActivityPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'profit' | 'value'>('recent');

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const response = await api.getPositions();
      setPositions(response.positions || []);
    } catch (error) {
      console.error('Failed to fetch activity:', error);
      setPositions([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter positions
  const filteredPositions = positions.filter(p => {
    if (filter === 'all') return true;
    // Handle both uppercase and potential variations
    const positionUpper = p.position?.toUpperCase();
    if (filter === 'yes') return positionUpper === 'YES';
    if (filter === 'no') return positionUpper === 'NO';
    return true;
  });

  // Sort positions
  const sortedPositions = [...filteredPositions].sort((a, b) => {
    switch (sortBy) {
      case 'profit':
        return (b.profit_loss || 0) - (a.profit_loss || 0);
      case 'value':
        return (b.current_value || 0) - (a.current_value || 0);
      case 'recent':
      default:
        return b.id - a.id;
    }
  });

  // Helper function to format date as "Today", "Yesterday", or "Month Day, Year"
  const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Set time to 00:00:00 for comparison
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    if (date.getTime() === today.getTime()) {
      return 'Today';
    } else if (date.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  // Group by date using actual created_at field
  const groupedByDate = sortedPositions.reduce((acc, position) => {
    if (position.created_at) {
      const date = formatDateLabel(position.created_at);
      if (!acc[date]) acc[date] = [];
      acc[date].push(position);
    }
    return acc;
  }, {} as Record<string, Position[]>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Head>
        <title>Activity - 9ja Markets</title>
        <meta name="description" content="View your recent market transactions and trading activity" />
      </Head>

      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-32">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-violet-100 rounded-xl">
              <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight">Activity Feed</h1>
              <p className="text-sm text-slate-500 font-medium">Your recent market transactions and opinions</p>
            </div>
          </div>
        </div>

        {/* Filters - One row on mobile */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-sm p-3 md:p-4 mb-6 relative z-20">
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            {/* Position Filter */}
            <Dropdown
              options={[
                { 
                  value: 'all', 
                  label: 'All Positions',
                  icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>'
                },
                { 
                  value: 'yes', 
                  label: 'YES Only',
                  icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>'
                },
                { 
                  value: 'no', 
                  label: 'NO Only',
                  icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>'
                }
              ]}
              value={filter}
              onChange={(value) => setFilter(value as 'all' | 'yes' | 'no')}
              className="w-full"
            />

            {/* Sort Dropdown */}
            <Dropdown
              options={[
                { 
                  value: 'recent', 
                  label: 'Most Recent',
                  icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
                },
                { 
                  value: 'profit', 
                  label: 'Highest P&L',
                  icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>'
                },
                { 
                  value: 'value', 
                  label: 'Highest Value',
                  icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
                }
              ]}
              value={sortBy}
              onChange={(value) => setSortBy(value as 'recent' | 'profit' | 'value')}
              className="w-full"
            />
          </div>
        </div>

        {/* Activity Feed */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : sortedPositions.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-lg p-12 md:p-20 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-slate-700 font-bold mb-2">No activity yet</p>
            <p className="text-sm text-slate-500 mb-6">Start expressing your opinions to see activity here</p>
            <Link href="/">
              <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-violet-500/30 active:scale-95">
                Browse Markets
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByDate).map(([date, datePositions]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200/60 shadow-sm">
                    {date}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                </div>

                {/* Activity Cards */}
                <div className="space-y-3">
                  {datePositions.map((position, index) => (
                    <div key={position.id}>
                      <ActivityCard position={position} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
}

function ActivityCard({ position }: { position: Position }) {
  const isYes = position.position?.toUpperCase() === 'YES';
  const isProfit = (position.profit_loss || 0) > 0;
  const profitPercent = position.profit_loss_pct || 0;
  
  // Calculate average price per share
  const avgPrice = position.shares > 0 ? position.cost / position.shares : 0;
  const currentPrice = position.shares > 0 ? position.current_value / position.shares : 0;

  return (
    <Link href={`/market/${position.question.id}`}>
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-100/50 transition-all duration-200 p-4 md:p-5 group active:scale-[0.99]">
        <div className="flex items-start gap-3 md:gap-4">
          {/* Icon */}
          <div className={`flex-shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${
            isYes 
              ? 'bg-gradient-to-br from-emerald-100 to-emerald-200/80 border border-emerald-300/60' 
              : 'bg-gradient-to-br from-rose-100 to-rose-200/80 border border-rose-300/60'
          }`}>
            {isYes ? (
              <svg className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 md:w-6 md:h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Top Row */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    isYes ? 'bg-emerald-100/80 text-emerald-700' : 'bg-rose-100/80 text-rose-700'
                  }`}>
                    {position.position}
                  </span>
                  <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${
                    isProfit ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {isProfit ? (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                      </svg>
                    )}
                    {isProfit ? '+' : ''}{profitPercent.toFixed(1)}%
                  </span>
                </div>
                <h3 className="text-sm md:text-base font-bold text-slate-950 line-clamp-2 group-hover:text-violet-600 transition-colors duration-200 leading-snug">
                  {position.question.title}
                </h3>
              </div>
            </div>

            {/* Stats Row - 4 columns */}
            <div className="grid grid-cols-4 gap-2 md:gap-3 mt-3 pt-3 border-t border-slate-100/80">
              <div className="text-center md:text-left">
                <p className="text-[9px] md:text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Shares</p>
                <p className="text-xs md:text-sm font-bold text-slate-950">{(position.shares || 0).toLocaleString(undefined, { maximumFractionDigits: 1 })}</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[9px] md:text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Avg</p>
                <p className="text-xs md:text-sm font-bold text-slate-950">{avgPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[9px] md:text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Value</p>
                <p className="text-xs md:text-sm font-bold text-slate-950">{(position.current_value || 0).toLocaleString(undefined, { maximumFractionDigits: 1 })}</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[9px] md:text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">P&L</p>
                <p className={`text-xs md:text-sm font-bold ${
                  isProfit ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {isProfit ? '+' : ''}{(position.profit_loss || 0).toLocaleString(undefined, { maximumFractionDigits: 1 })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Activity() {
  return (
    <ProtectedRoute>
      <ActivityPage />
    </ProtectedRoute>
  );
}
