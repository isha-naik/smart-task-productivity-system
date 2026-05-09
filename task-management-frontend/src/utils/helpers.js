/**
 * Helper utilities for formatting, colors, and display logic.
 */

/** Get color classes for task status badges */
export const getStatusColor = (status) => {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400',
    IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
    COMPLETED: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400',
    OVERDUE: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/** Get color classes for task priority badges */
export const getPriorityColor = (priority) => {
  const colors = {
    LOW: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300',
    MEDIUM: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400',
    HIGH: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400',
  };
  return colors[priority] || 'bg-gray-100 text-gray-800';
};

/** Get dot color for status indicators */
export const getStatusDot = (status) => {
  const dots = {
    PENDING: 'bg-yellow-500',
    IN_PROGRESS: 'bg-blue-500',
    COMPLETED: 'bg-green-500',
    OVERDUE: 'bg-red-500',
  };
  return dots[status] || 'bg-gray-500';
};

/** Format date for display */
export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

/** Format relative date (e.g., "2 days ago") */
export const formatRelativeDate = (date) => {
  if (!date) return '—';
  const now = new Date();
  const target = new Date(date);
  const diffMs = now - target;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 0) return `In ${Math.abs(diffDays)} days`;
  return `${diffDays} days ago`;
};

/** Check if a date is overdue */
export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date() ;
};

/** Get priority sort order */
export const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };

/** Truncate long text */
export const truncate = (text, maxLength = 80) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

/** Get user initials for avatar */
export const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};
