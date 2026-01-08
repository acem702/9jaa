'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface PriceChartProps {
  questionId: string;
}

interface ChartDataPoint {
  date: string;
  timestamp: number;
  yesPrice: number;
  displayDate: string;
}

export default function PriceChart({ questionId }: PriceChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPriceHistory();
  }, [questionId]);

  const fetchPriceHistory = async () => {
    try {
      setLoading(true);
      const history = await api.getPriceHistory(questionId);
      
      const formattedData = history.data.map(d => ({
        date: d.date,
        timestamp: new Date(d.date).getTime(),
        yesPrice: d.yes_price * 100,
        displayDate: new Date(d.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
      }));

      setChartData(formattedData);
    } catch (error) {
      console.error('Failed to fetch price history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <p className="text-sm font-medium">No price history available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e2e8f0" 
            vertical={false}
          />
          <XAxis 
            dataKey="displayDate"
            stroke="#94a3b8"
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis 
            stroke="#94a3b8"
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
            tickFormatter={(value: number) => `${value}%`}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '8px 12px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            labelStyle={{ color: '#0f172a', fontWeight: 600, fontSize: '12px' }}
            itemStyle={{ color: '#2563eb', fontSize: '12px' }}
            formatter={(value: any) => [`${value.toFixed(1)}%`, 'YES']}
          />
          <Line 
            type="monotone" 
            dataKey="yesPrice" 
            stroke="#2563eb" 
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: '#2563eb' }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Caption */}
      <div className="mt-4 text-center">
        <p className="text-xs text-slate-500 font-medium">
          This chart shows how public belief has changed over time.
        </p>
      </div>
    </div>
  );
}