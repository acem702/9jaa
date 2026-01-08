'use client';

import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Position } from '@/types';

interface ProfitLossChartProps {
  positions: Position[];
}

type TimeFilter = '7d' | '30d' | 'all';

export default function ProfitLossChart({ positions }: ProfitLossChartProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30d');

  // Generate chart data from positions
  const chartData = useMemo(() => {
    if (positions.length === 0) return [];

    // Create cumulative P&L data
    const data: Array<{ date: string; pnl: number; cumulative: number }> = [];
    let cumulative = 0;

    // Sort positions by date (assuming we have position date data)
    // For now, we'll create sample data based on current positions
    const sortedPositions = [...positions].sort((a, b) => a.id - b.id);

    sortedPositions.forEach((position, index) => {
      cumulative += position.profit_loss || 0;
      data.push({
        date: `Day ${index + 1}`,
        pnl: position.profit_loss || 0,
        cumulative: cumulative
      });
    });

    return data;
  }, [positions]);

  // Calculate totals
  const totalProfit = positions.reduce((sum, p) => sum + (p.profit_loss > 0 ? p.profit_loss : 0), 0);
  const totalLoss = positions.reduce((sum, p) => sum + (p.profit_loss < 0 ? Math.abs(p.profit_loss) : 0), 0);
  const netPnL = totalProfit - totalLoss;
  const winRate = positions.length > 0 
    ? (positions.filter(p => p.profit_loss > 0).length / positions.length) * 100 
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-1">Performance Overview</h3>
            <p className="text-xs md:text-sm text-slate-600 font-medium">Track your profit & loss over time</p>
          </div>

          {/* Time Filter Buttons */}
          <div className="flex gap-2">
            {[
              { value: '7d' as TimeFilter, label: '7D' },
              { value: '30d' as TimeFilter, label: '30D' },
              { value: 'all' as TimeFilter, label: 'All' }
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => setTimeFilter(filter.value)}
                className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${
                  timeFilter === filter.value
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-3 md:p-4 border border-emerald-200">
            <p className="text-[10px] md:text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Total Profit</p>
            <p className="text-lg md:text-2xl font-black text-emerald-600">+{totalProfit.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-xl p-3 md:p-4 border border-rose-200">
            <p className="text-[10px] md:text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">Total Loss</p>
            <p className="text-lg md:text-2xl font-black text-rose-600">-{totalLoss.toFixed(2)}</p>
          </div>
          <div className={`rounded-xl p-3 md:p-4 border-2 ${
            netPnL >= 0 
              ? 'bg-gradient-to-br from-violet-50 to-violet-100/50 border-violet-300' 
              : 'bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-300'
          }`}>
            <p className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Net P&L</p>
            <p className={`text-lg md:text-2xl font-black ${netPnL >= 0 ? 'text-violet-600' : 'text-slate-600'}`}>
              {netPnL >= 0 ? '+' : ''}{netPnL.toFixed(2)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-3 md:p-4 border border-purple-200">
            <p className="text-[10px] md:text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">Win Rate</p>
            <p className="text-lg md:text-2xl font-black text-purple-600">{winRate.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 md:p-6">
        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <svg className="w-12 md:w-16 h-12 md:h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="font-bold text-sm md:text-base">No performance data yet</p>
              <p className="text-xs md:text-sm mt-1">Start expressing opinions to see your chart</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8"
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                stroke="#94a3b8"
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tickFormatter={(value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(0)}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                labelStyle={{ color: '#0f172a', fontWeight: 600, fontSize: '12px' }}
                formatter={(value: number | undefined) => [
                  `${(value || 0) >= 0 ? '+' : ''}${(value || 0).toFixed(2)} credits`,
                  'Cumulative P&L'
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="cumulative" 
                stroke="#7c3aed" 
                strokeWidth={3}
                fill="url(#colorPnl)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
