/**
 * TaskTable component — responsive table view for tasks with sorting and filters.
 */
import React, { useState, useMemo } from 'react';
import { Trash2, Edit2, ChevronUp, ChevronDown, Search, Filter } from 'lucide-react';
import { getStatusColor, getPriorityColor, formatDate } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';

const TaskTable = ({ tasks, onEdit, onDelete }) => {
  const { isManager } = useAuth();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filtered = useMemo(() => {
    let result = [...tasks];
    if (search) {
      result = result.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase()) ||
        t.assignedToName?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterStatus) result = result.filter(t => t.status === filterStatus);
    if (filterPriority) result = result.filter(t => t.priority === filterPriority);

    result.sort((a, b) => {
      let aVal = a[sortField], bVal = b[sortField];
      if (sortField === 'dueDate') {
        aVal = aVal ? new Date(aVal) : new Date('9999');
        bVal = bVal ? new Date(bVal) : new Date('9999');
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [tasks, search, filterStatus, filterPriority, sortField, sortDir]);

  const SortIcon = ({ field }) => (
    <span className="ml-1 inline-flex flex-col">
      <ChevronUp className={`h-3 w-3 ${sortField === field && sortDir === 'asc' ? 'text-purple-600' : 'text-gray-300'}`} />
      <ChevronDown className={`h-3 w-3 -mt-1 ${sortField === field && sortDir === 'desc' ? 'text-purple-600' : 'text-gray-300'}`} />
    </span>
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Statuses</option>
          {['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'].map(s => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Priorities</option>
          {['LOW', 'MEDIUM', 'HIGH'].map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <span className="flex items-center text-sm text-gray-500 dark:text-gray-400 px-2">
          {filtered.length} tasks
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
              {[
                { label: 'Task', field: 'title' },
                { label: 'Status', field: 'status' },
                { label: 'Priority', field: 'priority' },
                { label: 'Assigned To', field: 'assignedToName' },
                { label: 'Due Date', field: 'dueDate' },
                { label: 'Category', field: 'categoryName' },
                { label: 'Actions', field: null },
              ].map(col => (
                <th
                  key={col.label}
                  onClick={() => col.field && handleSort(col.field)}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${col.field ? 'cursor-pointer hover:text-gray-900 dark:hover:text-white' : ''}`}
                >
                  <span className="flex items-center">
                    {col.label}
                    {col.field && <SortIcon field={col.field} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400 dark:text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Filter className="h-8 w-8 opacity-30" />
                    <p className="text-sm">No tasks found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map(task => (
                <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3.5">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{task.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getStatusColor(task.status)}`}>
                      {task.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400">
                    {task.assignedToName || '—'}
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {formatDate(task.dueDate)}
                  </td>
                  <td className="px-4 py-3.5">
                    {task.categoryName && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-medium">
                        {task.categoryName}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onEdit(task)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      {isManager() && (
                        <button
                          onClick={() => onDelete(task.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
