const express = require('express');
const { body } = require('express-validator');
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} = require('../controllers/project.controller');
const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation rules
const createProjectValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long'),
  body('description')
    .optional()
    .trim()
];

const updateProjectValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Project title cannot be empty')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long'),
  body('description')
    .optional()
    .trim()
];

const addMemberValidation = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid user ID')
];

// Routes
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', createProjectValidation, validate, createProject);
router.put('/:id', updateProjectValidation, validate, updateProject);
router.delete('/:id', deleteProject);
router.post('/:id/members', addMemberValidation, validate, addMember);
router.delete('/:id/members/:userId', removeMember);

module.exports = router;
