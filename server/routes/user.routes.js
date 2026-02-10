const express = require('express');
const { body } = require('express-validator');
const {
  getProfile,
  updateProfile,
  getUserById,
  deleteUser
} = require('../controllers/user.controller');
const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation rules
const updateProfileValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('avatar')
    .optional()
    .trim()
];

// Routes
router.get('/profile', getProfile);
router.put('/profile', updateProfileValidation, validate, updateProfile);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);

module.exports = router;
