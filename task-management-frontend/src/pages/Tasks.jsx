/**
 * Tasks page — full task management view with card/table toggle, create/edit/delete.
 * Available to both Managers and Employees.
 */
import React, { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import TaskCard from '../components/TaskCard';
import TaskTable from '../components/TaskTable';
import TaskForm from '../components/TaskForm';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';
import { Plus, LayoutGrid, List, CheckSquare } from 'lucide-react';

const Tasks = () => {
  const { isManager } = useAuth();
  const { tasks, loading, fetchTasks, createTask, updateTask, deleteTask } = useTasks();
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => { fetchTasks(); }, []);

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
    if (confirmDelete) {
      await deleteTask(confirmDelete);
      setConfirmDelete(null);
    }
  };

  const handleStatusChange = async (id, data) => {
    await updateTask(id, data);
  };

  const openCreate = () => { setEditingTask(null); setFormOpen(true); };

  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const pendingCount = tasks.filter(t => t.status === 'PENDING').length;
  const overdueCount = tasks.filter(t => t.status === 'OVERDUE').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-purple-600" />
            {isManager() ? 'All Tasks' : 'My Tasks'}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-gray-500">
              <span className="font-semibold text-gray-900 dark:text-white">{tasks.length}</span> total
            </span>
            <span className="text-xs text-green-600 font-medium">✓ {completedCount} done</span>
            <span className="text-xs text-yellow-600 font-medium">⏳ {pendingCount} pending</span>
            {overdueCount > 0 && (
              <span className="text-xs text-red-600 font-medium">⚠️ {overdueCount} overdue</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-gray-700 shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'cards' ? 'bg-white dark:bg-gray-700 shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          {/* Create Task Button */}
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 shadow-md shadow-purple-500/20 transition-all"
          >
            <Plus className="h-4 w-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Loader text="Loading tasks..." />
      ) : viewMode === 'table' ? (
        <TaskTable
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <div>
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <CheckSquare className="h-16 w-16 opacity-20 mb-4" />
              <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No tasks yet</p>
              <p className="text-sm text-gray-400 mb-6">Get started by creating your first task</p>
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-all"
              >
                <Plus className="h-4 w-4" />
                Create First Task
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
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
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={confirmDoDelete}
        onCancel={() => setConfirmDelete(null)}
        confirmLabel="Delete Task"
      />
    </div>
  );
};

export default Tasks;
