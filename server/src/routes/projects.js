const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const projectController = require('../controllers/projectController');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all projects
router.get('/', projectController.getAllProjects);

// Get single project
router.get('/:id', projectController.getProject);

// Create project
router.post('/',
  [
    body('name').trim().notEmpty().withMessage('Project name is required'),
    body('description').optional().trim()
  ],
  projectController.createProject
);

// Update project
router.put('/:id',
  [
    body('name').optional().trim().notEmpty().withMessage('Project name cannot be empty'),
    body('description').optional().trim()
  ],
  projectController.updateProject
);

// Delete project
router.delete('/:id', projectController.deleteProject);

module.exports = router;
