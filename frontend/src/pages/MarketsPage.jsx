import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star } from 'lucide-react';
import stockService from '../services/stockService';
import { useAuth } from '../context/useAuth.js';
import stockApi from '../services/stockApi';
import watchlistApi from '../services/watchlistApi';

const MarketsPage = () => {
  const [stocks, setStocks] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [exchange, setExchange] = useState('All');
  const [sortBy, setSortBy] = useState('');

  const { user, token } = useAuth();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        if (token) {
          const res = await stockApi.getStocks({ q: query });
          const list = res?.data?.stocks || [];
          if (!mounted) return;
          setStocks(list);

          try {
            const w = await watchlistApi.getWatchlist();
            setWatchlist(w?.data?.stockSymbols || []);
          } catch {
            setWatchlist([]);
          }
        } else {
          const list = await stockService.getStocks({ q: query, exchange, sortBy });
          if (!mounted) return;
          setStocks(list);
          setWatchlist(stockService.getWatchlist());
        }
      } catch (e) {
        console.error(e);
        setStocks([]);
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [query, exchange, sortBy, token]);

  const toggleWatch = async (symbol) => {
    if (user && user.token) {
      try {
        if (watchlist.includes(symbol)) {
          const res = await watchlistApi.removeFromWatchlist(symbol);
          setWatchlist(res?.data?.stockSymbols || []);
        } else {
          const res = await watchlistApi.addToWatchlist(symbol);
          setWatchlist(res?.data?.stockSymbols || []);
        }
        return;
      } catch (e) {
        console.error('Watchlist API failed, falling back to local', e);
      }
    }

    const updated = stockService.toggleWatchlist(symbol);
    setWatchlist(updated);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Markets</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Market watchlist</h1>
          </div>
          <div className="flex w-full max-w-2xl items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-white outline-none focus:border-cyan-400"
                placeholder="Search by symbol or company"
              />
            </div>

            <select value={exchange} onChange={(e) => setExchange(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
              <option value="All">All</option>
              <option value="NSE">NSE</option>
              <option value="BSE">BSE</option>
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
              <option value="">Sort</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="changePercent">Change %</option>
              <option value="change">Change</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{[1, 2, 3, 4].map((index) => <div key={index} className="h-20 animate-pulse rounded-2xl bg-slate-800" />)}</div>
      ) : stocks.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
          No stocks match your search right now.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stocks.map((stock) => {
            const isWatching = watchlist.includes(stock.symbol);
            return (
              <div key={stock.symbol} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-white">{stock.companyName}</p>
                    <p className="text-sm text-slate-400">{stock.symbol} • {stock.exchange}</p>
                  </div>
                  <span className={stock.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {stock.changePercent >= 0 ? '+' : ''}{Number(stock.changePercent || 0).toFixed(2)}%
                  </span>
                </div>
                <div className="mt-5 flex items-end justify-between">
                  <p className="text-3xl font-bold text-white">₹{Number(stock.price || 0).toFixed(2)}</p>
                  <p className={stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {stock.change >= 0 ? '+' : '-'}₹{Math.abs(Number(stock.change || 0)).toFixed(2)}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-400">
                  <span>Data source: mock</span>
                  <button
                    onClick={() => toggleWatch(stock.symbol)}
                    className={`inline-flex items-center gap-2 rounded-xl border px-2.5 py-2 ${isWatching ? 'border-amber-500/50 bg-amber-500/10 text-amber-200' : 'border-slate-700 bg-slate-950 text-slate-200'}`}
                  >
                    <Star className={`h-3.5 w-3.5 ${isWatching ? 'fill-current' : ''}`} />
                    {isWatching ? 'Watching' : 'Watch'}
                  </button>
                </div>
                <div className="mt-4">
                  <Link
                    to={`/stocks/${stock.symbol}`}
                    className="inline-flex rounded-xl bg-cyan-500 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400"
                  >
                    View details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MarketsPage;
