// app/activity/page.tsx
"use client";

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { api } from '@/lib/api';

interface Transaction {
  id: number;
  type: 'buy' | 'sell' | 'resolution';
  position: string;
  shares: number;
  credits_amount: number;
  price_per_share: number;
  created_at: string;
  question: {
    id: number;
    title: string;
    status: string;
  };
}

function ActivityPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell'>('all');

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      // Get user's positions which includes transaction history
      const { positions } = await api.getPositions();
      // Transform positions into transaction format for display
      // In real implementation, you'd have a separate transactions endpoint
      setTransactions([]);
    } catch (error) {
      console.error('Failed to fetch activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Activity - Political Sentiment</title>
      </Head>

      <Navbar />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        {/* Header */}
        <div className="mb-3 sm:mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Activity</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Your trading history</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-3 sm:mb-4 overflow-x-auto hide-scrollbar">
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
            All
          </FilterButton>
          <FilterButton active={filter === 'buy'} onClick={() => setFilter('buy')}>
            Buys
          </FilterButton>
          <FilterButton active={filter === 'sell'} onClick={() => setFilter('sell')}>
            Sells
          </FilterButton>
        </div>

        {/* Activity List */}
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-gray-500 mb-4">No activity yet</p>
            <Link href="/">
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                Browse Markets
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTransactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
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

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-white text-gray-600 border border-gray-200'
      }`}
    >
      {children}
    </button>
  );
}

function TransactionCard({ transaction }: { transaction: Transaction }) {
  const getIcon = () => {
    if (transaction.type === 'buy') {
      return (
        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      </div>
    );
  };

  return (
    <Link href={`/market/${transaction.question.id}`}>
      <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all p-3 sm:p-4 cursor-pointer">
        <div className="flex gap-3">
          {getIcon()}
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
              {transaction.question.title}
            </p>
            
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                transaction.type === 'buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {transaction.type.toUpperCase()}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                transaction.position === 'YES' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
              }`}>
                {transaction.position}
              </span>
              <span className="text-[10px] text-gray-500">
                {new Date(transaction.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="text-gray-500">Shares:</span>
                <span className="font-semibold text-gray-900 ml-1">
                  {transaction.shares.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Cost:</span>
                <span className="font-semibold text-gray-900 ml-1">
                  {transaction.credits_amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}