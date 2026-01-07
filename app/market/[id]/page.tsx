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
    <div className="min-h-screen bg-background">
      <Head>
        <title>{question.title} - 9ja Markets</title>
      </Head>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6 pb-32">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors font-bold text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/></svg>
          Back to Markets
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg border border-border shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
                  question.status === 'active' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {question.status}
                </span>
                {question.resolution !== null && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
                    question.resolution ? 'bg-blue-500/10 text-blue-700 border-blue-500/20' : 'bg-rose-500/10 text-rose-700 border-rose-500/20'
                  }`}>
                    {question.resolution ? 'Resolves YES' : 'Resolves NO'}
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-8">
                {question.title}
              </h1>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-500/10 rounded-lg p-6 border border-emerald-500/20 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">YES</span>
                  <p className="text-4xl font-bold text-emerald-600">{yesPrice}¢</p>
                </div>
                <div className="bg-rose-500/10 rounded-lg p-6 border border-rose-500/20 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-rose-700 uppercase tracking-widest mb-1">NO</span>
                  <p className="text-4xl font-bold text-rose-600">{noPrice}¢</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border shadow-sm p-6 overflow-hidden">
              <h3 className="text-base font-bold text-foreground mb-4">Price History</h3>
              <div className="h-[350px]">
                <PriceChart questionId={id as string} />
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border shadow-sm p-6">
              <h3 className="text-base font-bold text-foreground mb-4">About this market</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {question.description}
              </p>
            </div>

            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatItem label="Volume" value={stats.total_volume.toLocaleString()} />
                <StatItem label="Trades" value={stats.total_trades.toLocaleString()} />
                <StatItem label="Traders" value={stats.unique_traders.toLocaleString()} />
                <StatItem label="Liquidity" value={Math.round(stats.liquidity.total).toLocaleString()} />
              </div>
            )}
          </div>

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

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 text-center">
      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}
