import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../types';

interface StockChartProps {
  data: ChartDataPoint[];
  color: string;
}

const StockChart: React.FC<StockChartProps> = ({ data, color }) => {
  const isPositive = color === '#10b981'; // green-500
  
  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#9ca3af" 
            tick={{fontSize: 12}} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            stroke="#9ca3af" 
            tick={{fontSize: 12}}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
            width={60}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            itemStyle={{ color: '#e5e7eb' }}
            labelStyle={{ color: '#9ca3af' }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            fillOpacity={1} 
            fill="url(#colorValue)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;