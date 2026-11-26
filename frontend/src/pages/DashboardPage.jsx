import { useEffect, useMemo, useState } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Star, Search, Wallet } from 'lucide-react';
import stockService from '../services/stockService';
import portfolioService from '../services/portfolioService';
import { useAuth } from '../context/useAuth.js';
import stockApi from '../services/stockApi';
import portfolioApi from '../services/portfolioApi';
import orderApi from '../services/orderApi';
import watchlistApi from '../services/watchlistApi';

const mockStocks = [
  { symbol: 'RELIANCE', companyName: 'Reliance Industries', exchange: 'NSE', price: 2865.4, change: 62.8, percentChange: 2.24 },
  { symbol: 'TCS', companyName: 'Tata Consultancy Services', exchange: 'NSE', price: 3935.1, change: -18.4, percentChange: -0.47 },
  { symbol: 'INFY', companyName: 'Infosys', exchange: 'NSE', price: 1521.8, change: 24.3, percentChange: 1.62 },
  { symbol: 'HDFCBANK', companyName: 'HDFC Bank', exchange: 'NSE', price: 1765.9, change: 10.2, percentChange: 0.58 },
  { symbol: 'ICICIBANK', companyName: 'ICICI Bank', exchange: 'NSE', price: 1284.7, change: -7.5, percentChange: -0.58 },
  { symbol: 'ITC', companyName: 'ITC Limited', exchange: 'NSE', price: 454.3, change: 5.8, percentChange: 1.29 },
];

const mockPortfolio = {
  cashBalance: 1000,
  totalInvested: 0,
  holdings: [],
};

const mockOrders = [];

const mockWatchlist = [];

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value || 0);

const getStockPrice = (symbol, stockList) => {
  const stock = stockList.find((item) => item.symbol === symbol);
  return stock ? stock.price : 0;
};

const DashboardPage = () => {
  const [stocks, setStocks] = useState(mockStocks);
  const [portfolio, setPortfolio] = useState(mockPortfolio);
  const { user, token } = useAuth();
  const [orders, setOrders] = useState(mockOrders);
  const [watchlist, setWatchlist] = useState(mockWatchlist);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        if (token) {
          const [stockRes, portfolioRes, ordersRes, watchlistRes] = await Promise.all([
            stockApi.getStocks().catch(() => null),
            portfolioApi.getPortfolio().catch(() => null),
            orderApi.getOrders().catch(() => null),
            watchlistApi.getWatchlist().catch(() => null),
          ]);

          if (!isMounted) return;

          const nextStocks = stockRes?.data?.stocks || mockStocks;
          const nextPortfolio = portfolioRes?.data?.data || mockPortfolio;
          const nextOrders = ordersRes?.data?.orders || ordersRes?.data?.data?.orders || mockOrders;
          const nextWatchlist = watchlistRes?.data?.stockSymbols || [];

          setStocks(nextStocks);
          setPortfolio(nextPortfolio);
          setOrders(nextOrders);
          setWatchlist(nextWatchlist);
          setError('');
        } else {
          const marketStocks = await stockService.getStocks();
          const nextWatchlist = stockService.getWatchlist() || mockWatchlist;
          setStocks(marketStocks || mockStocks);
          setPortfolio(mockPortfolio);
          setOrders(mockOrders);
          setWatchlist(nextWatchlist);
          setError('');
        }
      } catch (loadError) {
        console.error('Failed to load dashboard data', loadError);
        if (!isMounted) return;
        setStocks(mockStocks);
        setPortfolio(mockPortfolio);
        setOrders(mockOrders);
        setWatchlist(mockWatchlist);
        setError('Unable to reach the live market service. Showing mock market data instead.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, [token]);

  useEffect(() => {
    const loadSummary = async () => {
      if (!user) return;
      const id = user.id || user._id || 'guest';
      const summary = await portfolioService.computePortfolioSummary(id);
      setPortfolio((prev) => ({ ...prev, ...summary }));
    };
    loadSummary();
  }, [user]);

  const filteredStocks = useMemo(
    () =>
      stocks.filter((stock) => `${stock.symbol} ${stock.companyName}`.toLowerCase().includes(search.toLowerCase())),
    [stocks, search],
  );

  const topGainers = useMemo(
    () => [...stocks].sort((a, b) => b.percentChange - a.percentChange).slice(0, 3),
    [stocks],
  );

  const topLosers = useMemo(
    () => [...stocks].sort((a, b) => a.percentChange - b.percentChange).slice(0, 3),
    [stocks],
  );

  const portfolioHoldingsValue = useMemo(
    () =>
      (portfolio?.holdings || []).reduce((total, holding) => {
        const price = getStockPrice(holding.symbol, stocks);
        return total + price * holding.quantity;
      }, 0),
    [portfolio, stocks],
  );

  const totalInvestedValue = useMemo(
    () =>
      (portfolio?.holdings || []).reduce((total, holding) => total + holding.averageBuyPrice * holding.quantity, 0) ||
      portfolio?.totalInvested ||
      0,
    [portfolio],
  );

  const totalPortfolioValue = (portfolio?.cashBalance || 0) + portfolioHoldingsValue;
  const totalProfitLoss = totalPortfolioValue - totalInvestedValue;

  const watchlistPreview = useMemo(
    () =>
      (watchlist || []).map((symbol) => {
        const stock = stocks.find((item) => item.symbol === symbol);
        return stock || { symbol, companyName: symbol, price: 0, percentChange: 0 };
      }),
    [watchlist, stocks],
  );

  const marketOverview = [
    { label: 'NIFTY 50', value: '24,685.40', change: '+124.1', percent: '+0.51%' },
    { label: 'SENSEX', value: '81,242.50', change: '+312.6', percent: '+0.39%' },
    { label: 'Market Breadth', value: '1.62x', change: 'Bullish', percent: 'Positive' },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Market overview</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Welcome back</h1>
          </div>
          <div className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-300">
            {error ? 'Market status: Simulated / Mock fallback' : 'Market status: Simulated / Mock data'}
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {marketOverview.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
              <div className="mt-3 flex items-end justify-between">
                <span className="text-2xl font-bold text-white">{item.value}</span>
                <span className={item.percent.includes('-') ? 'text-red-400' : 'text-emerald-400'}>{item.percent}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Top movers</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-cyan-400"
                placeholder="Search stocks"
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((index) => (
                <div key={index} className="h-16 animate-pulse rounded-xl bg-slate-800" />
              ))}
            </div>
          ) : filteredStocks.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-sm text-slate-300">
              No stocks match your search. Try another symbol or company name.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredStocks.slice(0, 5).map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div>
                    <p className="font-medium text-white">{stock.companyName}</p>
                    <p className="text-sm text-slate-400">{stock.symbol} • {stock.exchange}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold text-white">₹{stock.price.toFixed(2)}</p>
                      <div className={`flex items-center gap-1 text-sm ${stock.percentChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stock.percentChange >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        {Math.abs(stock.percentChange).toFixed(2)}%
                      </div>
                    </div>
                    <button className="rounded-xl border border-slate-700 p-2 text-slate-300">
                      <Star className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-white">Portfolio summary</h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Virtual cash</p>
                <p className="mt-2 text-3xl font-bold text-white">{formatCurrency(portfolio?.cashBalance || 0)}</p>
              </div>
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-emerald-300">
                <div className="flex items-center justify-between">
                  <span>Profit / Loss</span>
                  <TrendingUp className="h-4 w-4" />
                </div>
                <p className="mt-2 text-2xl font-bold">{totalProfitLoss >= 0 ? '+' : '-'}{formatCurrency(Math.abs(totalProfitLoss))}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Watchlist preview</h2>
              <Wallet className="h-4 w-4 text-cyan-300" />
            </div>
            <div className="space-y-3">
              {watchlistPreview.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-3">
                  <div>
                    <p className="font-medium text-white">{stock.symbol}</p>
                    <p className="text-xs text-slate-400">{stock.companyName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">₹{stock.price.toFixed(2)}</p>
                    <p className={stock.percentChange >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {stock.percentChange >= 0 ? '+' : ''}{stock.percentChange.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white">Top gainers</h2>
          <div className="mt-5 space-y-3">
            {topGainers.map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-3">
                <div>
                  <p className="font-medium text-white">{stock.symbol}</p>
                  <p className="text-xs text-slate-400">{stock.companyName}</p>
                </div>
                <p className="text-emerald-400">+{stock.percentChange.toFixed(2)}%</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white">Top losers</h2>
          <div className="mt-5 space-y-3">
            {topLosers.map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-3">
                <div>
                  <p className="font-medium text-white">{stock.symbol}</p>
                  <p className="text-xs text-slate-400">{stock.companyName}</p>
                </div>
                <p className="text-red-400">{stock.percentChange.toFixed(2)}%</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Recent paper-trading orders</h2>
          <span className="text-sm text-slate-400">{orders.length} orders</span>
        </div>

        <div className="space-y-3">
          {(orders || []).slice(0, 4).map((order) => (
            <div key={`${order.symbol}-${order.createdAt}`} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <div>
                <p className="font-medium text-white">{order.symbol} • {order.side}</p>
                <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right text-sm text-slate-300">
                <p>{order.quantity} shares</p>
                <p className={order.side === 'BUY' ? 'text-cyan-300' : 'text-emerald-300'}>
                  {order.side === 'BUY' ? 'Bought' : 'Sold'} {formatCurrency(order.totalValue || 0)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
