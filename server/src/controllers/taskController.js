const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

const taskController = {
  // Get all tasks for a project
  getProjectTasks: async (req, res) => {
    try {
      const { id } = req.params;

      // Verify project ownership
      const project = await Project.findOne({
        where: { id, owner_id: req.user.id }
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const tasks = await Task.findAll({
        where: { project_id: id },
        include: [
          {
            model: User,
            as: 'assignee',
            attributes: ['id', 'username', 'email']
          }
        ],
        order: [['position', 'ASC']]
      });

      res.json({ tasks });
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({ error: 'Server error fetching tasks' });
    }
  },

  // Create a new task
  createTask: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, status, project_id, assigned_to, position } = req.body;

      // Verify project ownership
      const project = await Project.findOne({
        where: { id: project_id, owner_id: req.user.id }
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // Get max position for new task
      const maxPosition = await Task.max('position', {
        where: { project_id, status: status || 'todo' }
      });

      const task = await Task.create({
        title,
        description,
        status: status || 'todo',
        project_id,
        assigned_to: assigned_to || null,
        position: position !== undefined ? position : (maxPosition || 0) + 1
      });

      const newTask = await Task.findByPk(task.id, {
        include: [
          {
            model: User,
            as: 'assignee',
            attributes: ['id', 'username', 'email']
          }
        ]
      });

      res.status(201).json({
        message: 'Task created successfully',
        task: newTask
      });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ error: 'Server error creating task' });
    }
  },

  // Update a task
  updateTask: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { title, description, status, assigned_to, position } = req.body;

      // Find task and verify project ownership
      const task = await Task.findByPk(id, {
        include: [
          {
            model: Project,
            as: 'project',
            where: { owner_id: req.user.id }
          }
        ]
      });

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      await task.update({
        title: title !== undefined ? title : task.title,
        description: description !== undefined ? description : task.description,
        status: status !== undefined ? status : task.status,
        assigned_to: assigned_to !== undefined ? assigned_to : task.assigned_to,
        position: position !== undefined ? position : task.position
      });

      const updatedTask = await Task.findByPk(task.id, {
        include: [
          {
            model: User,
            as: 'assignee',
            attributes: ['id', 'username', 'email']
          }
        ]
      });

      res.json({
        message: 'Task updated successfully',
        task: updatedTask
      });
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ error: 'Server error updating task' });
    }
  },

  // Delete a task
  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;

      // Find task and verify project ownership
      const task = await Task.findByPk(id, {
        include: [
          {
            model: Project,
            as: 'project',
            where: { owner_id: req.user.id }
          }
        ]
      });

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      await task.destroy();

      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({ error: 'Server error deleting task' });
    }
  }
};

module.exports = taskController;
