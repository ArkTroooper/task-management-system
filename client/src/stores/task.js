import { defineStore } from 'pinia';
import api from '../services/api';
import socket from '../services/socket';

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
    loading: false,
    error: null
  }),
  
  getters: {
    tasksByStatus: (state) => (status) => {
      return state.tasks.filter(t => t.status === status);
    },
    
    todoTasks: (state) => state.tasks.filter(t => t.status === 'todo'),
    inProgressTasks: (state) => state.tasks.filter(t => t.status === 'in_progress'),
    doneTasks: (state) => state.tasks.filter(t => t.status === 'done')
  },
  
  actions: {
    async fetchTasks(projectId) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.tasks.getByProject(projectId);
        this.tasks = response.data.tasks;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch tasks';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async createTask(data) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.tasks.create(data);
        this.tasks.push(response.data.task);
        
        // Emit socket event
        socket.emitTaskCreated(data.project_id, response.data.task);
        
        return response.data.task;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to create task';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updateTask(id, data) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.tasks.update(id, data);
        const index = this.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
          this.tasks[index] = response.data.task;
        }
        
        // Emit socket event
        const task = this.tasks.find(t => t.id === id);
        if (task) {
          socket.emitTaskUpdated(task.project_id, response.data.task);
        }
        
        return response.data.task;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to update task';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteTask(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const task = this.tasks.find(t => t.id === id);
        await api.tasks.delete(id);
        this.tasks = this.tasks.filter(t => t.id !== id);
        
        // Emit socket event
        if (task) {
          socket.emitTaskDeleted(task.project_id, id);
        }
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to delete task';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    // Handle real-time updates
    addTask(task) {
      const exists = this.tasks.find(t => t.id === task.id);
      if (!exists) {
        this.tasks.push(task);
      }
    },
    
    updateTaskLocal(task) {
      const index = this.tasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        this.tasks[index] = task;
      }
    },
    
    removeTask(taskId) {
      this.tasks = this.tasks.filter(t => t.id !== taskId);
    }
  }
});
