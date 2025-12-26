import React, { useState, useEffect } from 'react';
import { Stock, ChartDataPoint } from '../types';
import StockChart from './StockChart';
import { fetchStockHistory } from '../services/finnhubService';
import { Loader2 } from 'lucide-react';

interface AnalysisPanelProps {
  stock: Stock;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ stock }) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(false);

  useEffect(() => {
    const loadChart = async () => {
      setChartLoading(true);
      try {
        const history = await fetchStockHistory(stock.symbol);
        setChartData(history);
      } catch (e) {
        console.error("Failed to load chart", e);
      } finally {
        setChartLoading(false);
      }
    };

    loadChart();
  }, [stock.symbol]);

  const isPositive = stock.change >= 0;
  const chartColor = isPositive ? '#10b981' : '#f43f5e';

  return (
    <div className="h-full flex flex-col bg-gray-900 border-l border-gray-800 animate-fade-in overflow-y-auto">
      <div className="p-6 border-b border-gray-800 sticky top-0 bg-gray-900/95 backdrop-blur z-10">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{stock.name}</h2>
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-mono text-white">${stock.price.toFixed(2)}</span>
              <span className={`text-lg font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent}%)
              </span>
            </div>
          </div>
          {stock.marketCap && (
            <div className="text-right hidden md:block">
              <p className="text-sm text-gray-500">Market Cap</p>
              <p className="text-white font-medium">{stock.marketCap}</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 relative min-h-[400px]">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Price Trends</h3>
        {chartLoading ? (
           <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10">
             <Loader2 className="animate-spin text-primary-500" />
           </div>
        ) : chartData.length > 0 ? (
          <StockChart data={chartData} color={chartColor} />
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500 text-sm border border-dashed border-gray-700 rounded-lg">
            Chart data unavailable
          </div>
        )}
      </div>

      <div className="p-6 flex-1 bg-gray-800/30">
        <div className="text-center py-12 px-4 border-2 border-dashed border-gray-800 rounded-xl">
          <p className="text-gray-500 text-sm">
            Real-time data provided by Finnhub.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;