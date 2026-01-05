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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Head>
        <title>Portfolio - Political Sentiment</title>
      </Head>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Your Portfolio
          </h1>
          <p className="text-gray-600">Track your positions and performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Credits Available"
            value={user?.influence_credits.toLocaleString() || '0'}
            icon="💰"
            valueColor="text-blue-600"
          />
          <StatCard
            label="Total Invested"
            value={totalInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            icon="📊"
            valueColor="text-gray-900"
          />
          <StatCard
            label="Current Value"
            value={totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            icon="💎"
            valueColor="text-purple-600"
          />
          <StatCard
            label="Total P&L"
            value={`${totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            subtitle={`${totalPnLPercent >= 0 ? '+' : ''}${totalPnLPercent.toFixed(1)}%`}
            icon={totalPnL >= 0 ? '📈' : '📉'}
            valueColor={totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          {['all', 'active', 'resolved'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                filter === f
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Positions List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredPositions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-100">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-xl text-gray-600 mb-4">No positions yet</p>
            <Link href="/">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg">
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
    <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-6">
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
      {subtitle && (
        <p className={`text-sm font-medium mt-1 ${valueColor}`}>{subtitle}</p>
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
      <div className="bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all cursor-pointer p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left Side - Question Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                isActive ? 'bg-green-100 text-green-700 border-green-200' :
                isResolved ? 'bg-gray-100 text-gray-700 border-gray-200' :
                'bg-yellow-100 text-yellow-700 border-yellow-200'
              }`}>
                {position.question.status.toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                position.position === 'YES' 
                  ? 'bg-blue-100 text-blue-700 border-blue-200'
                  : 'bg-red-100 text-red-700 border-red-200'
              }`}>
                {position.position}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
              {position.question.title}
            </h3>
            <p className="text-sm text-gray-600">
              {position.shares.toFixed(2)} shares
            </p>
          </div>

          {/* Right Side - Performance */}
          <div className="flex flex-row md:flex-col gap-6 md:gap-4 md:items-end">
            <div className="flex-1 md:flex-none">
              <p className="text-xs text-gray-500 mb-1">Cost</p>
              <p className="text-lg font-bold text-gray-900">
                {position.cost.toFixed(2)}
              </p>
            </div>

            <div className="flex-1 md:flex-none">
              <p className="text-xs text-gray-500 mb-1">Value</p>
              <p className="text-lg font-bold text-gray-900">
                {position.current_value.toFixed(2)}
              </p>
            </div>

            <div className="flex-1 md:flex-none">
              <p className="text-xs text-gray-500 mb-1">P&L</p>
              <div>
                <p className={`text-lg font-bold ${isWinning ? 'text-green-600' : 'text-red-600'}`}>
                  {isWinning ? '+' : ''}{position.profit_loss.toFixed(2)}
                </p>
                <p className={`text-sm font-medium ${isWinning ? 'text-green-600' : 'text-red-600'}`}>
                  {isWinning ? '+' : ''}{position.profit_loss_pct.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}