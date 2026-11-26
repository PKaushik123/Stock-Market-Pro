import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import stockService from '../services/stockService';
import { useAuth } from '../context/useAuth.js';
import watchlistApi from '../services/watchlistApi';
import stockApi from '../services/stockApi';

const WatchlistPage = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token } = useAuth();

  const fetchWatchlist = useCallback(async () => {
    try {
      let symbols = [];
      if (token) {
        try {
          const res = await watchlistApi.getWatchlist();
          symbols = res?.data?.stockSymbols || [];
        } catch {
          symbols = [];
        }
      } else {
        symbols = stockService.getWatchlist();
      }

      if (!symbols.length) {
        setStocks([]);
        return;
      }

      try {
        const res = token ? await stockApi.getStocks() : null;
        const marketStocks = res?.data?.stocks || await stockService.getStocks();
        setStocks(marketStocks.filter((stock) => symbols.includes(stock.symbol)));
      } catch {
        const marketStocks = await stockService.getStocks();
        setStocks(marketStocks.filter((stock) => symbols.includes(stock.symbol)));
      }
    } catch (error) {
      console.error('Failed to load watchlist', error);
      setStocks([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const loadWatchlist = async () => {
      await fetchWatchlist();
    };

    void loadWatchlist();
  }, [fetchWatchlist]);

  const removeSymbol = async (symbol) => {
    try {
      if (token) {
        const res = await watchlistApi.removeFromWatchlist(symbol);
        const newList = res?.data?.stockSymbols || [];
        setStocks((previous) => previous.filter((item) => newList.includes(item.symbol)));
        return;
      }

      stockService.removeFromWatchlist(symbol);
      setStocks((previous) => previous.filter((item) => item.symbol !== symbol));
    } catch (error) {
      console.error('Failed to remove stock from watchlist', error);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h1 className="text-3xl font-bold text-white">Watchlist</h1>
      <p className="mt-2 text-slate-400">Track your favourite stocks and monitor price moves.</p>

      {loading ? (
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((index) => <div key={index} className="h-20 animate-pulse rounded-2xl bg-slate-800" />)}
        </div>
      ) : stocks.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-12 text-center text-slate-400">
          <h3 className="mb-4 text-lg font-semibold text-white">Your watchlist is empty</h3>
          <p className="mb-6">Add stocks to your watchlist to monitor price movements.</p>
          <Link to="/markets" className="inline-flex rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400">Explore Markets</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {stocks.map((stock) => (
            <div key={stock.symbol} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-white">{stock.companyName}</p>
                  <p className="text-sm text-slate-400">{stock.symbol}</p>
                </div>
                <button
                  onClick={() => removeSymbol(stock.symbol)}
                  className="rounded-xl border border-slate-700 p-2 text-slate-300 transition hover:border-red-500 hover:text-red-300"
                  aria-label={`Remove ${stock.symbol} from watchlist`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <p className="text-2xl font-bold text-white">₹{Number(stock.price || 0).toFixed(2)}</p>
                <p className={Number(stock.percentChange || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {Number(stock.percentChange || 0) >= 0 ? '+' : ''}{Number(stock.percentChange || 0).toFixed(2)}%
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-400">{stock.exchange}</span>
                <Link
                  to={`/stocks/${stock.symbol}`}
                  className="rounded-xl bg-cyan-500 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
