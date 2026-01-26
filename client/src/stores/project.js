import { defineStore } from 'pinia';
import api from '../services/api';

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [],
    currentProject: null,
    loading: false,
    error: null
  }),
  
  getters: {
    getProjectById: (state) => (id) => {
      return state.projects.find(p => p.id === id);
    }
  },
  
  actions: {
    async fetchProjects() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.projects.getAll();
        this.projects = response.data.projects;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch projects';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchProject(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.projects.get(id);
        this.currentProject = response.data.project;
        return response.data.project;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch project';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async createProject(data) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.projects.create(data);
        this.projects.unshift(response.data.project);
        return response.data.project;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to create project';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updateProject(id, data) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.projects.update(id, data);
        const index = this.projects.findIndex(p => p.id === id);
        if (index !== -1) {
          this.projects[index] = response.data.project;
        }
        if (this.currentProject?.id === id) {
          this.currentProject = response.data.project;
        }
        return response.data.project;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to update project';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteProject(id) {
      this.loading = true;
      this.error = null;
      
      try {
        await api.projects.delete(id);
        this.projects = this.projects.filter(p => p.id !== id);
        if (this.currentProject?.id === id) {
          this.currentProject = null;
        }
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to delete project';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
