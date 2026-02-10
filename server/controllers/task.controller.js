const Task = require('../models/Task');
const Project = require('../models/Project');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * Get all tasks for a project
 * GET /api/tasks/project/:projectId
 */
const getTasksByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    // Verify user has access to the project
    const project = await Project.findById(projectId);
    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    const isMember = project.members.some(
      member => member.toString() === req.user._id.toString()
    );

    if (!isMember && project.owner.toString() !== req.user._id.toString()) {
      return sendError(res, 'Not authorized to view tasks for this project', 403);
    }

    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'username email avatar')
      .populate('createdBy', 'username email avatar')
      .sort({ status: 1, order: 1 });

    sendSuccess(res, { tasks }, 'Tasks retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get task by ID
 * GET /api/tasks/:id
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'username email avatar')
      .populate('createdBy', 'username email avatar')
      .populate('project', 'title');

    if (!task) {
      return sendError(res, 'Task not found', 404);
    }

    // Verify user has access to the project
    const project = await Project.findById(task.project._id);
    const isMember = project.members.some(
      member => member.toString() === req.user._id.toString()
    );

    if (!isMember && project.owner.toString() !== req.user._id.toString()) {
      return sendError(res, 'Not authorized to view this task', 403);
    }

    sendSuccess(res, { task }, 'Task retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Create new task
 * POST /api/tasks
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, project, assignedTo, dueDate } = req.body;

    // Verify user has access to the project
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return sendError(res, 'Project not found', 404);
    }

    const isMember = projectDoc.members.some(
      member => member.toString() === req.user._id.toString()
    );

    if (!isMember && projectDoc.owner.toString() !== req.user._id.toString()) {
      return sendError(res, 'Not authorized to create tasks in this project', 403);
    }

    // Get the highest order number for this status
    const lastTask = await Task.findOne({ project, status: status || 'todo' })
      .sort({ order: -1 });
    const order = lastTask ? lastTask.order + 1 : 0;

    const task = await Task.create({
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      project,
      assignedTo: assignedTo || null,
      dueDate: dueDate || null,
      order,
      createdBy: req.user._id
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'username email avatar')
      .populate('createdBy', 'username email avatar');

    // Emit socket event
    if (req.io) {
      req.io.to(`project_${project}`).emit('task_created', { 
        task: populatedTask, 
        projectId: project 
      });
    }

    sendSuccess(res, { task: populatedTask }, 'Task created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Update task
 * PUT /api/tasks/:id
 */
const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, assignedTo, dueDate } = req.body;
    
    const task = await Task.findById(req.params.id);
    if (!task) {
      return sendError(res, 'Task not found', 404);
    }

    // Verify user has access to the project
    const project = await Project.findById(task.project);
    const isMember = project.members.some(
      member => member.toString() === req.user._id.toString()
    );

    if (!isMember && project.owner.toString() !== req.user._id.toString()) {
      return sendError(res, 'Not authorized to update this task', 403);
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
    if (dueDate !== undefined) task.dueDate = dueDate || null;

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'username email avatar')
      .populate('createdBy', 'username email avatar');

    // Emit socket event
    if (req.io) {
      req.io.to(`project_${task.project}`).emit('task_updated', { 
        task: updatedTask, 
        projectId: task.project 
      });
    }

    sendSuccess(res, { task: updatedTask }, 'Task updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete task
 * DELETE /api/tasks/:id
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return sendError(res, 'Task not found', 404);
    }

    // Verify user has access to the project
    const project = await Project.findById(task.project);
    const isMember = project.members.some(
      member => member.toString() === req.user._id.toString()
    );

    if (!isMember && project.owner.toString() !== req.user._id.toString()) {
      return sendError(res, 'Not authorized to delete this task', 403);
    }

    const projectId = task.project;
    const taskId = task._id;

    await Task.findByIdAndDelete(req.params.id);

    // Emit socket event
    if (req.io) {
      req.io.to(`project_${projectId}`).emit('task_deleted', { 
        taskId, 
        projectId 
      });
    }

    sendSuccess(res, null, 'Task deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Move task to different status/column
 * PATCH /api/tasks/:id/move
 */
const moveTask = async (req, res, next) => {
  try {
    const { status, order } = req.body;
    
    const task = await Task.findById(req.params.id);
    if (!task) {
      return sendError(res, 'Task not found', 404);
    }

    // Verify user has access to the project
    const project = await Project.findById(task.project);
    const isMember = project.members.some(
      member => member.toString() === req.user._id.toString()
    );

    if (!isMember && project.owner.toString() !== req.user._id.toString()) {
      return sendError(res, 'Not authorized to move this task', 403);
    }

    const oldStatus = task.status;
    
    if (status) task.status = status;
    if (order !== undefined) task.order = order;

    await task.save();

    // If status changed, reorder other tasks
    if (status && oldStatus !== status) {
      // Update order of other tasks in the new status using bulkWrite
      const tasksInNewStatus = await Task.find({ 
        project: task.project, 
        status,
        _id: { $ne: task._id }
      }).sort({ order: 1 });

      if (tasksInNewStatus.length > 0) {
        const bulkOps = tasksInNewStatus
          .filter(t => t.order >= order)
          .map((t, index) => ({
            updateOne: {
              filter: { _id: t._id },
              update: { $set: { order: t.order >= order ? index + 1 + (index >= order ? 1 : 0) : t.order } }
            }
          }));

        if (bulkOps.length > 0) {
          await Task.bulkWrite(bulkOps);
        }
      }
    }

    const movedTask = await Task.findById(task._id)
      .populate('assignedTo', 'username email avatar')
      .populate('createdBy', 'username email avatar');

    // Emit socket event
    if (req.io) {
      req.io.to(`project_${task.project}`).emit('task_moved', { 
        task: movedTask, 
        projectId: task.project 
      });
    }

    sendSuccess(res, { task: movedTask }, 'Task moved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Assign task to user
 * PATCH /api/tasks/:id/assign
 */
const assignTask = async (req, res, next) => {
  try {
    const { userId } = req.body;
    
    const task = await Task.findById(req.params.id);
    if (!task) {
      return sendError(res, 'Task not found', 404);
    }

    // Verify user has access to the project
    const project = await Project.findById(task.project);
    const isMember = project.members.some(
      member => member.toString() === req.user._id.toString()
    );

    if (!isMember && project.owner.toString() !== req.user._id.toString()) {
      return sendError(res, 'Not authorized to assign this task', 403);
    }

    // Verify the assignee is a member of the project
    if (userId) {
      const isAssigneeMember = project.members.some(
        member => member.toString() === userId
      );
      if (!isAssigneeMember && project.owner.toString() !== userId) {
        return sendError(res, 'Cannot assign task to non-member', 400);
      }
    }

    task.assignedTo = userId || null;
    await task.save();

    const assignedTask = await Task.findById(task._id)
      .populate('assignedTo', 'username email avatar')
      .populate('createdBy', 'username email avatar');

    // Emit socket event
    if (req.io) {
      req.io.to(`project_${task.project}`).emit('task_updated', { 
        task: assignedTask, 
        projectId: task.project 
      });
    }

    sendSuccess(res, { task: assignedTask }, 'Task assigned successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasksByProject,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  assignTask
};
