const Portfolio = require('../models/Portfolio');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (!portfolio) {
      const created = await Portfolio.create({ userId: req.user._id, cashBalance: 1000, totalInvested: 0, holdings: [] });
      return successResponse(res, created);
    }

    return successResponse(res, portfolio);
  } catch (error) {
    return errorResponse(res, 'Unable to fetch portfolio', 500, [error.message]);
  }
};

const getHoldings = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    return successResponse(res, { holdings: portfolio ? portfolio.holdings : [] });
  } catch (error) {
    return errorResponse(res, 'Unable to fetch holdings', 500, [error.message]);
  }
};

module.exports = { getPortfolio, getHoldings };
