/**
 * AdminPanel page — Manager-only panel for team overview, task assignment, and category management.
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { userAPI, categoryAPI } from '../services/api';
import TaskForm from '../components/TaskForm';
import ConfirmDialog from '../components/ConfirmDialog';
import TaskTable from '../components/TaskTable';
import Loader from '../components/Loader';
import { getStatusColor, getPriorityColor, getInitials } from '../utils/helpers';
import {
  Users, Plus, Trash2, FolderPlus, Shield,
  CheckCircle2, Clock, AlertTriangle, ListTodo
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const { isManager, user } = useAuth();
  const navigate = useNavigate();
  const { tasks, loading: tasksLoading, fetchTasks, createTask, updateTask, deleteTask } = useTasks();
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('tasks');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  useEffect(() => {
    if (!isManager()) { navigate('/dashboard'); return; }
    fetchTasks();
    userAPI.getEmployees().then(r => setEmployees(r.data.data || [])).catch(() => {});
    categoryAPI.getAll().then(r => setCategories(r.data.data || [])).catch(() => {});
  }, []);

  const handleCreate = async (data) => {
    setFormLoading(true);
    const result = await createTask(data);
    setFormLoading(false);
    if (result.success) { setFormOpen(false); setEditingTask(null); }
  };

  const handleEdit = (task) => { setEditingTask(task); setFormOpen(true); };

  const handleUpdate = async (data) => {
    if (!editingTask) return;
    setFormLoading(true);
    const result = await updateTask(editingTask.id, { ...data, id: editingTask.id });
    setFormLoading(false);
    if (result.success) { setFormOpen(false); setEditingTask(null); }
  };

  const handleDelete = (id) => setConfirmDelete(id);

  const confirmDoDelete = async () => {
    if (confirmDelete) { await deleteTask(confirmDelete); setConfirmDelete(null); }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) { toast.error('Category name is required'); return; }
    setAddingCategory(true);
    try {
      const res = await categoryAPI.create({ categoryName: newCategory.trim() });
      setCategories(prev => [...prev, res.data.data]);
      setNewCategory('');
      toast.success('Category added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add category');
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await categoryAPI.delete(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success('Category deleted');
    } catch { toast.error('Failed to delete category'); }
  };

  // Employee task stats
  const getEmployeeStats = (empId) => {
    const empTasks = tasks.filter(t => t.assignedToId === empId);
    return {
      total: empTasks.length,
      completed: empTasks.filter(t => t.status === 'COMPLETED').length,
      overdue: empTasks.filter(t => t.status === 'OVERDUE').length,
    };
  };

  const tabs = [
    { id: 'tasks', label: 'All Tasks', icon: ListTodo, count: tasks.length },
    { id: 'team', label: 'Team', icon: Users, count: employees.length },
    { id: 'categories', label: 'Categories', icon: FolderPlus, count: categories.length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="h-6 w-6 text-purple-600" />
            Manager Panel
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Team overview · Assign tasks · Manage categories
          </p>
        </div>
        <button
          onClick={() => { setEditingTask(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 shadow-md shadow-purple-500/20 transition-all"
        >
          <Plus className="h-4 w-4" />
          Assign Task
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === tab.id
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab: All Tasks */}
      {activeTab === 'tasks' && (
        <div>
          {tasksLoading ? (
            <Loader text="Loading tasks..." />
          ) : (
            <TaskTable tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>
      )}

      {/* Tab: Team */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.length === 0 ? (
            <div className="col-span-3 flex flex-col items-center justify-center py-16 text-gray-400">
              <Users className="h-12 w-12 opacity-20 mb-3" />
              <p>No employees registered yet</p>
            </div>
          ) : (
            employees.map(emp => {
              const stats = getEmployeeStats(emp.id);
              return (
                <div key={emp.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                      {getInitials(emp.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{emp.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[160px]">{emp.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Total', value: stats.total, icon: ListTodo, color: 'text-purple-600' },
                      { label: 'Done', value: stats.completed, icon: CheckCircle2, color: 'text-green-600' },
                      { label: 'Overdue', value: stats.overdue, icon: AlertTriangle, color: 'text-red-500' },
                    ].map(stat => (
                      <div key={stat.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2.5 text-center">
                        <stat.icon className={`h-4 w-4 ${stat.color} mx-auto mb-1`} />
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Completion</span>
                      <span>{stats.total > 0 ? Math.round(stats.completed / stats.total * 100) : 0}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${stats.total > 0 ? (stats.completed / stats.total * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab: Categories */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          {/* Add Category */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Add New Category</h3>
            <div className="flex gap-3">
              <input
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                placeholder="Category name (e.g. DevOps, Testing...)"
                className="flex-1 px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleAddCategory}
                disabled={addingCategory}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3 group hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.categoryName}</span>
                </div>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="col-span-4 flex flex-col items-center justify-center py-12 text-gray-400">
                <FolderPlus className="h-10 w-10 opacity-20 mb-2" />
                <p className="text-sm">No categories yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Task Form Modal */}
      <TaskForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditingTask(null); }}
        onSubmit={editingTask ? handleUpdate : handleCreate}
        initialData={editingTask}
        loading={formLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Delete Task"
        message="This will permanently delete the task. This action cannot be undone."
        onConfirm={confirmDoDelete}
        onCancel={() => setConfirmDelete(null)}
        confirmLabel="Delete"
      />
    </div>
  );
};

export default AdminPanel;
