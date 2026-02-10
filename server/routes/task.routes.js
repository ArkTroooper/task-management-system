const express = require('express');
const { body } = require('express-validator');
const {
  getTasksByProject,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  assignTask
} = require('../controllers/task.controller');
const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation rules
const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long'),
  body('description')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(['todo', 'inprogress', 'done'])
    .withMessage('Status must be one of: todo, inprogress, done'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),
  body('project')
    .notEmpty()
    .withMessage('Project is required')
    .isMongoId()
    .withMessage('Invalid project ID'),
  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Invalid user ID'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
];

const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Task title cannot be empty')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long'),
  body('description')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(['todo', 'inprogress', 'done'])
    .withMessage('Status must be one of: todo, inprogress, done'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),
  body('assignedTo')
    .optional()
    .custom((value) => value === null || value === '' || /^[0-9a-fA-F]{24}$/.test(value))
    .withMessage('Invalid user ID'),
  body('dueDate')
    .optional()
    .custom((value) => value === null || value === '' || !isNaN(Date.parse(value)))
    .withMessage('Invalid date format')
];

const moveTaskValidation = [
  body('status')
    .optional()
    .isIn(['todo', 'inprogress', 'done'])
    .withMessage('Status must be one of: todo, inprogress, done'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer')
];

const assignTaskValidation = [
  body('userId')
    .optional()
    .custom((value) => value === null || value === '' || /^[0-9a-fA-F]{24}$/.test(value))
    .withMessage('Invalid user ID')
];

// Routes
router.get('/project/:projectId', getTasksByProject);
router.get('/:id', getTaskById);
router.post('/', createTaskValidation, validate, createTask);
router.put('/:id', updateTaskValidation, validate, updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/move', moveTaskValidation, validate, moveTask);
router.patch('/:id/assign', assignTaskValidation, validate, assignTask);

module.exports = router;
