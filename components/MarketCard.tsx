'use client';

import Link from 'next/link';
import { Question } from '@/types';
import { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { api } from '@/lib/api';
import StatusBadge from '@/components/ui/StatusBadge';

interface MarketCardProps {
  question: Question;
}

interface SparklineData {
  value: number;
}

export default function MarketCard({ question }: MarketCardProps) {
  const [sparklineData, setSparklineData] = useState<SparklineData[]>([]);
  const yesPrice = Math.round(question.market.yes_price * 100);
  const noPrice = 100 - yesPrice;
  
  // Calculate total liquidity from pools
  const yesPool = parseFloat(question.market.yes_pool?.toString() || '0');
  const noPool = parseFloat(question.market.no_pool?.toString() || '0');
  const totalLiquidity = yesPool + noPool;
  
  // Use new meta.trade_count with fallback to old field for backward compatibility
  const transactionCount = question.meta?.trade_count ?? question.market.transaction_count ?? 0;
  
  useEffect(() => {
    fetchSparklineData();
  }, [question.id]);

  const fetchSparklineData = async () => {
    try {
      const history = await api.getPriceHistory(question.id.toString(), 10);
      const data = history.data.map(d => ({
        value: d.yes_price * 100
      }));
      setSparklineData(data);
    } catch (error) {
      // Fallback to empty sparkline if API fails
      setSparklineData([]);
    }
  };

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `${(vol / 1000).toFixed(1)}K`;
    return vol.toFixed(0);
  };

  const formatLiquidity = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return Math.round(val).toString();
  };

  // Determine trend direction
  const getTrend = () => {
    if (sparklineData.length < 2) return 'neutral';
    const first = sparklineData[0].value;
    const last = sparklineData[sparklineData.length - 1].value;
    const change = last - first;
    if (Math.abs(change) < 1) return 'neutral';
    return change > 0 ? 'up' : 'down';
  };

  const trend = getTrend();
  const trendChange = sparklineData.length >= 2 
    ? sparklineData[sparklineData.length - 1].value - sparklineData[0].value 
    : 0;

  return (
    <Link href={`/market/${question.id}`}>
      <div className="group relative bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 active:scale-[0.98]">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/0 via-transparent to-purple-50/0 group-hover:from-violet-50/40 group-hover:to-purple-50/40 transition-all duration-500 pointer-events-none" />
        
        {/* Shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
        </div>
        
        <div className="relative p-4">
          {/* Top Row: Status Badge, Trend, and Stats - All in one line */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={question.status} variant="status" />
              
              {/* Trend Indicator */}
              {sparklineData.length > 0 && (
                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  trend === 'up' ? 'bg-emerald-50 text-emerald-700' :
                  trend === 'down' ? 'bg-rose-50 text-rose-700' :
                  'bg-slate-50 text-slate-600'
                }`}>
                  {trend === 'up' && (
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  )}
                  {trend === 'down' && (
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                    </svg>
                  )}
                  {trend !== 'neutral' && `${Math.abs(trendChange).toFixed(1)}%`}
                  {trend === 'neutral' && 'Stable'}
                </div>
              )}
            </div>

            {/* Volume & Trades - Compact */}
            <div className="flex items-center gap-2 text-[10px]">
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="font-semibold text-slate-700">{formatLiquidity(totalLiquidity)}</span>
              </div>
              {transactionCount > 0 && (
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="font-semibold text-slate-700">{transactionCount}</span>
                </div>
              )}
            </div>
          </div>

          {/* Question Title - Center Focus */}
          <h3 className="text-base md:text-lg font-bold text-slate-950 leading-snug mb-2 group-hover:text-violet-600 transition-colors line-clamp-2 min-h-[2.5rem]">
            {question.title}
          </h3>

          {/* Sparkline Chart - Compact */}
          {sparklineData.length > 0 && (
            <div className="mb-3 -mx-1">
              <ResponsiveContainer width="100%" height={32}>
                <LineChart data={sparklineData}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#64748b'}
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Half-Circle Meter with Price Buttons */}
          <div className="flex items-end justify-between gap-3">
            {/* Half-Circle Gauge */}
            <div className="flex-1 flex flex-col items-center">
              <div className="relative w-24 h-12">
                <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="xMidYMax meet">
                  {/* Background arc (light gray) */}
                  <path
                    d="M 10 45 A 40 40 0 0 1 90 45"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Colored arc based on sentiment */}
                  <path
                    d="M 10 45 A 40 40 0 0 1 90 45"
                    fill="none"
                    stroke={yesPrice > 60 ? '#10b981' : yesPrice < 40 ? '#ef4444' : '#64748b'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(yesPrice / 100) * 125.66} 125.66`}
                    className="transition-all duration-1000"
                  />
                  {/* Center needle/indicator */}
                  <line
                    x1="50"
                    y1="45"
                    x2={50 + Math.cos((Math.PI * (1 - yesPrice / 100))) * 35}
                    y2={45 - Math.sin((Math.PI * (1 - yesPrice / 100))) * 35}
                    stroke={yesPrice > 60 ? '#059669' : yesPrice < 40 ? '#dc2626' : '#475569'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  {/* Center dot */}
                  <circle cx="50" cy="45" r="3" fill={yesPrice > 60 ? '#059669' : yesPrice < 40 ? '#dc2626' : '#475569'} />
                </svg>
              </div>
              {/* Percentage display below gauge */}
              <span className={`text-xl font-extrabold mb-0.5 ${
                yesPrice > 60 ? 'text-emerald-600' : yesPrice < 40 ? 'text-rose-600' : 'text-slate-700'
              }`}>{yesPrice}%</span>
              <span className="text-[9px] font-medium text-slate-500 uppercase tracking-wide">YES Sentiment</span>
            </div>

            {/* Compact Price Buttons - Fixed Width */}
            <div className="flex gap-2">
              <div className="w-16 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg p-2 border border-emerald-200/80 group-hover:shadow-md group-hover:border-emerald-300 transition-all duration-200">
                <div className="text-[8px] font-bold text-emerald-700 uppercase tracking-wider mb-0.5">YES</div>
                <div className="text-base font-extrabold text-emerald-600">{yesPrice}¢</div>
              </div>
              <div className="w-16 bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-lg p-2 border border-rose-200/80 group-hover:shadow-md group-hover:border-rose-300 transition-all duration-200">
                <div className="text-[8px] font-bold text-rose-700 uppercase tracking-wider mb-0.5">NO</div>
                <div className="text-base font-extrabold text-rose-600">{noPrice}¢</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
