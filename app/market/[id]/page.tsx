"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { api } from "@/lib/api";
import { Question, Trade, MarketStats } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import TradePanel from "@/components/TradePanel";
import Head from "next/head";
import Link from "next/link";

const PriceChart = dynamic(() => import("@/components/PriceChart"), {
  ssr: false,
});

export default function MarketDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [question, setQuestion] = useState<Question | null>(null);
  const [stats, setStats] = useState<MarketStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMarketData();
    }
  }, [id]);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const [questionData, statsData] = await Promise.all([
        api.getQuestion(id as string),
        api.getMarketStats(id as string),
      ]);
      
      setQuestion(questionData);
      setStats(statsData.stats);
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f5f9]">
        <Navbar />
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-[#f1f5f9]">
        <Navbar />
        <div className="flex justify-center items-center h-[60vh]">
          <p className="text-slate-500 font-bold">Market not found</p>
        </div>
      </div>
    );
  }

  const yesPrice = Math.round(question.market.yes_price * 100);
  const noPrice = Math.round(question.market.no_price * 100);

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <Head>
        <title>{question.title} - 9ja Markets</title>
      </Head>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6 pb-32">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition-colors font-bold text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/></svg>
          Back to Markets
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Header */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                  question.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}>
                  {question.status}
                </span>
                {question.resolution !== null && (
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                    question.resolution ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                  }`}>
                    {question.resolution ? 'YES WON' : 'NO WON'}
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-8">
                {question.title}
              </h1>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">YES</span>
                  <p className="text-4xl font-black text-emerald-600">{yesPrice}¢</p>
                </div>
                <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest mb-1">NO</span>
                  <p className="text-4xl font-black text-rose-600">{noPrice}¢</p>
                </div>
              </div>
            </div>

            {/* Price Chart */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-hidden">
              <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tight">Price History</h3>
              <div className="h-[350px]">
                <PriceChart questionId={id as string} />
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-tight">About</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {question.description}
              </p>
            </div>

            {/* Stats Grid */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-center">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Volume</p>
                  <p className="text-lg font-black text-slate-900">{stats.total_volume.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-center">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Trades</p>
                  <p className="text-lg font-black text-slate-900">{stats.total_trades}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-center">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Holders</p>
                  <p className="text-lg font-black text-slate-900">{stats.unique_traders}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-center">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Liquidity</p>
                  <p className="text-lg font-black text-slate-900">{Math.round(stats.liquidity.total).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TradePanel question={question} onTradeComplete={fetchMarketData} />
            </div>
          </div>
        </div>
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
        <Link href="/activity" className="flex flex-col items-center gap-1.5 text-slate-400 transition-all active:scale-95">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Activity</span>
        </Link>
      </div>
    </div>
  );
}
