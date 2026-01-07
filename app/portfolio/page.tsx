"use client";

import { useEffect, useState } from 'react';
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

  const totalInvested = positions.reduce((sum, p) => sum + p.cost, 0);
  const totalValue = positions.reduce((sum, p) => sum + p.current_value, 0);
  const totalPnL = totalValue - totalInvested;
  const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

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
          <p className="text-slate-500 font-bold text-sm">Track your prediction performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Credits"
            value={user?.influence_credits.toLocaleString() || '0'}
            icon="💰"
            valueColor="text-blue-600"
          />
          <StatCard
            label="Invested"
            value={totalInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            icon="📊"
            valueColor="text-slate-900"
          />
          <StatCard
            label="Current Value"
            value={totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            icon="💎"
            valueColor="text-indigo-600"
          />
          <StatCard
            label="Total P&L"
            value={`${totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            subtitle={`${totalPnLPercent >= 0 ? '+' : ''}${totalPnLPercent.toFixed(1)}%`}
            icon={totalPnL >= 0 ? '📈' : '📉'}
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
          <div className="space-y-4">
            {filteredPositions.map((position) => (
              <PositionCard key={position.id} position={position} />
            ))}
          </div>
        )}
      </main>
    </div>
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
  icon: string;
  valueColor: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-xl">{icon}</span>
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

  return (
    <Link href={`/market/${position.question.id}`}>
      <div className="bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all p-6 group">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black border uppercase tracking-widest ${
                isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                isResolved ? 'bg-slate-50 text-slate-700 border-slate-200' :
                'bg-yellow-50 text-yellow-700 border-yellow-100'
              }`}>
                {position.question.status}
              </span>
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black border uppercase tracking-widest ${
                position.position === 'YES' 
                  ? 'bg-blue-50 text-blue-700 border-blue-100'
                  : 'bg-rose-50 text-rose-700 border-rose-100'
              }`}>
                {position.position}
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {position.question.title}
            </h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {Number(position.shares).toFixed(2)} SHARES
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 text-right">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Cost</p>
              <p className="text-sm font-black text-slate-900">{Number(position.cost).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Value</p>
              <p className="text-sm font-black text-slate-900">{Number(position.current_value).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">P&L</p>
              <p className={`text-sm font-black ${isWinning ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isWinning ? '+' : ''}{Number(position.profit_loss).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
