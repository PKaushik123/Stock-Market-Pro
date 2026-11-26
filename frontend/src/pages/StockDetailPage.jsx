import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import stockService from '../services/stockService';
import StockChart from '../components/StockChart';
import { useAuth } from '../context/useAuth.js';
import portfolioService from '../services/portfolioService';
import BuySellModal from '../components/BuySellModal';
import orderApi from '../services/orderApi';
import portfolioApi from '../services/portfolioApi';

const mockStock = {
  symbol: 'RELIANCE',
  companyName: 'Reliance Industries',
  exchange: 'NSE',
  price: 2865.4,
  change: 62.8,
  percentChange: 2.24,
  open: 2798.1,
  high: 2892.2,
  low: 2789.5,
  volume: 9234000,
  dataSource: 'mock',
  timestamp: new Date().toISOString(),
};

const StockDetailPage = () => {
  const { symbol } = useParams();
  const [stock, setStock] = useState(mockStock);
  const [portfolio, setPortfolio] = useState({ cashBalance: 1000, holdings: [] });
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState('1M');
  const [chartData, setChartData] = useState([]);
  const [quantity, setQuantity] = useState('1');
  const { user, token } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('BUY');
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tradeLoading, setTradeLoading] = useState(false);

  useEffect(() => {
    const fetchStockInfo = async () => {
      try {
        const [stockData, portfolioResponse] = await Promise.all([
          stockService.getStock(symbol),
          // keep calling existing backend for portfolio if available; fall back to mock
          fetch('/api/portfolio').then((r) => r.ok && r.json()).catch(() => null),
        ]);

        setStock(stockData || mockStock);
        setPortfolio((portfolioResponse && portfolioResponse.data) || { cashBalance: 1000, holdings: [] });
        setError('');
      } catch (fetchError) {
        console.error('Failed to load stock detail', fetchError);
        setStock(mockStock);
        setPortfolio({ cashBalance: 1000, holdings: [] });
        setError('Live market data is unavailable. Showing simulated price data instead.');
      } finally {
        setLoading(false);
      }
    };

    const loadChart = async (period = chartPeriod) => {
      const hist = await stockService.getHistorical(symbol, period);
      setChartData(hist);
    };

    fetchStockInfo();
    loadChart();
  }, [symbol, chartPeriod]);

  useEffect(() => {
    const loadSummary = async () => {
      if (!user) return;
      const s = await portfolioService.computePortfolioSummary(user.id || user._id || 'guest');
      setPortfolioSummary(s);
    };
    loadSummary();
  }, [user]);

  const holding = portfolio.holdings?.find((item) => item.symbol === stock.symbol) || null;

  const openModal = (mode) => {
    setModalMode(mode);
    setModalOpen(true);
  };

  const handleModalConfirm = async ({ quantity: q, orderType, limitPrice }) => {
    setTradeLoading(true);
    setError('');
    try {
      if (!user) throw new Error('User not authenticated');
      if (token) {
        // create order via backend
        const payload = {
          symbol: stock.symbol,
          companyName: stock.companyName,
          side: modalMode,
          quantity: q,
          referencePrice: stock.price,
          orderType,
          limitPrice,
        };
        const res = await orderApi.createOrder(payload);
        setSuccess(res?.data?.order ? `Order executed: ${modalMode} ${q} ${stock.symbol}` : 'Order placed');

        // refresh portfolio from backend
        try {
          const pRes = await portfolioApi.getPortfolio();
          setPortfolio(pRes?.data || { cashBalance: 1000, holdings: [] });
          const summary = pRes?.data || await portfolioService.computePortfolioSummary(user.id || user._id || 'guest');
          setPortfolioSummary(summary);
        } catch {
          const id = user.id || user._id || 'guest';
          const s = await portfolioService.computePortfolioSummary(id);
          setPortfolio(s);
          setPortfolioSummary(s);
        }
      } else {
        const id = user.id || user._id || 'guest';
        if (modalMode === 'BUY') {
          await portfolioService.buy(id, { symbol: stock.symbol, quantity: q, price: stock.price });
          setSuccess(`Successfully bought ${q} shares of ${stock.symbol}`);
        } else {
          await portfolioService.sell(id, { symbol: stock.symbol, quantity: q, price: stock.price });
          setSuccess(`Successfully sold ${q} shares of ${stock.symbol}`);
        }

        const s = await portfolioService.computePortfolioSummary(id);
        setPortfolio(s);
        setPortfolioSummary(s);
      }
    } catch (e) {
      setError(e.message || 'Order failed');
    } finally {
      setTradeLoading(false);
    }
  };

  if (loading) {
    return <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-300">Loading stock data...</div>;
  }

  if (!stock) {
    return <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-red-300">Stock not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">{stock.exchange}</p>
            <h1 className="mt-2 text-4xl font-bold text-white">{stock.companyName}</h1>
            <p className="text-slate-400">{stock.symbol}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-white">₹{Number(stock.price || 0).toFixed(2)}</p>
            <p className={Number(stock.percentChange || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}>
              {Number(stock.percentChange || 0) >= 0 ? '+' : ''}{Number(stock.percentChange || 0).toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 mb-6">
            <StockChart data={chartData} onPeriodChange={async (p) => {
              setChartPeriod(p);
              const hist = await stockService.getHistorical(symbol, p);
              setChartData(hist);
            }} />
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-white">Price overview</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {[
                ['Open', `₹${Number(stock.open || 0).toFixed(2)}`],
                ['High', `₹${Number(stock.high || 0).toFixed(2)}`],
                ['Low', `₹${Number(stock.low || 0).toFixed(2)}`],
                ['Volume', Number(stock.volume || 0).toLocaleString()],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white">Trade</h2>
              <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Virtual cash</span>
                <span className="text-white">₹{Number(portfolio.cashBalance || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span>Current holding</span>
                <span className="text-white">{holding ? holding.quantity : 0} shares</span>
              </div>
            </div>

            <label className="block text-sm text-slate-300">
              Quantity
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={tradeLoading}
                onClick={() => openModal('BUY')}
                className="rounded-xl bg-cyan-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60"
              >
                Buy
              </button>
              <button
                disabled={tradeLoading}
                onClick={() => openModal('SELL')}
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-medium text-slate-100 transition hover:border-slate-600 disabled:opacity-60"
              >
                Sell
              </button>
            </div>
          </div>
        </div>
      </div>
      <BuySellModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleModalConfirm}
        mode={modalMode}
        symbol={stock.symbol}
        price={stock.price}
        available={portfolioSummary?.cashBalance || 0}
        owned={(portfolioSummary?.holdings || []).find((h) => h.symbol === stock.symbol)?.quantity || 0}
      />
    </div>
  );
};

export default StockDetailPage;
