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
    if (filter === 'yes') return p.position === 'YES';
    if (filter === 'no') return p.position === 'NO';
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

  // Group by date (mock - in real app, use actual transaction dates)
  const groupedByDate = sortedPositions.reduce((acc, position) => {
    const date = 'Today'; // In real app: format position.created_at
    if (!acc[date]) acc[date] = [];
    acc[date].push(position);
    return acc;
  }, {} as Record<string, Position[]>);

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <Head>
        <title>Activity - 9ja Markets</title>
        <meta name="description" content="View your recent market transactions and trading activity" />
      </Head>

      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-32">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-10 h-10 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight">Activity Feed</h1>
          </div>
          <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">Your recent market transactions and opinions</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
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
              className="flex-1"
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
              className="flex-1"
            />
          </div>
        </div>

        {/* Activity Feed */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : sortedPositions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-12 md:p-20 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-slate-400 font-bold mb-2">No activity yet</p>
            <p className="text-sm text-slate-500 mb-6">Start expressing your opinions to see activity here</p>
            <Link href="/">
              <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold hover:from-violet-700 hover:to-purple-700 transition-colors">
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
                  <div className="h-px flex-1 bg-slate-200"></div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-1 bg-slate-100 rounded-full">
                    {date}
                  </span>
                  <div className="h-px flex-1 bg-slate-200"></div>
                </div>

                {/* Activity Cards */}
                <div className="space-y-3">
                  {datePositions.map((position) => (
                    <ActivityCard key={position.id} position={position} />
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
  const isYes = position.position === 'YES';
  const isProfit = (position.profit_loss || 0) > 0;
  const profitPercent = position.profit_loss_pct || 0;

  return (
    <Link href={`/market/${position.question.id}`}>
      <div className="bg-white rounded-2xl border border-slate-200 hover:border-violet-300 hover:shadow-lg transition-all p-4 md:p-5 group">
        <div className="flex items-start gap-3 md:gap-4">
          {/* Icon */}
          <div className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center ${
            isYes 
              ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 border-2 border-emerald-300' 
              : 'bg-gradient-to-br from-rose-100 to-rose-200 border-2 border-rose-300'
          }`}>
            {isYes ? (
              <svg className="w-6 h-6 md:w-7 md:h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6 md:w-7 md:h-7 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Top Row */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    isYes ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {position.position}
                  </span>
                  <span className={`text-xs font-bold ${
                    isProfit ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {isProfit ? '+' : ''}{profitPercent.toFixed(1)}%
                  </span>
                </div>
                <h3 className="text-sm md:text-base font-bold text-slate-950 line-clamp-2 group-hover:text-violet-600 transition-colors leading-snug">
                  {position.question.title}
                </h3>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-100">
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Shares</p>
                <p className="text-sm font-bold text-slate-950">{(position.shares || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Value</p>
                <p className="text-sm font-bold text-slate-950">{(position.current_value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">P&L</p>
                <p className={`text-sm font-bold ${
                  isProfit ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {isProfit ? '+' : ''}{(position.profit_loss || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
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
