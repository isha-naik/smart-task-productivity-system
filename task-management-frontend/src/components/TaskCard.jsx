/**
 * TaskCard component — displays a single task as a styled card with actions.
 */
import React from 'react';
import { Calendar, User, Trash2, Edit2, CheckCircle } from 'lucide-react';
import { getStatusColor, getPriorityColor, formatDate, truncate } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const { isManager } = useAuth();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-fade-in group">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug flex-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {task.title}
        </h3>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
            title="Edit task"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          {isManager() && (
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Delete task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
          {truncate(task.description, 90)}
        </p>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getStatusColor(task.status)}`}>
          {task.status?.replace('_', ' ')}
        </span>
        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        {task.categoryName && (
          <span className="text-xs px-2.5 py-1 rounded-full border border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800 font-medium">
            {task.categoryName}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex flex-col gap-1">
          {task.assignedToName && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <User className="h-3 w-3" />
              <span>{task.assignedToName}</span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>

        {/* Quick complete button for non-completed tasks */}
        {task.status !== 'COMPLETED' && (
          <button
            onClick={() => onStatusChange(task.id, { ...task, status: 'COMPLETED' })}
            className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 px-2 py-1 rounded-lg transition-colors"
            title="Mark as complete"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Done
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
