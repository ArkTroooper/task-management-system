import api from './api';
import { STORAGE_KEYS } from '../utils/constants';

// Login user
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  // Backend wraps in { success, data: { token, user } }
  console.log('🔍 Login response:', response);
  console.log('🔍 response.data:', response.data);
  console.log('🔍 response.data.data:', response.data?.data);
  const { token, user } = response.data?.data || response.data || {};
  console.log('🔍 Extracted token:', token);
  console.log('🔍 Extracted user:', user);
  
  if (token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        console.log('✅ Token saved to localStorage');
  } else{
        console.error('❌ No token found in response!');
  }
  return response.data?.data || response.data;
};

// Register user
export const register = async (username, email, password) => {
  const response = await api.post('/auth/register', { username, email, password });
  const { token, user } = response.data?.data || response.data || {};
  if (token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }
  return response.data?.data || response.data;
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
    // Backend wraps response in { success, data: { user }, message }
    return response.data.data.user;  // Extract the user object
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
