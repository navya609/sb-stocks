import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <nav className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-emerald-500 w-8 h-8 rounded flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/30">
              SB
            </div>
            <span className="font-bold text-xl tracking-tight text-white hidden sm:block">Stocks</span>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/market" className="text-gray-300 hover:text-emerald-400 transition-colors font-medium px-3 py-2 rounded-md">
                  Market
                </Link>
                <Link to="/dashboard" className="text-gray-300 hover:text-emerald-400 transition-colors font-medium px-3 py-2 rounded-md">
                  Dashboard
                </Link>
                <div className="hidden md:flex items-center space-x-2 bg-gray-900 px-3 py-1.5 rounded-full border border-gray-700">
                  <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Balance</span>
                  <span className="font-mono text-emerald-400 font-bold">{formatCurrency(user.virtualBalance || 100000)}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="bg-gray-700 hover:bg-red-500 hover:text-white text-gray-300 px-4 py-2 rounded-md transition-all font-medium text-sm border border-gray-600 hover:border-transparent"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors font-medium">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-md transition-all font-medium shadow-lg shadow-emerald-600/20"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
