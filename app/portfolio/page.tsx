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
    <div className="min-h-screen bg-background">
      <Head>
        <title>Portfolio - 9ja Markets</title>
      </Head>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Portfolio
          </h1>
          <p className="text-muted-foreground font-medium">Track your prediction performance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Credits"
            value={user ? user.influence_credits.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0'}
            icon={<CreditIcon />}
            valueColor="text-primary"
          />
          <StatCard
            label="Invested"
            value={totalInvested.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            icon={<InvestmentIcon />}
            valueColor="text-foreground"
          />
          <StatCard
            label="Current Value"
            value={totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            icon={<ValueIcon />}
            valueColor="text-foreground"
          />
          <StatCard
            label="Total P&L"
            value={`${totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            subtitle={`${formattedTotalPnLPercent >= 0 ? '+' : ''}${formattedTotalPnLPercent.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`}
            icon={totalPnL >= 0 ? <ProfitIcon /> : <LossIcon />}
            valueColor={totalPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'}
          />
        </div>

        <div className="flex justify-end mb-6">
          <div className="flex gap-2 bg-slate-100/80 p-1 rounded-lg">
            {['all', 'active', 'resolved'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${
                  filter === f
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'bg-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredPositions.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-lg border border-border">
            <p className="text-muted-foreground font-bold mb-6">No positions yet</p>
            <Link href="/" className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-bold transition-all text-sm">
                Browse Markets
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

function CreditIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
    </svg>
  );
}

function InvestmentIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
  );
}

function ValueIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
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
    <div className="bg-card rounded-lg border border-border p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className="flex-shrink-0">{icon}</div>
      </div>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
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
  const profitPercent = position.profit_loss_pct;

  return (
    <Link href={`/market/${position.question.id}`} className="block bg-card rounded-lg border border-border hover:border-primary/50 hover:shadow-lg transition-all p-5 group">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
              isActive ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' :
              isResolved ? 'bg-slate-100 text-slate-700 border-slate-200' :
              'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
            }`}>
              {position.question.status}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
              position.position === 'YES'
                ? 'bg-blue-500/10 text-blue-700 border-blue-500/20'
                : 'bg-rose-500/10 text-rose-700 border-rose-500/20'
            }`}>
              {position.position}
            </span>
          </div>
          <h3 className="text-base font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {position.question.title}
          </h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">SHARES:</span>
              <span className="text-xs font-bold text-foreground">
                {(isNaN(position.shares) ? 0 : position.shares).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">P&L (%):</span>
              <span className={`text-xs font-bold ${isWinning ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isWinning ? '+' : ''}{(isNaN(profitPercent) ? 0 : profitPercent).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center min-w-[240px]">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Cost</p>
            <p className="text-sm font-bold text-foreground">{(isNaN(position.cost) ? 0 : position.cost).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Value</p>
            <p className="text-sm font-bold text-foreground">{(isNaN(position.current_value) ? 0 : position.current_value).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">P&L</p>
            <p className={`text-sm font-bold ${isWinning ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isWinning ? '+' : ''}{(isNaN(position.profit_loss) ? 0 : position.profit_loss).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
