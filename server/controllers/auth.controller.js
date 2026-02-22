const bcrypt = require('bcrypt');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return sendError(res, 'Email already registered', 400);
      }
      if (existingUser.username === username) {
        return sendError(res, 'Username already taken', 400);
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    // Generate token
    const token = generateToken({ id: user._id, email: user.email });

    sendSuccess(res, { user, token }, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return sendError(res, 'Invalid credentials', 401);
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return sendError(res, 'Invalid credentials', 401);
    }

    // Generate token
    const token = generateToken({ id: user._id, email: user.email });

    // Remove password from response
    user.password = undefined;

    sendSuccess(res, { user, token }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

/**
 * Verify JWT token
 * GET /api/auth/verify
 */
const verify = async (req, res, next) => {
  try {
    // User is already attached to req by auth middleware
    sendSuccess(res, { user: req.user }, 'Token is valid');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  verify
};
