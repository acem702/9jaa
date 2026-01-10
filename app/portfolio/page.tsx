"use client";

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { api } from '@/lib/api';
import { Position, PortfolioSummary } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import MobileBottomNav from '@/components/ui/MobileBottomNav';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PortfolioCard from '@/components/portfolio/PortfolioCard';
import ProfitLossChart from '@/components/portfolio/ProfitLossChart';
import PositionsList from '@/components/portfolio/PositionsList';

function PortfolioPage() {
  const { user } = useAuth();
  const [portfolioData, setPortfolioData] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      const data = await api.getPortfolioSummary();
      setPortfolioData(data);
    } catch (error) {
      console.error('Failed to fetch portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use portfolio metrics from backend
  const totalInvested = portfolioData?.portfolio.total_invested || 0;
  const totalValue = portfolioData?.portfolio.total_value || 0;
  const totalPnL = portfolioData?.portfolio.total_pnl || 0;
  const totalPnLPercent = portfolioData?.portfolio.total_pnl_percent || 0;
  const positions = portfolioData?.positions || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Head>
        <title>Portfolio - 9ja Markets</title>
        <meta name="description" content="Track your prediction performance, view your positions, and monitor your profit & loss across all markets." />
        <meta name="keywords" content="portfolio, trading performance, profit loss, positions, 9ja markets" />
      </Head>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
          <div className="flex justify-center items-center h-96">
            <LoadingSpinner size="lg" />
          </div>
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Head>
        <title>Portfolio - 9ja Markets</title>
        <meta name="description" content="Track your prediction performance, view positions, and analyze your profit & loss over time." />
      </Head>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-32">
        {/* Page Title */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-violet-100 rounded-xl">
              <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight">Portfolio</h1>
              <p className="text-sm text-slate-500 font-medium">Track your prediction performance and manage your positions</p>
            </div>
          </div>
        </div>

        {/* Portfolio Overview Card */}
        <div className="mb-6 md:mb-8">
          <PortfolioCard
            user={user}
            totalInvested={totalInvested}
            totalValue={totalValue}
            totalPnL={totalPnL}
            totalPnLPercent={totalPnLPercent}
            positionsCount={positions.length}
          />
        </div>

        {/* Profit/Loss Chart */}
        <div className="mb-6 md:mb-8">
          <ProfitLossChart positions={positions} />
        </div>

        {/* Positions List with Tabs */}
        <PositionsList positions={positions} />
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default function Portfolio() {
  return (
    <ProtectedRoute>
      <PortfolioPage />
    </ProtectedRoute>
  );
}
