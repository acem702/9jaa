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
    <div className="min-h-screen bg-background">
      <Head>
        <title>Activity - 9ja Markets</title>
      </Head>

      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 pb-32">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-1">Activity</h1>
          <p className="text-muted-foreground font-medium">Your recent market transactions</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {positions.length === 0 ? (
              <div className="p-20 text-center text-muted-foreground font-medium">No activity found</div>
            ) : (
              <div className="divide-y divide-border">
                {positions.map((position) => (
                  <ActivityRow key={position.id} position={position} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function ActivityRow({ position }: { position: Position }) {
  return (
    <div className="p-4 hover:bg-secondary/50 transition-colors group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
            position.position === 'YES' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' : 'bg-rose-500/10 text-rose-700 border-rose-500/20'
          }`}>
            {position.position}
          </span>
          <p className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {position.question.title}
          </p>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {new Date().toLocaleDateString()}
        </span>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm font-medium text-foreground">
            {Number(position.shares).toFixed(2)} Shares
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            P&L: {Number(position.profit_loss).toFixed(2)} CR
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-foreground">{Number(position.current_value).toFixed(2)} CR</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Current Value</p>
        </div>
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
