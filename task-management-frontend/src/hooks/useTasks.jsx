/**
 * Custom hook for task data management.
 * Handles fetching, creating, updating, and deleting tasks.
 */
import { useState, useCallback } from 'react';
import { taskAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await taskAPI.getAll();
      setTasks(res.data.data || []);
    } catch (err) {
      setError('Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (taskData) => {
    try {
      const res = await taskAPI.create(taskData);
      setTasks(prev => [...prev, res.data.data]);
      toast.success('Task created successfully!');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create task';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const res = await taskAPI.update(id, taskData);
      setTasks(prev => prev.map(t => t.id === id ? res.data.data : t));
      toast.success('Task updated!');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update task';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskAPI.delete(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success('Task deleted');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete task';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  return { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask };
};
