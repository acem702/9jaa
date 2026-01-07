"use client";

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Trade } from '@/types';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';

function ActivityPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const response = await api.getUserActivity();
      setTrades(response.trades || []);
    } catch (error) {
      console.error('Failed to fetch activity:', error);
      setTrades([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <Head>
        <title>Activity - 9ja Markets</title>
      </Head>

      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-32">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Activity</h1>
          <p className="text-slate-500 font-bold text-sm">Your recent market transactions</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
            {trades.length === 0 ? (
              <div className="p-20 text-center text-slate-400 font-bold">No activity found</div>
            ) : (
              trades.map((trade) => (
                <div key={trade.id} className="p-5 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        trade.type === 'buy' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        {trade.type}
                      </span>
                      <span className={`text-xs font-black ${trade.position === 'YES' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {trade.position}
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {new Date(trade.timestamp * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm font-black text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {trade.shares.toFixed(2)} Shares
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                        Price: {trade.price.toFixed(2)}¢
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">{trade.credits.toFixed(2)} CR</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">TOTAL COST</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function Activity() {
  return (
    <ProtectedRoute>
      <ActivityPage />
    </ProtectedRoute>
  );
}
