import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import portfolioService from '../features/portfolio/portfolioService';
import { executeTrade, getPortfolio } from '../features/portfolio/portfolioSlice';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StockMarket = () => {
  const [query, setQuery] = useState('');
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeQuantity, setTradeQuantity] = useState(1);
  const [tradeType, setTradeType] = useState('BUY');

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { portfolio } = useSelector((state) => state.portfolio);

  // Load some initial mock stocks
  useEffect(() => {
    handleSearch('');
    // eslint-disable-next-line
  }, []);

  const handleSearch = async (searchQuery) => {
    setLoading(true);
    try {
      const data = await portfolioService.searchStocks(searchQuery, user.token);
      setStocks(data);
    } catch (error) {
      toast.error('Failed to fetch stocks');
    }
    setLoading(false);
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const handleTrade = async (e) => {
    e.preventDefault();
    if (!selectedStock || tradeQuantity <= 0) return;

    const tradeData = {
      type: tradeType,
      symbol: selectedStock.symbol,
      companyName: selectedStock.name,
      quantity: Number(tradeQuantity),
      price: selectedStock.price
    };

    dispatch(executeTrade(tradeData))
      .unwrap()
      .then(() => {
        toast.success(`Successfully ${tradeType === 'BUY' ? 'bought' : 'sold'} ${tradeQuantity} shares of ${selectedStock.symbol}`);
        setSelectedStock(null);
        setTradeQuantity(1);
      })
      .catch((err) => toast.error(err || 'Trade failed'));
  };

  // Find how many shares the user currently owns of the selected stock
  const currentHolding = portfolio?.holdings?.find(h => h.symbol === selectedStock?.symbol);
  const maxSell = currentHolding ? currentHolding.quantity : 0;
  const maxBuy = selectedStock ? Math.floor(user.virtualBalance / selectedStock.price) : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-2">Stock Market</h1>
      <p className="text-gray-400 mb-8">Search for stocks and practice paper trading.</p>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Search and Listings */}
        <div className="w-full lg:w-2/3 space-y-6">
          <form onSubmit={onSearchSubmit} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner placeholder-gray-500"
              placeholder="Search by symbol or company name (e.g., AAPL, TSLA)..."
            />
            <button type="submit" className="absolute inset-y-2 right-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 rounded-lg transition-colors font-medium">
              Search
            </button>
          </form>

          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading stocks...</div>
            ) : (
              <ul className="divide-y divide-gray-700">
                {stocks.map(stock => (
                  <li 
                    key={stock.symbol} 
                    className={`p-4 hover:bg-gray-700/50 transition-colors cursor-pointer flex justify-between items-center ${selectedStock?.symbol === stock.symbol ? 'bg-gray-700/50 border-l-4 border-emerald-500' : ''}`}
                    onClick={() => { setSelectedStock(stock); setTradeType('BUY'); setTradeQuantity(1); }}
                  >
                    <div>
                      <div className="font-bold text-white text-lg">{stock.symbol}</div>
                      <div className="text-gray-400 text-sm">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-white">{formatCurrency(stock.price)}</div>
                      <div className={`text-sm font-medium ${stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change}%
                      </div>
                    </div>
                  </li>
                ))}
                {stocks.length === 0 && (
                  <li className="p-8 text-center text-gray-500">No stocks found matching your search.</li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Right Side: Trade Panel */}
        <div className="w-full lg:w-1/3">
          {selectedStock ? (
            <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl p-6 sticky top-24">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedStock.symbol}</h2>
                <p className="text-gray-400">{selectedStock.name}</p>
                <div className="mt-4 flex items-end justify-between">
                  <span className="text-3xl font-mono font-bold text-white">{formatCurrency(selectedStock.price)}</span>
                  <span className={`px-2 py-1 rounded text-sm font-bold ${selectedStock.change >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change}%
                  </span>
                </div>
              </div>

              <div className="h-48 mb-6">
                <Line
                  data={{
                    labels: ['9:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30'],
                    datasets: [
                      {
                        label: 'Price',
                        data: Array.from({length: 7}, () => selectedStock.price + (Math.random() * 10 - 5)),
                        borderColor: selectedStock.change >= 0 ? '#10b981' : '#ef4444',
                        backgroundColor: selectedStock.change >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        fill: true,
                        tension: 0.4
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                        titleColor: '#9ca3af',
                        bodyColor: '#fff',
                        borderColor: '#374151',
                        borderWidth: 1
                      }
                    },
                    scales: {
                      x: { display: false },
                      y: { display: false }
                    },
                    interaction: {
                      mode: 'nearest',
                      axis: 'x',
                      intersect: false
                    }
                  }}
                />
              </div>

              <div className="bg-gray-900 rounded-lg p-4 mb-6 flex justify-between items-center border border-gray-700">
                <span className="text-gray-400 text-sm">Your Buying Power:</span>
                <span className="font-mono text-emerald-400 font-bold">{formatCurrency(user.virtualBalance)}</span>
              </div>

              {currentHolding && (
                <div className="bg-gray-900 rounded-lg p-4 mb-6 flex justify-between items-center border border-gray-700">
                  <span className="text-gray-400 text-sm">Shares Owned:</span>
                  <span className="font-mono text-white font-bold">{currentHolding.quantity}</span>
                </div>
              )}

              <form onSubmit={handleTrade}>
                <div className="flex rounded-lg overflow-hidden border border-gray-700 mb-6 bg-gray-900">
                  <button
                    type="button"
                    onClick={() => setTradeType('BUY')}
                    className={`flex-1 py-3 text-sm font-bold tracking-wider transition-colors ${tradeType === 'BUY' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                  >
                    BUY
                  </button>
                  <button
                    type="button"
                    onClick={() => setTradeType('SELL')}
                    className={`flex-1 py-3 text-sm font-bold tracking-wider transition-colors ${tradeType === 'SELL' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                  >
                    SELL
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Shares</label>
                  <input
                    type="number"
                    min="1"
                    max={tradeType === 'BUY' ? maxBuy : maxSell}
                    value={tradeQuantity}
                    onChange={(e) => setTradeQuantity(Number(e.target.value))}
                    className="w-full px-4 py-3 text-right text-xl font-mono rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="mt-2 text-right text-xs text-gray-500">
                    Max {tradeType === 'BUY' ? maxBuy : maxSell} shares
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-700">
                  <span className="text-gray-400 font-medium">Estimated Total</span>
                  <span className="text-xl font-bold text-white font-mono">{formatCurrency(selectedStock.price * tradeQuantity)}</span>
                </div>

                <button
                  type="submit"
                  disabled={tradeQuantity <= 0 || (tradeType === 'BUY' ? tradeQuantity > maxBuy : tradeQuantity > maxSell)}
                  className={`w-full py-4 rounded-lg font-bold text-lg tracking-wider transition-all transform hover:scale-[1.02] shadow-lg ${
                    tradeType === 'BUY' 
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30' 
                      : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                  } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {tradeType === 'BUY' ? 'Confirm Buy' : 'Confirm Sell'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg p-12 text-center flex flex-col items-center justify-center h-64 sticky top-24">
              <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              <h3 className="text-xl font-bold text-gray-400">Select a Stock</h3>
              <p className="text-gray-500 mt-2">Click on a stock from the list to view details and trade.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockMarket;
