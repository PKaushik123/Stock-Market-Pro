const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const Portfolio = require('../models/Portfolio');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array());
  }

  try {
    const { symbol, companyName, side, quantity, referencePrice, orderType = 'MARKET', limitPrice } = req.body;
    const normalizedQty = Number(quantity);
    const normalizedPrice = Number(referencePrice);

    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (!portfolio) {
      return errorResponse(res, 'Portfolio not initialized', 404);
    }

    let executionPrice = normalizedPrice;
    let status = 'EXECUTED';

    if (orderType === 'LIMIT') {
      const normalizedLimit = Number(limitPrice);
      if (!normalizedLimit || normalizedLimit <= 0) {
        return errorResponse(res, 'Limit price is required', 400);
      }

      const canExecute = side === 'BUY'
        ? normalizedPrice <= normalizedLimit
        : normalizedPrice >= normalizedLimit;

      if (!canExecute) {
        status = 'PENDING';
      } else {
        executionPrice = normalizedLimit;
      }
    }

    const totalValue = Number((normalizedQty * executionPrice).toFixed(2));

    if (status === 'PENDING') {
      const pendingOrder = await Order.create({
        userId: req.user._id,
        symbol: symbol.toUpperCase(),
        companyName,
        side,
        quantity: normalizedQty,
        referencePrice: normalizedPrice,
        limitPrice: Number(limitPrice),
        orderType,
        totalValue,
        status,
        isSimulated: true,
      });

      return successResponse(res, { order: pendingOrder, portfolio }, 201);
    }

    if (side === 'BUY') {
      if (portfolio.cashBalance < totalValue) {
        return errorResponse(res, 'Insufficient virtual cash balance', 400);
      }

      const existingHolding = portfolio.holdings.find((holding) => holding.symbol === symbol.toUpperCase());
      const newQuantity = existingHolding ? existingHolding.quantity + normalizedQty : normalizedQty;
      const newAverage = existingHolding
        ? ((existingHolding.averageBuyPrice * existingHolding.quantity) + totalValue) / newQuantity
        : executionPrice;

      if (existingHolding) {
        existingHolding.quantity = newQuantity;
        existingHolding.averageBuyPrice = newAverage;
      } else {
        portfolio.holdings.push({
          symbol: symbol.toUpperCase(),
          companyName,
          quantity: normalizedQty,
          averageBuyPrice: executionPrice,
        });
      }

      portfolio.cashBalance = Number((portfolio.cashBalance - totalValue).toFixed(2));
      portfolio.totalInvested = Number((portfolio.totalInvested + totalValue).toFixed(2));
    }

    if (side === 'SELL') {
      const holding = portfolio.holdings.find((item) => item.symbol === symbol.toUpperCase());
      if (!holding || holding.quantity < normalizedQty) {
        return errorResponse(res, 'Insufficient quantity to sell', 400);
      }

      const soldCostBasis = holding.averageBuyPrice * normalizedQty;
      holding.quantity -= normalizedQty;
      if (holding.quantity === 0) {
        portfolio.holdings = portfolio.holdings.filter((item) => item.symbol !== symbol.toUpperCase());
      }

      portfolio.cashBalance = Number((portfolio.cashBalance + totalValue).toFixed(2));
      portfolio.totalInvested = Number(Math.max(0, portfolio.totalInvested - soldCostBasis).toFixed(2));
    }

    await portfolio.save();

    const order = await Order.create({
      userId: req.user._id,
      symbol: symbol.toUpperCase(),
      companyName,
      side,
      quantity: normalizedQty,
      referencePrice: normalizedPrice,
      limitPrice: orderType === 'LIMIT' ? Number(limitPrice) : undefined,
      orderType,
      totalValue,
      status,
      isSimulated: true,
    });

    return successResponse(res, { order, portfolio }, 201);
  } catch (error) {
    return errorResponse(res, 'Unable to create order', 500, [error.message]);
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return successResponse(res, { orders });
  } catch (error) {
    return errorResponse(res, 'Unable to fetch orders', 500, [error.message]);
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    return successResponse(res, order);
  } catch (error) {
    return errorResponse(res, 'Unable to fetch order', 500, [error.message]);
  }
};

module.exports = { createOrder, getOrders, getOrderById };
