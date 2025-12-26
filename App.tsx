import React, { useState, useEffect, useCallback } from 'react';
import { Search, BarChart3, Layout, Github, Star, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Stock, SortOption } from './types';
import StockRow from './components/StockRow';
import AnalysisPanel from './components/AnalysisPanel';
import { fetchStockQuotes, checkApiKey } from './services/finnhubService';

const App: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.PRICE_DESC);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Watchlist State
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['AAPL', 'NVDA']));
  const [viewMode, setViewMode] = useState<'market' | 'watchlist'>('market');

  const loadData = useCallback(async (isAutoRefresh = false) => {
    if (!isAutoRefresh) setIsLoading(true);
    setError(null);
    try {
      const data = await fetchStockQuotes();
      if (data.length === 0 && checkApiKey()) {
        setError("API Limit Reached or Network Error.");
      } else {
        setStocks(data);
        setLastUpdated(new Date());
        
        // Update selected stock if it exists in the new data
        if (selectedStock) {
          const updated = data.find(s => s.symbol === selectedStock.symbol);
          if (updated) setSelectedStock(updated);
        }
      }
    } catch (err: any) {
      if (err.message === "MISSING_API_KEY") {
        setError("MISSING_API_KEY");
      } else {
        setError("Failed to load market data.");
      }
    } finally {
      if (!isAutoRefresh) setIsLoading(false);
    }
  }, [selectedStock]);

  // Initial Load
  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh every 60 seconds (conservative to respect free API limits)
  useEffect(() => {
    if (error) return; // Don't poll if there's an error
    
    const interval = setInterval(() => {
      loadData(true);
    }, 60000);

    return () => clearInterval(interval);
  }, [loadData, error]);

  const toggleFavorite = useCallback((e: React.MouseEvent, symbol: string) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(symbol)) {
        newFavorites.delete(symbol);
      } else {
        newFavorites.add(symbol);
      }
      return newFavorites;
    });
  }, []);

  // Filter & Sort
  const filteredStocks = stocks
    .filter(s => {
      const matchesSearch = s.symbol.toLowerCase().includes(search.toLowerCase()) || 
                            s.name.toLowerCase().includes(search.toLowerCase());
      const matchesView = viewMode === 'market' || favorites.has(s.symbol);
      return matchesSearch && matchesView;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case SortOption.PRICE_ASC: return a.price - b.price;
        case SortOption.PRICE_DESC: return b.price - a.price;
        case SortOption.CHANGE_ASC: return a.changePercent - b.changePercent;
        case SortOption.CHANGE_DESC: return b.changePercent - a.changePercent;
        case SortOption.SYMBOL: return a.symbol.localeCompare(b.symbol);
        default: return 0;
      }
    });

  const handleStockSelect = useCallback((stock: Stock) => {
    setSelectedStock(stock);
    if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      {/* Sidebar / Stock List */}
      <div className={`
        flex flex-col border-r border-gray-800 bg-gray-900/50 backdrop-blur-sm
        transition-all duration-300 ease-in-out absolute md:relative z-20 h-full
        ${selectedStock && window.innerWidth < 768 ? (isSidebarOpen ? 'w-full' : 'hidden') : 'w-full md:w-2/5 lg:w-1/3'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-800 bg-gray-900">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary-600 rounded-lg">
                <BarChart3 size={20} className="text-white" />
              </div>
              <h1 className="text-lg font-bold tracking-tight">NovaTrade</h1>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdated && !isLoading && (
                 <span className="text-[10px] text-gray-500 font-mono">
                   {lastUpdated.toLocaleTimeString()}
                 </span>
              )}
              <button 
                onClick={() => loadData(false)}
                className="text-gray-500 hover:text-primary-400 transition-colors"
                title="Refresh Data"
              >
                <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search symbol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
            />
          </div>

          <div className="flex gap-2 mb-3">
             <button
              onClick={() => setViewMode('market')}
              className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${
                viewMode === 'market' 
                ? 'bg-gray-700 text-white' 
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
              }`}
             >
               All Market
             </button>
             <button
              onClick={() => setViewMode('watchlist')}
              className={`flex-1 flex items-center justify-center gap-1 text-xs font-medium py-1.5 rounded-md transition-colors ${
                viewMode === 'watchlist' 
                ? 'bg-gray-700 text-white' 
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
              }`}
             >
               <Star size={12} fill={viewMode === 'watchlist' ? "currentColor" : "none"} />
               Watchlist
             </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { label: 'Price', value: SortOption.PRICE_DESC },
              { label: '% Change', value: SortOption.CHANGE_DESC },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortOption(opt.value)}
                className={`text-xs px-2 py-1 rounded-md whitespace-nowrap border transition-colors ${
                  sortOption === opt.value 
                    ? 'bg-gray-800 border-primary-500 text-primary-400' 
                    : 'border-gray-700 text-gray-500 hover:border-gray-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-900/50 sticky top-0 backdrop-blur-sm z-10 border-b border-gray-800">
            {/* Matches StockRow.tsx grid layout */}
            <div className="col-span-4 sm:col-span-3">Symbol</div>
            <div className="col-span-3 sm:col-span-4">Price</div>
            <div className="col-span-4 sm:col-span-4">Change</div>
            <div className="col-span-1 sm:col-span-1"></div>
          </div>

          {/* Body */}
          {isLoading && stocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-3">
              <Loader2 size={32} className="animate-spin text-primary-500" />
              <p className="text-gray-500 text-sm">Fetching real-time data...</p>
            </div>
          ) : error === "MISSING_API_KEY" ? (
             <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
              <div className="p-3 bg-yellow-500/10 rounded-full">
                <AlertCircle size={32} className="text-yellow-500" />
              </div>
              <h3 className="text-lg font-bold text-white">Missing API Key</h3>
              <p className="text-gray-400 text-sm">
                This app requires a <strong>Finnhub API Key</strong> to fetch real market data.
              </p>
              <div className="p-3 bg-gray-800 rounded-lg text-xs font-mono text-gray-300 w-full break-all">
                FINNHUB_API_KEY=your_key_here
              </div>
            </div>
          ) : error ? (
             <div className="flex flex-col items-center justify-center h-64 space-y-3 px-6 text-center">
              <AlertCircle size={32} className="text-rose-500" />
              <p className="text-gray-400 text-sm">{error}</p>
              <button 
                onClick={() => loadData(false)}
                className="text-primary-400 text-xs hover:underline"
              >
                Try refreshing
              </button>
            </div>
          ) : filteredStocks.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              {viewMode === 'watchlist' 
                ? "Your watchlist is empty." 
                : `No stocks found matching "${search}"`}
            </div>
          ) : (
            filteredStocks.map(stock => (
              <StockRow 
                key={stock.symbol} 
                stock={stock} 
                onSelect={handleStockSelect}
                isSelected={selectedStock?.symbol === stock.symbol}
                isFavorite={favorites.has(stock.symbol)}
                onToggleFavorite={toggleFavorite}
              />
            ))
          )}
        </div>
      </div>

      {/* Main Content (Chart & Analysis) */}
      <div className={`flex-1 bg-black relative flex flex-col ${!selectedStock && window.innerWidth < 768 ? 'hidden' : 'block'}`}>
        {selectedStock ? (
          <>
            <div className="md:hidden absolute top-4 left-4 z-20">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 bg-gray-800 rounded-lg text-gray-300 shadow-lg border border-gray-700"
              >
                <Layout size={20} />
              </button>
            </div>
            <AnalysisPanel stock={selectedStock} />
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8 space-y-4">
            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-800">
              <BarChart3 size={32} className="text-gray-600" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-300 mb-2">Select a Stock</h2>
              <p className="max-w-xs mx-auto text-sm">
                Choose a stock from the list to view real-time charts and market analysis.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;