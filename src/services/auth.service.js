import api from './api';
import { STORAGE_KEYS } from '../utils/constants';

// Login user
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
  }
  return response.data;
};

// Register user
export const register = async (username, email, password) => {
  const response = await api.post('/auth/register', { username, email, password });
  if (response.data.token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
  }
  return response.data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Verify token
export const verifyToken = async () => {
  try {
    const response = await api.get('/auth/verify');
    return response.data;
  } catch (error) {
    logout();
    throw error;
  }
};

// Get current user
export const getCurrentUser = () => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER);
  return userData ? JSON.parse(userData) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
};
