import React, { memo } from 'react';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { Stock } from '../types';

interface StockRowProps {
  stock: Stock;
  onSelect: (stock: Stock) => void;
  isSelected: boolean;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, symbol: string) => void;
}

const StockRow: React.FC<StockRowProps> = ({ 
  stock, 
  onSelect, 
  isSelected, 
  isFavorite, 
  onToggleFavorite 
}) => {
  const isPositive = stock.change >= 0;
  
  return (
    <div 
      onClick={() => onSelect(stock)}
      className={`grid grid-cols-12 gap-4 p-4 border-b border-gray-800 cursor-pointer transition-colors duration-200 hover:bg-gray-800/50 ${isSelected ? 'bg-gray-800/80 border-l-4 border-l-primary-500' : 'border-l-4 border-l-transparent'}`}
    >
      {/* Symbol Column: 4 cols on mobile, 3 on desktop */}
      <div className="col-span-4 sm:col-span-3 flex flex-col justify-center">
        <div className="flex items-center gap-2">
           <button 
            onClick={(e) => onToggleFavorite(e, stock.symbol)}
            className={`transition-colors ${isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600 hover:text-gray-400'}`}
          >
            <Star size={14} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <span className="font-bold text-white text-base">{stock.symbol}</span>
        </div>
        <span className="text-xs text-gray-400 truncate pl-6">{stock.name}</span>
      </div>
      
      {/* Price Column: 3 cols on mobile, 4 on desktop */}
      <div className="col-span-3 sm:col-span-4 flex items-center">
        <span className="text-white font-mono font-medium">${stock.price.toFixed(2)}</span>
      </div>
      
      {/* Change Column: 4 cols on mobile, 4 on desktop */}
      <div className="col-span-4 sm:col-span-4 flex items-center">
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-md ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span className="text-sm font-medium">{stock.changePercent > 0 ? '+' : ''}{stock.changePercent}%</span>
        </div>
      </div>

      {/* Spacer/Selection Indicator: 1 col on mobile, 1 on desktop */}
      <div className="col-span-1 sm:col-span-1 flex items-center justify-end text-gray-500">
        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2"></div>}
      </div>
    </div>
  );
};

// Optimization: Only re-render if specific props change. 
// This is crucial for high-frequency dashboards to prevent UI lag.
export default memo(StockRow, (prev, next) => {
  return (
    prev.stock.price === next.stock.price &&
    prev.stock.change === next.stock.change &&
    prev.isSelected === next.isSelected &&
    prev.isFavorite === next.isFavorite
  );
});