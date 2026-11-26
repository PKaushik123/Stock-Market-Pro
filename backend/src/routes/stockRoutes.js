const express = require('express');
const { param } = require('express-validator');
const { getStocks, getStockBySymbol, getStockHistory } = require('../controllers/stockController');

const router = express.Router();

router.get('/', getStocks);
router.get('/search', getStocks);
router.get(
  '/:symbol',
  [param('symbol').isLength({ min: 1 }).withMessage('Stock symbol is required')],
  getStockBySymbol,
);
router.get(
  '/:symbol/history',
  [param('symbol').isLength({ min: 1 }).withMessage('Stock symbol is required')],
  getStockHistory,
);

module.exports = router;
