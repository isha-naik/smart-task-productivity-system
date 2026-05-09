/**
 * Authentication utilities for JWT token management.
 * Handles token storage, retrieval, and user session management.
 */

const TOKEN_KEY = 'taskflow_token';
const USER_KEY = 'taskflow_user';

/** Store JWT token in localStorage */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/** Retrieve JWT token from localStorage */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/** Remove JWT token from localStorage */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/** Store user data in localStorage */
export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/** Retrieve user data from localStorage */
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

/** Remove user data from localStorage */
export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

/** Check if user is authenticated */
export const isAuthenticated = () => {
  return !!getToken();
};

/** Check if current user is a Manager */
export const isManager = () => {
  const user = getUser();
  return user?.role === 'MANAGER';
};

/** Check if current user is an Employee */
export const isEmployee = () => {
  const user = getUser();
  return user?.role === 'EMPLOYEE';
};

/** Clear all auth data (logout) */
export const clearAuth = () => {
  removeToken();
  removeUser();
};

/** Decode JWT payload (without verification) */
export const decodeToken = (token) => {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
};

/** Check if JWT token is expired */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  return decoded.exp * 1000 < Date.now();
};
