const { validationResult } = require('express-validator');
const Watchlist = require('../models/Watchlist');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ userId: req.user._id });
    return successResponse(res, { stockSymbols: watchlist ? watchlist.stockSymbols : [] });
  } catch (error) {
    return errorResponse(res, 'Unable to fetch watchlist', 500, [error.message]);
  }
};

const addToWatchlist = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array());
  }

  try {
    const { symbol } = req.body;
    let watchlist = await Watchlist.findOne({ userId: req.user._id });

    if (!watchlist) {
      watchlist = await Watchlist.create({ userId: req.user._id, stockSymbols: [] });
    }

    const normalized = symbol.toUpperCase();
    if (watchlist.stockSymbols.includes(normalized)) {
      return errorResponse(res, 'Stock already in watchlist', 409);
    }

    watchlist.stockSymbols.push(normalized);
    await watchlist.save();

    return successResponse(res, { stockSymbols: watchlist.stockSymbols }, 201);
  } catch (error) {
    return errorResponse(res, 'Unable to add to watchlist', 500, [error.message]);
  }
};

const removeFromWatchlist = async (req, res) => {
  try {
    const { symbol } = req.params;
    const watchlist = await Watchlist.findOne({ userId: req.user._id });

    if (!watchlist) {
      return successResponse(res, { stockSymbols: [] });
    }

    watchlist.stockSymbols = watchlist.stockSymbols.filter((entry) => entry !== symbol.toUpperCase());
    await watchlist.save();

    return successResponse(res, { stockSymbols: watchlist.stockSymbols });
  } catch (error) {
    return errorResponse(res, 'Unable to remove from watchlist', 500, [error.message]);
  }
};

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };
