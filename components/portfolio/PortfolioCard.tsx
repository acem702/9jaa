'use client';

import { User } from '@/types';
import Link from 'next/link';

interface PortfolioCardProps {
  user: User | null;
  totalInvested: number;
  totalValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  positionsCount: number;
}

export default function PortfolioCard({ 
  user, 
  totalInvested, 
  totalValue, 
  totalPnL, 
  totalPnLPercent,
  positionsCount 
}: PortfolioCardProps) {
  // Ensure all values are valid numbers
  const safeInvested = isNaN(totalInvested) ? 0 : totalInvested;
  const safeValue = isNaN(totalValue) ? 0 : totalValue;
  const safePnL = isNaN(totalPnL) ? 0 : totalPnL;
  const safePnLPercent = isNaN(totalPnLPercent) ? 0 : totalPnLPercent;
  const isProfit = safePnL >= 0;

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl overflow-hidden">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <p className="text-blue-100 text-sm font-semibold mb-1">Total Balance</p>
            <h2 className="text-4xl md:text-5xl font-black text-white">
              {user ? user.influence_credits.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0'}
            </h2>
            <p className="text-blue-200 text-sm font-medium mt-1">credits available</p>
          </div>
          
          {/* P&L Badge */}
          <div className={`px-4 md:px-6 py-3 rounded-2xl ${
            isProfit ? 'bg-emerald-500/20 border-2 border-emerald-400' : 'bg-rose-500/20 border-2 border-rose-400'
          }`}>
            <p className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">Total P&L</p>
            <p className={`text-xl md:text-2xl font-black ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isProfit ? '+' : ''}{safePnL.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className={`text-sm font-bold ${isProfit ? 'text-emerald-300' : 'text-rose-300'}`}>
              {isProfit ? '+' : ''}{safePnLPercent.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 md:p-4 border border-white/20">
            <p className="text-blue-200 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 md:mb-2">Invested</p>
            <p className="text-xl md:text-2xl font-black text-white">{safeInvested.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 md:p-4 border border-white/20">
            <p className="text-blue-200 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 md:mb-2">Current Value</p>
            <p className="text-xl md:text-2xl font-black text-white">{safeValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 md:p-4 border border-white/20">
            <p className="text-blue-200 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 md:mb-2">Positions</p>
            <p className="text-xl md:text-2xl font-black text-white">{positionsCount}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/">
            <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg">
              Browse Markets
            </button>
          </Link>
          <button className="w-full py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/20 transition-all border border-white/30">
            Add Credits
          </button>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="bg-black/20 backdrop-blur-sm px-4 md:px-8 py-3 md:py-4 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs md:text-sm">
          <div className="flex items-center gap-2 text-blue-200">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Last updated: just now</span>
          </div>
          {user && (
            <div className="text-blue-200 font-semibold truncate">
              {user.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
