"use client";

import { useEffect, useState, useRef } from "react";
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
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [shareClicked, setShareClicked] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <Link href="/" className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold hover:from-violet-700 hover:to-purple-700 transition-colors">
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

  // Share handler - just copy link
  const handleShare = async () => {
    setShareClicked(true);
    setTimeout(() => setShareClicked(false), 150);
    setShowShareMenu(!showShareMenu);
  };

  const getShareUrl = () => {
    return typeof window !== 'undefined' ? window.location.href : `https://9jamarkets.com/market/${id}`;
  };

  const shareToTwitter = () => {
    const url = getShareUrl();
    const text = `Check out this prediction: "${question?.title}" - Currently at ${yesPrice}% YES`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    setShowShareMenu(false);
  };

  const shareToFacebook = () => {
    const url = getShareUrl();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    setShowShareMenu(false);
  };

  const shareToWhatsApp = () => {
    const url = getShareUrl();
    const text = `Check out this prediction: "${question?.title}" - ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    setShowShareMenu(false);
  };

  const shareToTelegram = () => {
    const url = getShareUrl();
    const text = `Check out this prediction: "${question?.title}"`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    setShowShareMenu(false);
  };

  const copyToClipboard = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setShowShareMenu(false);
      // Could add a toast notification here
    } catch (error) {
      console.error('Copy failed:', error);
    }
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
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-600 transition-colors font-semibold text-sm group">
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
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6 md:p-8">
                {/* Status & Tags Row with Share Button */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex flex-wrap items-center gap-2">
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
                  
                  {/* Social Share Button */}
                  <div className="relative" ref={shareMenuRef}>
                    <button
                      onClick={handleShare}
                      className={`p-2.5 rounded-xl border backdrop-blur-sm transition-all duration-200 ${
                        showShareMenu
                          ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/25'
                          : 'bg-transparent border-slate-200/80 text-slate-500 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50/50'
                      } ${shareClicked ? 'scale-90' : 'scale-100'}`}
                      aria-label="Share"
                    >
                      <svg className={`w-5 h-5 transition-transform duration-300 ${showShareMenu ? 'rotate-12' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>

                    {/* Share Dropdown Menu */}
                    {showShareMenu && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-1">
                          <button
                            onClick={shareToTwitter}
                            className="w-full px-3 py-2.5 text-left text-sm font-medium flex items-center gap-3 text-slate-700 hover:bg-violet-50 hover:text-violet-700 rounded-lg transition-all duration-150 active:scale-95"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            Share on X
                          </button>
                          <button
                            onClick={shareToFacebook}
                            className="w-full px-3 py-2.5 text-left text-sm font-medium flex items-center gap-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-150 active:scale-95"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Share on Facebook
                          </button>
                          <button
                            onClick={shareToWhatsApp}
                            className="w-full px-3 py-2.5 text-left text-sm font-medium flex items-center gap-3 text-slate-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-all duration-150 active:scale-95"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Share on WhatsApp
                          </button>
                          <button
                            onClick={shareToTelegram}
                            className="w-full px-3 py-2.5 text-left text-sm font-medium flex items-center gap-3 text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-lg transition-all duration-150 active:scale-95"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                            </svg>
                            Share on Telegram
                          </button>
                          <div className="h-px bg-slate-200/70 my-1" />
                          <button
                            onClick={copyToClipboard}
                            className="w-full px-3 py-2.5 text-left text-sm font-medium flex items-center gap-3 text-slate-700 hover:bg-slate-50 rounded-lg transition-all duration-150 active:scale-95"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy Link
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Market Question - Large Headline */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 leading-tight mb-4 tracking-tight">
                  {question.title}
                </h1>

                {/* Short Description */}
                <p className="text-slate-600 text-base leading-relaxed mb-6 font-medium">
                  {question.description}
                </p>

                {/* Sentiment Summary - Big Number */}
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100/80 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-600 mb-1">Current Sentiment</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-extrabold text-violet-600">{yesPrice}%</span>
                        <span className="text-xl font-bold text-slate-500">YES</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold text-slate-300">{noPrice}%</div>
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
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-4 md:p-6">
                <h2 className="text-xl font-bold text-slate-950 mb-1">Sentiment Over Time</h2>
                <p className="text-sm text-slate-500 font-medium mb-4 md:mb-6">How public belief has evolved</p>
                <div className="h-[350px] md:h-[400px] -mx-2 md:mx-0">
                  <PriceChart questionId={id as string} />
                </div>
              </div>
            </div>

            {/* Market Details */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-bold text-slate-950 mb-4">Market Details</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed font-medium">
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
            <div className="sticky top-24 space-y-4">
              {/* Trade Panel */}
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
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-violet-200 transition-all duration-200 active:scale-[0.98]">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-slate-400">{icon}</div>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label}</p>
      </div>
      <p className="text-2xl font-bold text-slate-950 mb-0.5">{value}</p>
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
