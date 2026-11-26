const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const { createOrder, getOrders, getOrderById } = require('../controllers/orderController');

const router = express.Router();

router.use(authMiddleware);
router.post(
  '/',
  [
    body('symbol').notEmpty().withMessage('Stock symbol is required'),
    body('companyName').notEmpty().withMessage('Company name is required'),
    body('side').isIn(['BUY', 'SELL']).withMessage('Order side must be BUY or SELL'),
    body('quantity').isFloat({ gt: 0 }).withMessage('Quantity must be greater than 0'),
    body('referencePrice').isFloat({ gt: 0 }).withMessage('Reference price must be greater than 0'),
    body('orderType').optional().isIn(['MARKET', 'LIMIT']).withMessage('Order type must be MARKET or LIMIT'),
    body('limitPrice').optional().isFloat({ gt: 0 }).withMessage('Limit price must be greater than 0'),
  ],
  createOrder,
);
router.get('/', getOrders);
router.get('/:id', getOrderById);

module.exports = router;
