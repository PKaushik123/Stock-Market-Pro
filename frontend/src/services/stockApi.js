import api from './api';

export async function getStocks({ q } = {}) {
  const res = await api.get('/stocks', { params: { q } });
  return res.data;
}

export async function getStock(symbol) {
  const res = await api.get(`/stocks/${symbol}`);
  return res.data;
}

export async function getStockHistory(symbol, range = '1M') {
  const res = await api.get(`/stocks/${symbol}/history`, { params: { range } });
  return res.data;
}

export default { getStocks, getStock, getStockHistory };
