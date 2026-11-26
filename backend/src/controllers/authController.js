const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Watchlist = require('../models/Watchlist');
const { errorResponse, successResponse } = require('../utils/apiResponse');

const generateToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array());
  }

  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 'User with this email already exists', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), passwordHash });

    await Portfolio.create({ userId: user._id, cashBalance: 1000, totalInvested: 0, holdings: [] });
    await Watchlist.create({ userId: user._id, stockSymbols: [] });

    const token = generateToken(user);
    return successResponse(res, { token, user: { id: user._id, name: user.name, email: user.email } }, 201);
  } catch (error) {
    return errorResponse(res, 'Unable to register user', 500, [error.message]);
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array());
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const token = generateToken(user);
    return successResponse(res, { token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    return errorResponse(res, 'Unable to login', 500, [error.message]);
  }
};

const me = async (req, res) => {
  return successResponse(res, {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
};

const changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array());
  }

  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return errorResponse(res, 'Current password is incorrect', 400);
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return successResponse(res, { message: 'Password updated successfully' });
  } catch (error) {
    return errorResponse(res, 'Unable to update password', 500, [error.message]);
  }
};

module.exports = { register, login, me, changePassword };
