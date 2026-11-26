import { useEffect, useMemo, useState } from 'react';
import portfolioService from '../services/portfolioService';
import stockService from '../services/stockService';
import { useAuth } from '../context/useAuth.js';
import portfolioApi from '../services/portfolioApi';

const fallbackPortfolio = {
  cashBalance: 1000,
  totalInvested: 0,
  holdings: [],
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value || 0);

const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState(fallbackPortfolio);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    let mounted = true;
    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        const marketStocks = await stockService.getStocks();
        if (token) {
          try {
            const res = await portfolioApi.getPortfolio();
            const p = res?.data?.data || res?.data || fallbackPortfolio;
            setPortfolio(p || fallbackPortfolio);
          } catch {
            const id = user?.id || user?._id || 'guest';
            const p = await portfolioService.getPortfolio(id);
            setPortfolio(p || fallbackPortfolio);
          }
        } else {
          const id = user?.id || user?._id || 'guest';
          const p = await portfolioService.getPortfolio(id);
          setPortfolio(p || fallbackPortfolio);
        }

        setStocks(marketStocks || []);
      } catch (error) {
        console.error('Failed to fetch portfolio', error);
        setPortfolio(fallbackPortfolio);
        setStocks([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPortfolio();
    return () => { mounted = false; };
  }, [token, user]);

  const holdings = useMemo(() => portfolio?.holdings || [], [portfolio]);

  const currentValue = useMemo(
    () =>
      holdings.reduce((total, holding) => {
        const marketPrice = stocks.find((stock) => stock.symbol === holding.symbol)?.price || holding.averageBuyPrice;
        return total + marketPrice * holding.quantity;
      }, 0),
    [holdings, stocks],
  );

  const investedValue = useMemo(
    () => holdings.reduce((total, holding) => total + holding.averageBuyPrice * holding.quantity, 0),
    [holdings],
  );

  const totalProfitLoss = currentValue + (portfolio.cashBalance || 0) - investedValue;

  const summaryCards = [
    ['Virtual cash', formatCurrency(portfolio.cashBalance || 0)],
    ['Invested', formatCurrency(investedValue)],
    ['Current value', formatCurrency(currentValue + (portfolio.cashBalance || 0))],
    ['Profit/Loss', `${totalProfitLoss >= 0 ? '+' : '-'}${formatCurrency(Math.abs(totalProfitLoss))}`],
  ];

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h1 className="text-3xl font-bold text-white">Portfolio</h1>

      {loading ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl bg-slate-800" />
          ))}
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {summaryCards.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
                <p className="mt-2 text-2xl font-bold text-white">{value}</p>
              </div>
            ))}
          </div>

          {holdings.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-12 text-center text-slate-400">
              No positions yet. Buy simulated shares to populate your portfolio.
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {holdings.map((holding) => {
                const marketPrice = stocks.find((stock) => stock.symbol === holding.symbol)?.price || holding.averageBuyPrice;
                const holdingValue = marketPrice * holding.quantity;
                const pnl = holdingValue - holding.averageBuyPrice * holding.quantity;

                return (
                  <div key={holding.symbol} className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-white">{holding.symbol}</p>
                      <p className="text-sm text-slate-400">{holding.quantity} shares • Avg ₹{Number(holding.averageBuyPrice || 0).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <p className="text-slate-400">Market</p>
                        <p className="font-medium text-white">₹{Number(marketPrice || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Value</p>
                        <p className="font-medium text-white">₹{Number(holdingValue || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">P/L</p>
                        <p className={pnl >= 0 ? 'font-medium text-emerald-300' : 'font-medium text-red-300'}>
                          {pnl >= 0 ? '+' : '-'}₹{Math.abs(Number(pnl || 0)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PortfolioPage;
