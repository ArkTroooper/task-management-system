const bcrypt = require('bcrypt');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * Get current user profile
 * GET /api/users/profile
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    sendSuccess(res, { user }, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * PUT /api/users/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { username, email, avatar, password } = req.body;
    const updateData = {};

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (avatar !== undefined) updateData.avatar = avatar;

    // Hash new password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    sendSuccess(res, { user }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 * GET /api/users/:id
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    sendSuccess(res, { user }, 'User retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user account
 * DELETE /api/users/:id
 */
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Users can only delete their own account
    if (req.user._id.toString() !== userId) {
      return sendError(res, 'Not authorized to delete this account', 403);
    }

    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    sendSuccess(res, null, 'Account deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getUserById,
  deleteUser
};
