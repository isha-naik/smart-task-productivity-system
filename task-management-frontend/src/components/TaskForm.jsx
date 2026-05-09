/**
 * TaskForm component — modal form for creating and editing tasks.
 * Supports assigning to employees, setting priority, category, due date.
 */
import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { userAPI, categoryAPI } from '../services/api';
import toast from 'react-hot-toast';

const STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

const TaskForm = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const { isManager, user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    title: '', description: '', status: 'PENDING', priority: 'MEDIUM',
    dueDate: '', assignedToId: '', categoryId: '',
  });
  const [errors, setErrors] = useState({});

  // Populate form on edit
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'PENDING',
        priority: initialData.priority || 'MEDIUM',
        dueDate: initialData.dueDate || '',
        assignedToId: initialData.assignedToId || '',
        categoryId: initialData.categoryId || '',
      });
    } else {
      setForm({ title: '', description: '', status: 'PENDING', priority: 'MEDIUM', dueDate: '', assignedToId: '', categoryId: '' });
    }
    setErrors({});
  }, [initialData, isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (isManager()) userAPI.getEmployees().then(r => setEmployees(r.data.data || [])).catch(() => {});
      categoryAPI.getAll().then(r => setCategories(r.data.data || [])).catch(() => {});
    }
  }, [isOpen]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.status) errs.status = 'Status is required';
    if (!form.priority) errs.priority = 'Priority is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...form,
      assignedToId: form.assignedToId ? Number(form.assignedToId) : null,
      categoryId: form.categoryId ? Number(form.categoryId) : null,
      dueDate: form.dueDate || null,
    };
    onSubmit(payload);
  };

  if (!isOpen) return null;

  const inputClass = (field) => `w-full px-3.5 py-2.5 text-sm rounded-xl border ${
    errors[field]
      ? 'border-red-400 focus:ring-red-400'
      : 'border-gray-200 dark:border-gray-700 focus:ring-purple-500'
  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {initialData ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              placeholder="Enter task title..."
              className={inputClass('title')}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Task description (optional)..."
              rows={3}
              className={`${inputClass('description')} resize-none`}
            />
          </div>

          {/* Status + Priority row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={form.status}
                onChange={e => setForm({...form, status: e.target.value})}
                className={inputClass('status')}
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                value={form.priority}
                onChange={e => setForm({...form, priority: e.target.value})}
                className={inputClass('priority')}
              >
                {PRIORITIES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => setForm({...form, dueDate: e.target.value})}
                className={inputClass('dueDate')}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
              <select
                value={form.categoryId}
                onChange={e => setForm({...form, categoryId: e.target.value})}
                className={inputClass('categoryId')}
              >
                <option value="">No category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.categoryName}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Assign To (Manager only) */}
          {isManager() && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Assign To Employee
              </label>
              <select
                value={form.assignedToId}
                onChange={e => setForm({...form, assignedToId: e.target.value})}
                className={inputClass('assignedToId')}
              >
                <option value="">Unassigned</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>
                ))}
              </select>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 disabled:opacity-60 transition-all shadow-md shadow-purple-500/20"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {initialData ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
