import api from './api';

// Get all projects
export const getAllProjects = async () => {
  const response = await api.get('/projects');
  // Backend returns { success, data: { projects: [...] } }
  return response.data.data.projects || [];
};

// Get project by ID
export const getProjectById = async (projectId) => {
  const response = await api.get(`/projects/${projectId}`);
  // Backend returns { success, data: { project: {...} } }
  return response.data.data.project || response.data.data;
};

// Create project
export const createProject = async (projectData) => {
  const response = await api.post('/projects', projectData);
  // Backend returns { success, data: { project: {...} } }
  return response.data.data.project || response.data.data;
};

// Update project
export const updateProject = async (projectId, projectData) => {
  const response = await api.put(`/projects/${projectId}`, projectData);
  // Backend returns { success, data: { project: {...} } }
  return response.data.data.project || response.data.data;
};

// Delete project
export const deleteProject = async (projectId) => {
  const response = await api.delete(`/projects/${projectId}`);
  return response.data;
};