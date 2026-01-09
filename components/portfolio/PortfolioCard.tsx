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
    <div className="bg-gradient-to-br from-violet-600 via-violet-700 to-purple-700 rounded-3xl shadow-2xl shadow-violet-200 overflow-hidden">
      <div className="p-6 md:p-8 relative">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnptMCAwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-50" />
        
        <div className="relative">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <p className="text-violet-200 text-xs md:text-sm font-semibold mb-1 uppercase tracking-wider">Total Balance</p>
              <h2 className="text-4xl md:text-5xl font-black text-white">
                {user ? user.influence_credits.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0'}
              </h2>
              <p className="text-violet-200/80 text-sm font-medium mt-1">credits available</p>
            </div>
            
            {/* P&L Badge */}
            <div className={`px-4 md:px-6 py-3 rounded-2xl backdrop-blur-sm ${
              isProfit ? 'bg-emerald-500/20 border-2 border-emerald-400/50' : 'bg-rose-500/20 border-2 border-rose-400/50'
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
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 md:p-4 border border-white/10 hover:bg-white/15 transition-all duration-200 group">
              <p className="text-violet-200 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 md:mb-2">Invested</p>
              <p className="text-xl md:text-2xl font-black text-white group-hover:scale-105 transition-transform duration-200 origin-left">{safeInvested.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 md:p-4 border border-white/10 hover:bg-white/15 transition-all duration-200 group">
              <p className="text-violet-200 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 md:mb-2">Current Value</p>
              <p className="text-xl md:text-2xl font-black text-white group-hover:scale-105 transition-transform duration-200 origin-left">{safeValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 md:p-4 border border-white/10 hover:bg-white/15 transition-all duration-200 group">
              <p className="text-violet-200 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 md:mb-2">Positions</p>
              <p className="text-xl md:text-2xl font-black text-white group-hover:scale-105 transition-transform duration-200 origin-left">{positionsCount}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/">
              <button className="w-full py-3 bg-white text-violet-600 rounded-xl font-bold hover:bg-violet-50 transition-all duration-200 shadow-lg active:scale-95">
                Browse Markets
              </button>
            </Link>
            <button className="w-full py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/20 transition-all duration-200 border border-white/20 active:scale-95">
              Add Credits
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="bg-black/20 backdrop-blur-sm px-4 md:px-8 py-3 md:py-4 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs md:text-sm">
          <div className="flex items-center gap-2 text-violet-200">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">Last updated: just now</span>
          </div>
          {user && (
            <div className="flex items-center gap-2 text-violet-200 font-semibold truncate">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="truncate">{user.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
