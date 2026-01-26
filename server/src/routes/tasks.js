const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const taskController = require('../controllers/taskController');
const { operationsLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// All routes require authentication and rate limiting
router.use(authMiddleware);
router.use(operationsLimiter);

// Get tasks for a project
router.get('/project/:id', taskController.getProjectTasks);

// Create task
router.post('/',
  [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('description').optional().trim(),
    body('status').optional().isIn(['todo', 'in_progress', 'done']).withMessage('Invalid status'),
    body('project_id').isInt().withMessage('Valid project ID is required'),
    body('assigned_to').optional().isInt().withMessage('Invalid user ID'),
    body('position').optional().isInt().withMessage('Position must be an integer')
  ],
  taskController.createTask
);

// Update task
router.put('/:id',
  [
    body('title').optional().trim().notEmpty().withMessage('Task title cannot be empty'),
    body('description').optional().trim(),
    body('status').optional().isIn(['todo', 'in_progress', 'done']).withMessage('Invalid status'),
    body('assigned_to').optional().isInt().withMessage('Invalid user ID'),
    body('position').optional().isInt().withMessage('Position must be an integer')
  ],
  taskController.updateTask
);

// Delete task
router.delete('/:id', taskController.deleteTask);

module.exports = router;
