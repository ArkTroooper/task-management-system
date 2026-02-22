const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/responseHandler');
const User = require('../models/User');

/**
 * Middleware to verify JWT token and authenticate user
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'No token provided, authorization denied', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return sendError(res, 'User not found', 401);
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return sendError(res, 'Token has expired', 401);
      }
      return sendError(res, 'Token is not valid', 401);
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return sendError(res, 'Server error in authentication', 500);
  }
};

module.exports = authenticate;
