'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Position } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import TabButton from '@/components/ui/TabButton';
import EmptyState from '@/components/ui/EmptyState';
import Dropdown from '@/components/ui/Dropdown';

interface PositionsListProps {
  positions: Position[];
}

type TabType = 'all' | 'active' | 'resolved';
type SortType = 'recent' | 'pnl' | 'value';

const sortOptions = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'pnl', label: 'P&L (High to Low)' },
  { value: 'value', label: 'Value (High to Low)' },
];

export default function PositionsList({ positions }: PositionsListProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [sortBy, setSortBy] = useState<SortType>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter positions by tab
  const filteredPositions = positions.filter(p => {
    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'active' ? (p.question.status === 'active' || p.question.status === 'locked') :
      p.question.status === 'resolved';

    const matchesSearch = 
      p.question.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Sort positions
  const sortedPositions = [...filteredPositions].sort((a, b) => {
    switch (sortBy) {
      case 'pnl':
        return (b.profit_loss || 0) - (a.profit_loss || 0);
      case 'value':
        return (b.current_value || 0) - (a.current_value || 0);
      case 'recent':
      default:
        return b.id - a.id;
    }
  });

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-slate-200/60">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-xl md:text-2xl font-black text-slate-900">Your Positions</h3>
            </div>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              {sortedPositions.length} position{sortedPositions.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
              isSearchFocused ? 'text-violet-500' : 'text-slate-400'
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search positions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 focus:bg-white transition-all duration-200"
            />
          </div>
        </div>

        {/* Tabs and Sort - 2 rows on mobile */}
        <div className="flex flex-col gap-3">
          {/* Status Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
              All
            </TabButton>
            <TabButton active={activeTab === 'active'} onClick={() => setActiveTab('active')}>
              Active
            </TabButton>
            <TabButton active={activeTab === 'resolved'} onClick={() => setActiveTab('resolved')}>
              Resolved
            </TabButton>
          </div>

          {/* Sort Dropdown - Custom */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Sort by:</span>
            <Dropdown
              options={sortOptions}
              value={sortBy}
              onChange={(val) => setSortBy(val as SortType)}
              className="flex-1 md:w-48 md:flex-none"
            />
          </div>
        </div>
      </div>

      {/* Positions List with dividers */}
      <div>
        {sortedPositions.length === 0 ? (
          <div className="p-8 md:p-12">
            <EmptyState 
              message={searchQuery ? "No positions match your search" : "No positions in this category"}
              actionText={searchQuery ? undefined : "Browse Markets"}
              actionLink={searchQuery ? undefined : "/"}
            />
          </div>
        ) : (
          sortedPositions.map((position, index) => (
            <div key={position.id}>
              <PositionCard position={position} />
              {/* Divider - don't show after last item */}
              {index < sortedPositions.length - 1 && (
                <div className="mx-4 md:mx-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function PositionCard({ position }: { position: Position }) {
  const isWinning = (position.profit_loss || 0) > 0;
  const profitPercent = position.profit_loss_pct || 0;

  return (
    <Link href={`/market/${position.question.id}`}>
      <div className="p-4 md:p-6 hover:bg-violet-50/50 transition-all duration-200 group active:scale-[0.99]">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
          {/* Left Section */}
          <div className="flex-1 min-w-0">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
              <StatusBadge status={position.question.status} variant="status" />
              <StatusBadge status={position.position} variant="position" />
            </div>

            {/* Title */}
            <h4 className="text-base md:text-lg font-black text-slate-900 mb-3 line-clamp-2 group-hover:text-violet-600 transition-colors duration-200">
              {position.question.title}
            </h4>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100/80">
                <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-slate-600 font-semibold">
                  {(position.shares || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })} shares
                </span>
              </div>
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${
                isWinning ? 'bg-emerald-50' : 'bg-rose-50'
              }`}>
                <svg className={`w-4 h-4 flex-shrink-0 ${isWinning ? 'text-emerald-500' : 'text-rose-500'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d={isWinning ? "M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" : "M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"} clipRule="evenodd" />
                </svg>
                <span className={`font-bold ${isWinning ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isWinning ? '+' : ''}{profitPercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Right Section - Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-3 md:flex-col md:text-right">
            <div className="bg-slate-50/80 rounded-xl p-2 md:p-3 md:bg-transparent">
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Cost</p>
              <p className="text-sm md:text-lg font-black text-slate-900">
                {(position.cost || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-slate-50/80 rounded-xl p-2 md:p-3 md:bg-transparent">
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Value</p>
              <p className="text-sm md:text-lg font-black text-slate-900">
                {(position.current_value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className={`rounded-xl p-2 md:p-3 ${isWinning ? 'bg-emerald-50/80 md:bg-transparent' : 'bg-rose-50/80 md:bg-transparent'}`}>
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">P&L</p>
              <p className={`text-sm md:text-lg font-black ${isWinning ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isWinning ? '+' : ''}{(position.profit_loss || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
