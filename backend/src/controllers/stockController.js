const { validationResult } = require('express-validator');
const marketDataService = require('../services/marketDataService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getStocks = async (req, res) => {
  try {
    const { q = '' } = req.query;
    const stocks = await marketDataService.getMarketStocks(q);
    return successResponse(res, { stocks });
  } catch (error) {
    return errorResponse(res, 'Unable to fetch stock market data', 500, [error.message]);
  }
};

const getStockBySymbol = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array());
  }

  try {
    const stock = await marketDataService.getMarketStockBySymbol(req.params.symbol);
    if (!stock) {
      return errorResponse(res, 'Stock not found', 404);
    }

    return successResponse(res, stock);
  } catch (error) {
    return errorResponse(res, 'Unable to fetch stock details', 500, [error.message]);
  }
};

const getStockHistory = async (req, res) => {
  const { symbol } = req.params;
  const { range = '1M' } = req.query;

  try {
    const stock = await marketDataService.getMarketStockBySymbol(symbol);
    if (!stock) {
      return errorResponse(res, 'Stock not found', 404);
    }

    return successResponse(res, {
      symbol,
      range,
      history: stock.history || [],
      dataSource: 'mock',
      marketStatus: 'simulated',
    });
  } catch (error) {
    return errorResponse(res, 'Unable to fetch stock history', 500, [error.message]);
  }
};

module.exports = { getStocks, getStockBySymbol, getStockHistory };
