/**
 * Axios API service configuration.
 * Handles all HTTP communication with the Spring Boot backend.
 * Automatically attaches JWT token to all authenticated requests.
 */
import axios from 'axios';
import { getToken, clearAuth } from '../utils/auth';

// Empty base URL routes all /api/* calls through the Vite proxy → no CORS issues.
// In production, set VITE_API_URL=https://your-backend.com
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Create configured Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Request interceptor — attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================
// Auth API endpoints
// ============================
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
};

// ============================
// Task API endpoints
// ============================
export const taskAPI = {
  getAll: () => api.get('/api/tasks'),
  getById: (id) => api.get(`/api/tasks/${id}`),
  create: (taskData) => api.post('/api/tasks', taskData),
  update: (id, taskData) => api.put(`/api/tasks/${id}`, taskData),
  delete: (id) => api.delete(`/api/tasks/${id}`),
};

// ============================
// Category API endpoints
// ============================
export const categoryAPI = {
  getAll: () => api.get('/api/categories'),
  create: (data) => api.post('/api/categories', data),
  delete: (id) => api.delete(`/api/categories/${id}`),
};

// ============================
// Analytics API endpoints
// ============================
export const analyticsAPI = {
  get: () => api.get('/api/analytics'),
};

// ============================
// Insights API endpoints
// ============================
export const insightsAPI = {
  get: () => api.get('/api/insights'),
};

// ============================
// User API endpoints
// ============================
export const userAPI = {
  getAll: () => api.get('/api/users'),
  getEmployees: () => api.get('/api/users/employees'),
  getById: (id) => api.get(`/api/users/${id}`),
};

export default api;
