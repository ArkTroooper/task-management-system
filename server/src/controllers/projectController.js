const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const User = require('../models/User');

const projectController = {
  // Get all projects for the authenticated user
  getAllProjects: async (req, res) => {
    try {
      const projects = await Project.findAll({
        where: { owner_id: req.user.id },
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'username', 'email']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      res.json({ projects });
    } catch (error) {
      console.error('Get projects error:', error);
      res.status(500).json({ error: 'Server error fetching projects' });
    }
  },

  // Get a single project by ID
  getProject: async (req, res) => {
    try {
      const { id } = req.params;

      const project = await Project.findOne({
        where: { id, owner_id: req.user.id },
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'username', 'email']
          }
        ]
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json({ project });
    } catch (error) {
      console.error('Get project error:', error);
      res.status(500).json({ error: 'Server error fetching project' });
    }
  },

  // Create a new project
  createProject: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description } = req.body;

      const project = await Project.create({
        name,
        description,
        owner_id: req.user.id
      });

      const newProject = await Project.findByPk(project.id, {
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'username', 'email']
          }
        ]
      });

      res.status(201).json({
        message: 'Project created successfully',
        project: newProject
      });
    } catch (error) {
      console.error('Create project error:', error);
      res.status(500).json({ error: 'Server error creating project' });
    }
  },

  // Update a project
  updateProject: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { name, description } = req.body;

      const project = await Project.findOne({
        where: { id, owner_id: req.user.id }
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      await project.update({ name, description });

      const updatedProject = await Project.findByPk(project.id, {
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'username', 'email']
          }
        ]
      });

      res.json({
        message: 'Project updated successfully',
        project: updatedProject
      });
    } catch (error) {
      console.error('Update project error:', error);
      res.status(500).json({ error: 'Server error updating project' });
    }
  },

  // Delete a project
  deleteProject: async (req, res) => {
    try {
      const { id } = req.params;

      const project = await Project.findOne({
        where: { id, owner_id: req.user.id }
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      await project.destroy();

      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      console.error('Delete project error:', error);
      res.status(500).json({ error: 'Server error deleting project' });
    }
  }
};

module.exports = projectController;
