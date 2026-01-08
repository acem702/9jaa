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

  // Determine trend based on first and last data points
  const getTrend = () => {
    if (chartData.length < 2) return 'neutral';
    const first = chartData[0].yesPrice;
    const last = chartData[chartData.length - 1].yesPrice;
    const change = last - first;
    if (Math.abs(change) < 1) return 'neutral';
    return change > 0 ? 'up' : 'down';
  };

  const trend = getTrend();
  const lineColor = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#7c3aed';

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
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e2e8f0" 
            vertical={false}
          />
          <YAxis 
            stroke="#94a3b8"
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
            tickFormatter={(value: number) => `${value}%`}
            domain={[0, 100]}
            width={45}
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
            itemStyle={{ color: lineColor, fontSize: '12px' }}
            formatter={(value: any) => [`${value.toFixed(1)}%`, 'YES']}
          />
          <Line 
            type="monotone" 
            dataKey="yesPrice" 
            stroke={lineColor}
            strokeWidth={1}
            dot={false}
            activeDot={{ r: 6, fill: lineColor }}
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