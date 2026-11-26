const mockStocks = [
  {
    symbol: 'RELIANCE',
    companyName: 'Reliance Industries',
    exchange: 'NSE',
    price: 2865.4,
    change: 62.8,
    percentChange: 2.24,
    previousClose: 2802.6,
    open: 2825.5,
    high: 2889.3,
    low: 2818.7,
    volume: 4100000,
    timestamp: new Date().toISOString(),
    dataSource: 'mock',
    marketStatus: 'simulated',
  },
  {
    symbol: 'TCS',
    companyName: 'Tata Consultancy Services',
    exchange: 'NSE',
    price: 3935.1,
    change: -18.4,
    percentChange: -0.47,
    previousClose: 3953.5,
    open: 3948.8,
    high: 3967.4,
    low: 3912.6,
    volume: 2350000,
    timestamp: new Date().toISOString(),
    dataSource: 'mock',
    marketStatus: 'simulated',
  },
  {
    symbol: 'INFY',
    companyName: 'Infosys',
    exchange: 'NSE',
    price: 1521.8,
    change: 24.3,
    percentChange: 1.62,
    previousClose: 1497.5,
    open: 1504.4,
    high: 1532.1,
    low: 1494.2,
    volume: 3100000,
    timestamp: new Date().toISOString(),
    dataSource: 'mock',
    marketStatus: 'simulated',
  },
  {
    symbol: 'HDFCBANK',
    companyName: 'HDFC Bank',
    exchange: 'NSE',
    price: 1765.9,
    change: 10.2,
    percentChange: 0.58,
    previousClose: 1755.7,
    open: 1760.2,
    high: 1774.6,
    low: 1751.5,
    volume: 2800000,
    timestamp: new Date().toISOString(),
    dataSource: 'mock',
    marketStatus: 'simulated',
  },
  {
    symbol: 'ICICIBANK',
    companyName: 'ICICI Bank',
    exchange: 'NSE',
    price: 1284.7,
    change: -7.5,
    percentChange: -0.58,
    previousClose: 1292.2,
    open: 1288.3,
    high: 1298.5,
    low: 1278.9,
    volume: 3600000,
    timestamp: new Date().toISOString(),
    dataSource: 'mock',
    marketStatus: 'simulated',
  },
  {
    symbol: 'ITC',
    companyName: 'ITC Limited',
    exchange: 'NSE',
    price: 454.3,
    change: 5.8,
    percentChange: 1.29,
    previousClose: 448.5,
    open: 451.9,
    high: 458.6,
    low: 449.8,
    volume: 2200000,
    timestamp: new Date().toISOString(),
    dataSource: 'mock',
    marketStatus: 'simulated',
  },
];

const getMockHistory = (symbol) => {
  const basePrice = mockStocks.find((stock) => stock.symbol === symbol)?.price || 100;
  const points = [];
  for (let i = 29; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const trend = Math.sin((i / 3) + (basePrice % 7)) * (basePrice * 0.014);
    const price = Number((basePrice + trend + i * 0.8).toFixed(2));
    points.push({
      date: date.toISOString(),
      price,
      volume: Math.round((basePrice * 1000) + i * 1200),
    });
  }

  return points;
};

const getMarketStocks = async (query = '') => {
  const normalized = query.trim();
  const list = mockStocks.filter((stock) => {
    if (!normalized) return true;
    const haystack = `${stock.symbol} ${stock.companyName}`.toLowerCase();
    return haystack.includes(normalized.toLowerCase());
  });

  return list.map((stock) => ({ ...stock, dataSource: 'mock' }));
};

const getMarketStockBySymbol = async (symbol) => {
  const normalized = symbol.toUpperCase();
  const stock = mockStocks.find((item) => item.symbol === normalized);
  if (!stock) return null;

  return { ...stock, history: getMockHistory(normalized), dataSource: 'mock' };
};

module.exports = {
  getMarketStocks,
  getMarketStockBySymbol,
  mockStocks,
};
