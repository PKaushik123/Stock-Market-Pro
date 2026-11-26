import api from './api';

export async function getWatchlist() {
  const res = await api.get('/watchlist');
  return res.data;
}

export async function addToWatchlist(symbol) {
  const res = await api.post('/watchlist', { symbol });
  return res.data;
}

export async function removeFromWatchlist(symbol) {
  const res = await api.delete(`/watchlist/${symbol}`);
  return res.data;
}

export default { getWatchlist, addToWatchlist, removeFromWatchlist };
