/**
 * Custom hook for authentication state management.
 * Provides user info, login/logout, and role checking.
 */
import { useState, useEffect, createContext, useContext } from 'react';
import { getUser, getToken, setToken, setUser, clearAuth, isTokenExpired } from '../utils/auth';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

// Auth Context
const AuthContext = createContext(null);

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(getUser());
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check token validity on mount
    const token = getToken();
    if (token && isTokenExpired(token)) {
      clearAuth();
      setUserState(null);
    }
    setIsInitialized(true);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { token, ...userData } = response.data.data;
      setToken(token);
      setUser(userData);
      setUserState(userData);
      toast.success(`Welcome back, ${userData.name}!`);
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role) => {
    setLoading(true);
    try {
      const response = await authAPI.register({ name, email, password, role });
      const { token, ...userData } = response.data.data;
      setToken(token);
      setUser(userData);
      setUserState(userData);
      toast.success(`Account created! Welcome, ${userData.name}!`);
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    setUserState(null);
    toast.success('Logged out successfully');
  };

  const isManager = () => user?.role === 'MANAGER';
  const isEmployee = () => user?.role === 'EMPLOYEE';

  return (
    <AuthContext.Provider value={{
      user, loading, isInitialized,
      login, register, logout,
      isManager, isEmployee,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export { AuthContext };
