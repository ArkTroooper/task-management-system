import api from './api';

// Get all tasks for a project
export const getAllTasks = async (projectId) => {
  const response = await api.get(`/tasks?projectId=${projectId}`);
  return response.data;
};

// Get task by ID
export const getTaskById = async (taskId) => {
  const response = await api.get(`/tasks/${taskId}`);
  return response.data;
};

// Create task
export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

// Update task
export const updateTask = async (taskId, taskData) => {
  const response = await api.put(`/tasks/${taskId}`, taskData);
  return response.data;
};

// Delete task
export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};

// Move task to different status
export const moveTask = async (taskId, newStatus, newPosition) => {
  const response = await api.patch(`/tasks/${taskId}/move`, {
    status: newStatus,
    position: newPosition,
  });
  return response.data;
};
