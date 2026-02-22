// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Task Priorities
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

// Task Status
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
};

// Column Definitions
export const COLUMNS = {
  TODO: {
    id: 'todo',
    title: 'To Do',
    status: TASK_STATUS.TODO,
  },
  IN_PROGRESS: {
    id: 'in_progress',
    title: 'In Progress',
    status: TASK_STATUS.IN_PROGRESS,
  },
  DONE: {
    id: 'done',
    title: 'Done',
    status: TASK_STATUS.DONE,
  },
};

// Priority Colors
export const PRIORITY_COLORS = {
  [TASK_PRIORITY.LOW]: 'bg-blue-500',
  [TASK_PRIORITY.MEDIUM]: 'bg-yellow-500',
  [TASK_PRIORITY.HIGH]: 'bg-red-500',
};

// Toast Types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
};
