import stockService from './stockService';

const PREFIX = 'paper_portfolio_v1_';

function keyFor(userId) {
  return `${PREFIX}${userId || 'guest'}`;
}

function now() {
  return new Date().toISOString();
}

function load(userId) {
  const raw = localStorage.getItem(keyFor(userId));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function save(userId, data) {
  localStorage.setItem(keyFor(userId), JSON.stringify(data));
}

export function ensurePortfolio(userId) {
  let p = load(userId);
  if (!p) {
    p = { cashBalance: 1000, holdings: [], orders: [], createdAt: now() };
    save(userId, p);
  }
  return p;
}

export async function getPortfolio(userId) {
  ensurePortfolio(userId);
  return load(userId);
}

export async function getHoldings(userId) {
  const p = ensurePortfolio(userId);
  return p.holdings || [];
}

export async function getOrders(userId) {
  const p = ensurePortfolio(userId);
  return p.orders || [];
}

function generateOrderId() {
  return `SM-${Math.floor(Math.random() * 900000 + 100000)}`;
}

function findHolding(p, symbol) {
  return p.holdings.find((h) => h.symbol === symbol);
}

export async function buy(userId, { symbol, quantity, price }) {
  const p = ensurePortfolio(userId);
  const qty = Math.floor(Number(quantity));
  if (!qty || qty <= 0) throw new Error('Quantity must be a whole number greater than zero');
  if (!symbol) throw new Error('Invalid symbol');
  if (!price || Number(price) <= 0) throw new Error('Invalid price');

  const total = qty * Number(price);
  if (total > p.cashBalance) throw new Error('Insufficient virtual balance');

  // deduct cash
  p.cashBalance = Number((p.cashBalance - total).toFixed(2));

  // update holding
  const existing = findHolding(p, symbol);
  if (existing) {
    const prevQty = existing.quantity;
    const prevInvest = existing.averageBuyPrice * prevQty;
    const newQty = prevQty + qty;
    const newInvest = prevInvest + total;
    existing.quantity = newQty;
    existing.averageBuyPrice = Number((newInvest / newQty).toFixed(4));
  } else {
    p.holdings.push({ symbol, quantity: qty, averageBuyPrice: Number(price) });
  }

  const order = {
    _id: generateOrderId(),
    symbol,
    side: 'BUY',
    quantity: qty,
    price: Number(price),
    totalValue: Number(total),
    status: 'EXECUTED',
    createdAt: now(),
  };
  p.orders.unshift(order);
  save(userId, p);
  return order;
}

export async function sell(userId, { symbol, quantity, price }) {
  const p = ensurePortfolio(userId);
  const qty = Math.floor(Number(quantity));
  if (!qty || qty <= 0) throw new Error('Quantity must be a whole number greater than zero');
  if (!symbol) throw new Error('Invalid symbol');
  if (!price || Number(price) <= 0) throw new Error('Invalid price');

  const existing = findHolding(p, symbol);
  if (!existing || existing.quantity < qty) throw new Error('Insufficient quantity to sell');

  const total = qty * Number(price);
  // reduce holding
  existing.quantity = existing.quantity - qty;
  if (existing.quantity <= 0) {
    p.holdings = p.holdings.filter((h) => h.symbol !== symbol);
  }

  // add cash
  p.cashBalance = Number((p.cashBalance + total).toFixed(2));

  const order = {
    _id: generateOrderId(),
    symbol,
    side: 'SELL',
    quantity: qty,
    price: Number(price),
    totalValue: Number(total),
    status: 'EXECUTED',
    createdAt: now(),
  };
  p.orders.unshift(order);
  save(userId, p);
  return order;
}

export async function computePortfolioSummary(userId) {
  const p = ensurePortfolio(userId);
  const marketStocks = await stockService.getStocks();
  const holdings = p.holdings || [];

  const invested = holdings.reduce((sum, h) => sum + h.averageBuyPrice * h.quantity, 0);
  const currentValue = holdings.reduce((sum, h) => {
    const marketPrice = marketStocks.find((s) => s.symbol === h.symbol)?.price || h.averageBuyPrice;
    return sum + marketPrice * h.quantity;
  }, 0);

  const totalPortfolioValue = Number((currentValue + p.cashBalance).toFixed(2));
  const totalPnl = Number((currentValue - invested).toFixed(2));
  const returnPercent = invested > 0 ? Number(((totalPnl / invested) * 100).toFixed(2)) : 0;

  return {
    cashBalance: p.cashBalance,
    invested: Number(invested.toFixed(2)),
    currentValue: Number(currentValue.toFixed(2)),
    portfolioValue: totalPortfolioValue,
    totalPnl,
    returnPercent,
    holdings: p.holdings,
    orders: p.orders,
  };
}

export default {
  ensurePortfolio,
  getPortfolio,
  getHoldings,
  getOrders,
  buy,
  sell,
  computePortfolioSummary,
};
