const express = require('express');
const { body, param } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const { getWatchlist, addToWatchlist, removeFromWatchlist } = require('../controllers/watchlistController');

const router = express.Router();

router.use(authMiddleware);
router.get('/', getWatchlist);
router.post(
  '/',
  [body('symbol').isString().trim().notEmpty().withMessage('Stock symbol is required')],
  addToWatchlist,
);
router.delete('/:symbol', [param('symbol').notEmpty().withMessage('Stock symbol is required')], removeFromWatchlist);

module.exports = router;
