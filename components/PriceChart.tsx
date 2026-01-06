import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { api } from '@/lib/api';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface PriceChartProps {
  questionId: string;
}

export default function PriceChart({ questionId }: PriceChartProps) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    fetchPriceHistory();
  }, [questionId]);

  const fetchPriceHistory = async () => {
    try {
      const history = await api.getPriceHistory(questionId);
      
      const dates = history.data.map(d => new Date(d.date));
      const yesPrices = history.data.map(d => d.yes_price * 100);
      const noPrices = history.data.map(d => d.no_price * 100);

      setChartData({
        dates,
        yesPrices,
        noPrices,
      });
    } catch (error) {
      console.error('Failed to fetch price history:', error);
    }
  };

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Plot
      data={[
        {
          x: chartData.dates,
          y: chartData.yesPrices,
          type: 'scatter',
          mode: 'lines',
          name: 'YES',
          line: { color: '#22c55e', width: 3 },
          fill: 'tozeroy',
          fillcolor: 'rgba(34, 197, 94, 0.1)',
        },
        {
          x: chartData.dates,
          y: chartData.noPrices,
          type: 'scatter',
          mode: 'lines',
          name: 'NO',
          line: { color: '#ef4444', width: 3 },
          fill: 'tozeroy',
          fillcolor: 'rgba(239, 68, 68, 0.1)',
        },
      ]}
      layout={{
        autosize: true,
        margin: { l: 50, r: 20, t: 20, b: 50 },
        xaxis: { gridcolor: '#1e293b' },
        yaxis: { 
          gridcolor: '#1e293b',
          range: [0, 100],
          ticksuffix: '%',
        },
        legend: { orientation: 'h', y: -0.15 },
        hovermode: 'x unified',
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: '100%', height: '100%' }}
    />
  );
}