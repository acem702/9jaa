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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Head>
        <title>{question.title} - Political Sentiment</title>
        <meta name="description" content={question.description} />
      </Head>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Header */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-6 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      question.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' :
                      question.status === 'locked' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                      'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {question.status.toUpperCase()}
                    </span>
                    {question.resolution !== null && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        question.resolution ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-red-100 text-red-700 border-red-200'
                      }`}>
                        {question.resolution ? 'YES WON' : 'NO WON'}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                    {question.title}
                  </h1>
                </div>
              </div>

              {/* Current Prices */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-green-50 rounded-xl p-4 border-2 border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-green-700">YES</span>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <p className="text-3xl font-black text-green-600">{yesPrice}¢</p>
                  {stats && typeof stats.price_change_24h === 'number' && (
                    <p className={`text-xs font-medium mt-1 ${stats.price_change_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.price_change_24h >= 0 ? '+' : ''}{stats.price_change_24h.toFixed(1)}% (24h)
                    </p>
                  )}
                </div>

                <div className="bg-red-50 rounded-xl p-4 border-2 border-red-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-red-700">NO</span>
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  </div>
                  <p className="text-3xl font-black text-red-600">{noPrice}¢</p>
                  {stats && typeof stats.price_change_24h === 'number' && (
                    <p className={`text-xs font-medium mt-1 ${stats.price_change_24h >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {stats.price_change_24h >= 0 ? '-' : '+'}{Math.abs(stats.price_change_24h).toFixed(1)}% (24h)
                    </p>
                  )}
                </div>
              </div>

              {/* Price Bar */}
              <div className="mt-4 w-full bg-gray-100 rounded-full h-3 overflow-hidden flex">
                <div className="bg-green-500 transition-all" style={{ width: `${yesPrice}%` }} />
                <div className="bg-red-500 transition-all" style={{ width: `${noPrice}%` }} />
              </div>
            </div>

            {/* Price Chart */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Price History</h3>
              <div className="h-[400px]">
                <PriceChart questionId={id as string} />
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About This Market</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {question.description}
              </p>
            </div>

            {/* Market Stats */}
            {stats && (
              <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Market Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Volume" value={stats.total_volume.toLocaleString()} suffix="credits" />
                  <StatCard label="Trades" value={stats.total_trades.toString()} />
                  <StatCard label="Traders" value={stats.unique_traders.toString()} />
                  <StatCard label="Liquidity" value={Math.round(stats.liquidity.total).toLocaleString()} suffix="credits" />
                </div>
              </div>
            )}

            {/* Recent Trades */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentTrades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          trade.type === 'buy' ? 'bg-green-100 text-green-700' :
                          trade.type === 'sell' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {trade.type.toUpperCase()}
                        </span>
                        <span className={`font-bold ${trade.position === 'YES' ? 'text-green-600' : 'text-red-600'}`}>
                          {trade.position}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {trade.shares.toFixed(2)} shares @ {trade.price.toFixed(3)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{trade.credits.toFixed(2)} credits</p>
                      <p className="text-xs text-gray-500">{new Date(trade.timestamp * 1000).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-900">
        {value} {suffix && <span className="text-sm text-gray-600">{suffix}</span>}
      </p>
    </div>
  );
}