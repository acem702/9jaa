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

const PriceChart = dynamic(() => import("@/components/PriceChart"), {
  ssr: false,
});

export default function MarketDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [question, setQuestion] = useState<Question | null>(null);
  const [stats, setStats] = useState<MarketStats | null>(null);
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMarketData();
    }
  }, [id]);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const [questionData, statsData, tradesData] = await Promise.all([
        api.getQuestion(id as string),
        api.getMarketStats(id as string),
        api.getRecentTrades(id as string, 10),
      ]);
      
      setQuestion(questionData);
      setStats(statsData.stats);
      setRecentTrades(tradesData.trades);
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
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-[#f1f5f9]">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl text-gray-500">Market not found</p>
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
        <meta name="description" content={question.description} />
      </Head>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Header */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      question.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' :
                      question.status === 'locked' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                      'bg-slate-50 text-slate-700 border-slate-200'
                    }`}>
                      {question.status.toUpperCase()}
                    </span>
                    {question.resolution !== null && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        question.resolution ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        {question.resolution ? 'YES WON' : 'NO WON'}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                    {question.title}
                  </h1>
                </div>
              </div>

              {/* Current Prices */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-black text-emerald-700">YES</span>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <p className="text-3xl font-black text-emerald-600">{yesPrice}¢</p>
                </div>

                <div className="bg-rose-50 rounded-xl p-5 border border-rose-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-black text-rose-700">NO</span>
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  </div>
                  <p className="text-3xl font-black text-rose-600">{noPrice}¢</p>
                </div>
              </div>

              {/* Price Bar */}
              <div className="mt-6 w-full bg-slate-100 rounded-full h-4 overflow-hidden flex shadow-inner">
                <div className="bg-emerald-500 transition-all duration-1000" style={{ width: `${yesPrice}%` }} />
                <div className="bg-rose-500 transition-all duration-1000" style={{ width: `${noPrice}%` }} />
              </div>
            </div>

            {/* Price Chart */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
              <h3 className="text-xl font-black text-slate-900 mb-6">Price History</h3>
              <div className="h-[400px]">
                <PriceChart questionId={id as string} />
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-xl font-black text-slate-900 mb-4">About This Market</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm">
                {question.description}
              </p>
            </div>

            {/* Market Stats */}
            {stats && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-xl font-black text-slate-900 mb-4">Market Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Volume" value={stats.total_volume.toLocaleString()} suffix="CR" />
                  <StatCard label="Trades" value={stats.total_trades.toString()} />
                  <StatCard label="Traders" value={stats.unique_traders.toString()} />
                  <StatCard label="Liquidity" value={Math.round(stats.liquidity.total).toLocaleString()} suffix="CR" />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Trade Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TradePanel question={question} onTradeComplete={fetchMarketData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{label}</p>
      <p className="text-lg font-black text-slate-900">
        {value}{suffix && <span className="text-xs text-slate-400 ml-1 font-bold">{suffix}</span>}
      </p>
    </div>
  );
}
