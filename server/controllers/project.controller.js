const Project = require('../models/Project');
const Task = require('../models/Task');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * Get all projects for current user
 * GET /api/projects
 */
const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { members: req.user._id }
      ]
    })
      .populate('owner', 'username email avatar')
      .populate('members', 'username email avatar')
      .sort({ createdAt: -1 });

    sendSuccess(res, { projects }, 'Projects retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get project by ID with tasks
 * GET /api/projects/:id
 */
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'username email avatar')
      .populate('members', 'username email avatar');

    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    // Check if user is a member of the project
    const isMember = project.members.some(
      member => member._id.toString() === req.user._id.toString()
    );

    if (!isMember && project.owner._id.toString() !== req.user._id.toString()) {
      return sendError(res, 'Not authorized to view this project', 403);
    }

    // Get tasks for this project
    const tasks = await Task.find({ project: project._id })
      .populate('assignedTo', 'username email avatar')
      .populate('createdBy', 'username email avatar')
      .sort({ order: 1 });

    sendSuccess(res, { project, tasks }, 'Project retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Create new project
 * POST /api/projects
 */
const createProject = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const project = await Project.create({
      title,
      description,
      owner: req.user._id,
      members: [req.user._id]
    });

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'username email avatar')
      .populate('members', 'username email avatar');

    // Emit socket event
    if (req.io) {
      req.io.emit('project_updated', { project: populatedProject });
    }

    sendSuccess(res, { project: populatedProject }, 'Project created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Update project
 * PUT /api/projects/:id
 */
const updateProject = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    // Only owner can update project
    if (project.owner.toString() !== req.user._id.toString()) {
      return sendError(res, 'Not authorized to update this project', 403);
    }

    if (title) project.title = title;
    if (description !== undefined) project.description = description;

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'username email avatar')
      .populate('members', 'username email avatar');

    // Emit socket event
    if (req.io) {
      req.io.to(`project_${project._id}`).emit('project_updated', { project: updatedProject });
    }

    sendSuccess(res, { project: updatedProject }, 'Project updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete project
 * DELETE /api/projects/:id
 */
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    // Only owner can delete project
    if (project.owner.toString() !== req.user._id.toString()) {
      return sendError(res, 'Not authorized to delete this project', 403);
    }

    // Delete all tasks associated with this project
    await Task.deleteMany({ project: project._id });

    await Project.findByIdAndDelete(req.params.id);

    sendSuccess(res, null, 'Project deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Add member to project
 * POST /api/projects/:id/members
 */
const addMember = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    // Only owner can add members
    if (project.owner.toString() !== req.user._id.toString()) {
      return sendError(res, 'Not authorized to add members to this project', 403);
    }

    // Check if user is already a member
    if (project.members.includes(userId)) {
      return sendError(res, 'User is already a member', 400);
    }

    project.members.push(userId);
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'username email avatar')
      .populate('members', 'username email avatar');

    // Emit socket event
    if (req.io) {
      req.io.to(`project_${project._id}`).emit('project_updated', { project: updatedProject });
    }

    sendSuccess(res, { project: updatedProject }, 'Member added successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Remove member from project
 * DELETE /api/projects/:id/members/:userId
 */
const removeMember = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    // Only owner can remove members
    if (project.owner.toString() !== req.user._id.toString()) {
      return sendError(res, 'Not authorized to remove members from this project', 403);
    }

    // Cannot remove owner
    if (userId === project.owner.toString()) {
      return sendError(res, 'Cannot remove project owner', 400);
    }

    project.members = project.members.filter(
      member => member.toString() !== userId
    );
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'username email avatar')
      .populate('members', 'username email avatar');

    // Emit socket event
    if (req.io) {
      req.io.to(`project_${project._id}`).emit('project_updated', { project: updatedProject });
    }

    sendSuccess(res, { project: updatedProject }, 'Member removed successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember
};
