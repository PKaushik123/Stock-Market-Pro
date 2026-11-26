const express = require('express');
const authMiddleware = require('../middleware/auth');
const { getPortfolio, getHoldings } = require('../controllers/portfolioController');

const router = express.Router();

router.use(authMiddleware);
router.get('/', getPortfolio);
router.get('/holdings', getHoldings);

module.exports = router;
