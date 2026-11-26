const User = require('../models/User');
const { validationResult } = require('express-validator');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    return successResponse(res, user);
  } catch (error) {
    return errorResponse(res, 'Unable to fetch profile', 500, [error.message]);
  }
};

const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array());
  }

  try {
    const { name } = req.body;
    const user = await User.findById(req.user._id);
    user.name = name;
    await user.save();

    return successResponse(res, { id: user._id, name: user.name, email: user.email });
  } catch (error) {
    return errorResponse(res, 'Unable to update profile', 500, [error.message]);
  }
};

module.exports = { getProfile, updateProfile };
