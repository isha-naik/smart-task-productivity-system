/**
 * Dashboard page — main analytics hub for both Managers and Employees.
 * Displays task metrics, charts, AI insights, and recent activity.
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { analyticsAPI, taskAPI } from '../services/api';
import DashboardCards from '../components/DashboardCards';
import AnalyticsChart from '../components/AnalyticsChart';
import InsightAlert from '../components/InsightAlert';
import Loader from '../components/Loader';
import { getStatusColor, getPriorityColor, formatDate, getInitials } from '../utils/helpers';
import { RefreshCw, ListTodo, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, isManager } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const [analyticsRes, tasksRes] = await Promise.all([
        analyticsAPI.get(),
        taskAPI.getAll(),
      ]);
      setAnalytics(analyticsRes.data.data);
      const tasks = tasksRes.data.data || [];
      // Show 5 most recent tasks
      setRecentTasks(tasks.slice(0, 5));
    } catch (err) {
      if (!silent) toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <Loader fullScreen text="Loading dashboard..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isManager() ? '📊 Team Dashboard' : '🎯 My Dashboard'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]}! Here's your productivity overview.
          </p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Metric Cards */}
      <DashboardCards analytics={analytics} loading={false} />

      {/* Charts full-width */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-purple-600" />
          Analytics Overview
        </h2>
        <AnalyticsChart analytics={analytics} loading={false} />
      </div>

      {/* AI Insights full-width below charts */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-purple-600">🤖</span>
          AI Productivity Insights
        </h2>
        <InsightAlert />
      </div>

      {/* Recent Tasks */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <ListTodo className="h-4 w-4 text-purple-600" />
            Recent Tasks
          </h2>
          <a href={isManager() ? '/admin' : '/tasks'} className="text-xs text-purple-600 hover:text-purple-700 font-medium">
            View all →
          </a>
        </div>

        {recentTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <ListTodo className="h-10 w-10 opacity-30 mb-3" />
            <p className="text-sm">No tasks yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {recentTasks.map(task => (
              <div key={task.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {getInitials(task.assignedToName || task.createdByName || 'U')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{task.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {task.assignedToName ? `Assigned to ${task.assignedToName}` : 'Unassigned'} · {formatDate(task.dueDate)}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getStatusColor(task.status)}`}>
                    {task.status?.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
