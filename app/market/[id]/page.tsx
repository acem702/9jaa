"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { api } from "@/lib/api";
import { Question, MarketStats, Sentiment } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import TradePanel from "@/components/TradePanel";
import MobileBottomNav from "@/components/ui/MobileBottomNav";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StatusBadge from "@/components/ui/StatusBadge";

const PriceChart = dynamic(() => import("@/components/PriceChart"), {
  ssr: false,
});

export default function MarketDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [question, setQuestion] = useState<Question | null>(null);
  const [stats, setStats] = useState<MarketStats | null>(null);
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMarketData();
    }
  }, [id]);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const [questionData, statsData, sentimentData] = await Promise.all([
        api.getQuestion(id as string),
        api.getMarketStats(id as string),
        api.getSentiment(id as string),
      ]);
      
      setQuestion(questionData);
      setStats(statsData.stats);
      setSentiment(sentimentData.sentiment);
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10">
        <Navbar />
        <div className="flex justify-center items-center h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
          <p className="text-slate-500 font-bold text-lg">Market not found</p>
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
            Back to Markets
          </Link>
        </div>
      </div>
    );
  }

  const yesPrice = Math.round(question.market.yes_price * 100);
  const noPrice = Math.round(question.market.no_price * 100);
  const totalHolders = sentiment?.total_holders || 0;
  const yesHolders = sentiment?.yes_holders || 0;
  const noHolders = sentiment?.no_holders || 0;

  // JSON-LD Structured Data for the market
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: question.title,
    description: question.description,
    datePublished: question.created_at,
    dateModified: question.resolved_at || question.locked_at || question.created_at,
    author: {
      '@type': 'Person',
      name: question.creator?.name || 'Anonymous',
    },
    publisher: {
      '@type': 'Organization',
      name: '9ja Markets',
      logo: {
        '@type': 'ImageObject',
        url: 'https://9jamarkets.com/icon.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://9jamarkets.com/market/${id}`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: yesPrice,
      ratingCount: totalHolders,
      bestRating: 100,
      worstRating: 0,
    },
  };

  // Breadcrumb structured data
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://9jamarkets.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: question.title,
        item: `https://9jamarkets.com/market/${id}`,
      },
    ],
  };

  // Calculate time remaining if locked/closing soon
  const getStatusMessage = () => {
    if (question.status === 'resolved') return 'This market has been resolved';
    if (question.status === 'locked') return 'Closing soon - Trading locked';
    return 'Open for participation';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <Head>
        <title>{question.title} | Political Prediction Market - 9ja Markets</title>
        <meta name="description" content={`${question.description.substring(0, 155)}...`} />
        <meta property="og:title" content={question.title} />
        <meta property="og:description" content={question.description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={question.title} />
        <meta name="twitter:description" content={question.description} />
      </Head>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6 pb-32">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-semibold text-sm group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Markets
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="p-6 md:p-8">
                {/* Status & Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <StatusBadge status={question.status} variant="status" />
                  {question.resolution !== null && (
                    <StatusBadge 
                      status={question.resolution ? 'YES WON' : 'NO WON'} 
                      variant="resolution" 
                    />
                  )}
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">
                    {getStatusMessage()}
                  </span>
                </div>
                
                {/* Market Question - Large Headline */}
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4">
                  {question.title}
                </h1>

                {/* Short Description */}
                <p className="text-slate-600 text-base leading-relaxed mb-6">
                  {question.description}
                </p>

                {/* Sentiment Summary - Big Number */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-600 mb-1">Current Sentiment</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-blue-600">{yesPrice}%</span>
                        <span className="text-xl font-bold text-slate-500">YES</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-slate-300">{noPrice}%</div>
                      <div className="text-sm font-semibold text-slate-400">NO</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-3">
                    Based on {totalHolders} user{totalHolders !== 1 ? 's' : ''} expressing their opinion ({yesHolders} YES, {noHolders} NO)
                  </p>
                </div>
              </div>
            </div>

            {/* Price Chart Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-black text-slate-900 mb-1">Sentiment Over Time</h2>
                <p className="text-sm text-slate-500 font-medium mb-6">How public belief has evolved</p>
                <div className="h-[400px]">
                  <PriceChart questionId={id as string} />
                </div>
              </div>
            </div>

            {/* Market Details */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
              <h2 className="text-xl font-black text-slate-900 mb-4">Market Details</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed">
                  {question.description}
                </p>
              </div>
              
              {/* Creator Info */}
              {question.creator && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <p className="text-xs text-slate-500 font-medium">
                    Created by <span className="text-slate-700 font-bold">{question.creator.name}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Stats Grid */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard 
                  icon={<VolumeIcon />}
                  label="Total Volume"
                  value={stats.total_volume.toLocaleString()}
                  subtitle="credits traded"
                />
                <StatCard 
                  icon={<TradesIcon />}
                  label="Trades"
                  value={stats.total_trades.toLocaleString()}
                  subtitle="transactions"
                />
                <StatCard 
                  icon={<HoldersIcon />}
                  label="Participants"
                  value={stats.unique_traders.toLocaleString()}
                  subtitle="users"
                />
                <StatCard 
                  icon={<LiquidityIcon />}
                  label="Liquidity"
                  value={Math.round(stats.liquidity.total).toLocaleString()}
                  subtitle="pool depth"
                />
              </div>
            )}
          </div>

          {/* Sidebar - Action Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TradePanel question={question} onTradeComplete={fetchMarketData} />
            </div>
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, subtitle }: { icon: React.ReactNode; label: string; value: string; subtitle: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-slate-400">{icon}</div>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{label}</p>
      </div>
      <p className="text-2xl font-black text-slate-900 mb-0.5">{value}</p>
      <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
    </div>
  );
}

// Icons
function VolumeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function TradesIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  );
}

function HoldersIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function LiquidityIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
