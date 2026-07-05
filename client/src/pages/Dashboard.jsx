import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getPortfolio } from '../features/portfolio/portfolioSlice';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { portfolio, isLoading, isError, message } = useSelector(
    (state) => state.portfolio
  );

  useEffect(() => {
    if (isError) {
      console.error(message);
    }
    if (!user) {
      navigate('/login');
    } else {
      dispatch(getPortfolio());
    }
  }, [user, navigate, isError, message, dispatch]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const calculateTotalValue = () => {
    if (!portfolio || !portfolio.holdings) return 0;
    // Assuming current price is same as average price for demo unless we fetch real-time
    // In a real app, you'd fetch current prices here.
    return portfolio.holdings.reduce((acc, holding) => acc + (holding.quantity * holding.averagePrice), 0);
  };

  if (isLoading) {
    return <div className="text-center py-20 text-xl font-semibold">Loading Portfolio...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-gray-400 font-medium mb-1">Available Cash</h3>
          <p className="text-3xl font-bold text-emerald-400">{formatCurrency(user?.virtualBalance || 0)}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-gray-400 font-medium mb-1">Portfolio Value</h3>
          <p className="text-3xl font-bold text-blue-400">{formatCurrency(calculateTotalValue())}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-gray-400 font-medium mb-1">Total Account Value</h3>
          <p className="text-3xl font-bold text-white">{formatCurrency((user?.virtualBalance || 0) + calculateTotalValue())}</p>
        </div>
      </div>

      <div className="mt-8 bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
          <h2 className="text-xl font-bold text-white">Your Holdings</h2>
          <button 
            onClick={() => navigate('/market')}
            className="text-sm bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md transition-colors font-medium shadow-md"
          >
            Buy Stocks
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/50 text-gray-400 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Symbol</th>
                <th className="px-6 py-4 font-medium">Company</th>
                <th className="px-6 py-4 font-medium text-right">Shares</th>
                <th className="px-6 py-4 font-medium text-right">Avg Cost</th>
                <th className="px-6 py-4 font-medium text-right">Total Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {!portfolio || !portfolio.holdings || portfolio.holdings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                      <p>You don't own any stocks yet.</p>
                      <p className="text-sm mt-1">Head over to the Market to make your first trade!</p>
                    </div>
                  </td>
                </tr>
              ) : (
                portfolio.holdings.map((holding) => (
                  <tr key={holding.symbol} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-white bg-gray-700 px-2 py-1 rounded text-sm">{holding.symbol}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-300 font-medium">{holding.companyName}</td>
                    <td className="px-6 py-4 text-right font-mono text-gray-200">{holding.quantity}</td>
                    <td className="px-6 py-4 text-right font-mono text-gray-400">{formatCurrency(holding.averagePrice)}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-white">
                      {formatCurrency(holding.quantity * holding.averagePrice)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
