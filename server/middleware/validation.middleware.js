const { validationResult } = require('express-validator');
const { sendError } = require('../utils/responseHandler');

/**
 * Middleware to handle validation errors from express-validator
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg
    }));
    
    return sendError(res, 'Validation failed', 400, errorDetails);
  }
  
  next();
};

module.exports = validate;
