"use client";

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Position } from '@/types';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';

function ActivityPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const response = await api.getPositions();
      setPositions(response.positions || []);
    } catch (error) {
      console.error('Failed to fetch activity:', error);
      setPositions([]);
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
            {positions.length === 0 ? (
              <div className="p-20 text-center text-slate-400 font-bold">No positions found</div>
            ) : (
              positions.map((position) => (
                <div key={position.id} className="p-5 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        position.position === 'YES' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        POS
                      </span>
                      <span className={`text-xs font-black ${position.position === 'YES' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {position.position}
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm font-black text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {position.shares.toFixed(2)} Shares
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                        P&L: {position.profit_loss.toFixed(2)} CR
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">{position.current_value.toFixed(2)} CR</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CURRENT VALUE</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 md:hidden flex justify-around py-4 px-4 z-50">
        <Link href="/" className="flex flex-col items-center gap-1.5 transition-all active:scale-95">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Home</span>
        </Link>
        <Link href="/portfolio" className="flex flex-col items-center gap-1.5 text-slate-400 transition-all active:scale-95">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Portfolio</span>
        </Link>
        <Link href="/leaderboard" className="flex flex-col items-center gap-1.5 text-slate-400 transition-all active:scale-95">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Ranks</span>
        </Link>
        <Link href="/activity" className="flex flex-col items-center gap-1.5 text-blue-600 transition-all active:scale-95">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Activity</span>
        </Link>
      </div>
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
