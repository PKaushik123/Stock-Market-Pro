const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const { getProfile, updateProfile } = require('../controllers/profileController');

const router = express.Router();

router.use(authMiddleware);
router.get('/', getProfile);
router.put(
  '/',
  [body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters long')],
  updateProfile,
);

module.exports = router;
