"use client";

import { useEffect, useState, ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Position } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';

function PortfolioPage() {
  const { user } = useAuth();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const { positions: data } = await api.getPositions();
      setPositions(data);
    } catch (error) {
      console.error('Failed to fetch positions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPositions = positions.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'active') return p.question.status === 'active' || p.question.status === 'locked';
    if (filter === 'resolved') return p.question.status === 'resolved';
    return true;
  });

  const totalInvested = positions.reduce((sum, p) => {
    const cost = isNaN(p.cost) ? 0 : p.cost;
    return sum + cost;
  }, 0);
  
  const totalValue = positions.reduce((sum, p) => {
    const currentValue = isNaN(p.current_value) ? 0 : p.current_value;
    return sum + currentValue;
  }, 0);
  const totalPnL = !isNaN(totalValue) && !isNaN(totalInvested) ? totalValue - totalInvested : 0;
  const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
  const formattedTotalPnLPercent = isNaN(totalPnLPercent) ? 0 : totalPnLPercent;

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <Head>
        <title>Portfolio - 9ja Markets</title>
      </Head>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        {/* Portfolio Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            Portfolio
          </h1>
          <p className="text-slate-600 font-bold text-sm">Track your prediction performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            label="Credits"
            value={user ? user.influence_credits.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0'}
            icon={<CreditIcon />}
            valueColor="text-blue-600"
          />
          <StatCard
            label="Invested"
            value={totalInvested.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            icon={<InvestmentIcon />}
            valueColor="text-slate-900"
          />
          <StatCard
            label="Current Value"
            value={totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            icon={<ValueIcon />}
            valueColor="text-indigo-600"
          />
          <StatCard
            label="Total P&L"
            value={`${totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            subtitle={`${formattedTotalPnLPercent >= 0 ? '+' : ''}${formattedTotalPnLPercent.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`}
            icon={totalPnL >= 0 ? <ProfitIcon /> : <LossIcon />}
            valueColor={totalPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
          {['all', 'active', 'resolved'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-6 py-2 rounded-xl text-sm font-black transition-all border ${
                filter === f
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                  : 'bg-white text-slate-500 hover:text-slate-700 border-slate-200'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Positions List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredPositions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-400 font-bold mb-6">No positions yet</p>
            <Link href="/">
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black transition-all shadow-lg shadow-blue-100 uppercase text-xs tracking-widest">
                Browse Markets
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredPositions.map((position) => (
              <PositionCard key={position.id} position={position} />
            ))}
          </div>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 md:hidden flex justify-around py-4 px-4 z-50">
        <Link href="/" className="flex flex-col items-center gap-1.5 transition-all active:scale-95">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Home</span>
        </Link>
        <Link href="/portfolio" className="flex flex-col items-center gap-1.5 text-blue-600 transition-all active:scale-95">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Portfolio</span>
        </Link>
        <Link href="/leaderboard" className="flex flex-col items-center gap-1.5 text-slate-400 transition-all active:scale-95">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Ranks</span>
        </Link>
        <Link href="/activity" className="flex flex-col items-center gap-1.5 text-slate-400 transition-all active:scale-95">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Activity</span>
        </Link>
      </div>
    </div>
  );
}

function CreditIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
    </svg>
  );
}

function InvestmentIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
  );
}

function ValueIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
    </svg>
  );
}

function ProfitIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
    </svg>
  );
}

function LossIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
    </svg>
  );
}

export default function Portfolio() {
  return (
    <ProtectedRoute>
      <PortfolioPage />
    </ProtectedRoute>
  );
}

function StatCard({ label, value, subtitle, icon, valueColor }: {
  label: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  valueColor: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        <div className="flex-shrink-0">{icon}</div>
      </div>
      <p className={`text-xl font-black ${valueColor}`}>{value}</p>
      {subtitle && (
        <p className={`text-[10px] font-black mt-1 ${valueColor}`}>{subtitle}</p>
      )}
    </div>
  );
}

function PositionCard({ position }: { position: Position }) {
  const isWinning = position.profit_loss > 0;
  const isActive = position.question.status === 'active';
  const isResolved = position.question.status === 'resolved';
  const profitPercent = position.profit_loss_pct;

  return (
    <Link href={`/market/${position.question.id}`}>
      <div className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all p-6 group shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black border uppercase tracking-widest ${
                isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                isResolved ? 'bg-slate-50 text-slate-700 border-slate-200' :
                'bg-yellow-50 text-yellow-700 border-yellow-200'
              }`}>
                {position.question.status}
              </span>
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black border uppercase tracking-widest ${
                position.position === 'YES' 
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {position.position}
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {position.question.title}
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SHARES:</span>
                <span className="text-[10px] font-black text-slate-900">
                  {(isNaN(position.shares) ? 0 : position.shares).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">P&L:</span>
                <span className={`text-[10px] font-black ${isWinning ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isWinning ? '+' : ''}{(isNaN(profitPercent) ? 0 : profitPercent).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center min-w-[180px]">
            <div className="border-r border-slate-100 last:border-r-0 pr-3 last:pr-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cost</p>
              <p className="text-sm font-black text-slate-900">{(isNaN(position.cost) ? 0 : position.cost).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
            <div className="border-r border-slate-100 last:border-r-0 pr-3 last:pr-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Value</p>
              <p className="text-sm font-black text-slate-900">{(isNaN(position.current_value) ? 0 : position.current_value).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">P&L</p>
              <p className={`text-sm font-black ${isWinning ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isWinning ? '+' : ''}{(isNaN(position.profit_loss) ? 0 : position.profit_loss).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
