const express = require('express');
const { body } = require('express-validator');
const { register, login, me, changePassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  register,
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login,
);

router.get('/me', authMiddleware, me);

router.put(
  '/change-password',
  authMiddleware,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
  ],
  changePassword,
);

module.exports = router;
