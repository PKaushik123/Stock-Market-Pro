import api from './api';

export async function createOrder({ symbol, companyName, side, quantity, referencePrice, orderType = 'MARKET', limitPrice }) {
  const res = await api.post('/orders', { symbol, companyName, side, quantity, referencePrice, orderType, limitPrice });
  return res.data;
}

export async function getOrders(params) {
  const res = await api.get('/orders', { params });
  return res.data;
}

export default { createOrder, getOrders };
