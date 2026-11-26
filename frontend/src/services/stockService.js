import stocks from '../data/stocks';

const WATCHLIST_KEY = 'sm_watchlist_v1';

function delay(ms = 200) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function getStocks({ q = '', exchange = 'All', sortBy = '' } = {}) {
  await delay(200);
  let list = [...stocks];

  if (q) {
    const term = q.toLowerCase();
    list = list.filter((s) => s.symbol.toLowerCase().includes(term) || s.companyName.toLowerCase().includes(term));
  }

  if (exchange && exchange !== 'All') {
    list = list.filter((s) => s.exchange === exchange);
  }

  if (sortBy) {
    if (sortBy === 'name') list.sort((a, b) => a.companyName.localeCompare(b.companyName));
    if (sortBy === 'price') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'changePercent') list.sort((a, b) => b.changePercent - a.changePercent);
    if (sortBy === 'change') list.sort((a, b) => b.change - a.change);
  }

  return list;
}

export async function getStock(symbol) {
  await delay(150);
  return stocks.find((s) => s.symbol === symbol) || null;
}

export async function getHistorical(symbol, period = '1M') {
  await delay(150);
  const s = stocks.find((st) => st.symbol === symbol);
  return (s && s.historicalData && s.historicalData[period]) || [];
}

export function getWatchlist() {
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToWatchlist(symbol) {
  const list = new Set(getWatchlist());
  list.add(symbol);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(Array.from(list)));
}

export function removeFromWatchlist(symbol) {
  const list = new Set(getWatchlist());
  list.delete(symbol);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(Array.from(list)));
}

export function toggleWatchlist(symbol) {
  const list = new Set(getWatchlist());
  if (list.has(symbol)) list.delete(symbol);
  else list.add(symbol);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(Array.from(list)));
  return Array.from(list);
}

export default {
  getStocks,
  getStock,
  getHistorical,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  toggleWatchlist,
};
