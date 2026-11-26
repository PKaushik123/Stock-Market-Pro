import api from './api';

export async function getPortfolio() {
  const res = await api.get('/portfolio');
  return res.data;
}

export async function getHoldings() {
  const res = await api.get('/portfolio/holdings');
  return res.data;
}

export default { getPortfolio, getHoldings };
