/**
 * Navbar component — sticky top navigation with user info, dark mode toggle,
 * notifications panel, and logout.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, Moon, Sun, Menu, CheckSquare, AlertTriangle, Clock, CheckCircle2, X, RefreshCw } from 'lucide-react';
import { getInitials, formatDate } from '../utils/helpers';
import { taskAPI } from '../services/api';

// ─── Build notifications from task list ───────────────────────────────────────
const buildNotifications = (tasks) => {
  const today = new Date();
  const in3Days = new Date(today);
  in3Days.setDate(today.getDate() + 3);
  const notes = [];

  tasks.forEach((task) => {
    const due = task.dueDate ? new Date(task.dueDate) : null;

    // Overdue
    if (task.status === 'OVERDUE' || (due && due < today && task.status !== 'COMPLETED')) {
      notes.push({
        id: `overdue-${task.id}`,
        type: 'overdue',
        icon: AlertTriangle,
        iconClass: 'text-red-500',
        bgClass: 'bg-red-50 dark:bg-red-900/20',
        title: 'Task Overdue',
        message: `"${task.title}" is past its due date.`,
        time: formatDate(task.dueDate),
      });
    }
    // Due within 3 days
    else if (due && due >= today && due <= in3Days && task.status !== 'COMPLETED') {
      notes.push({
        id: `soon-${task.id}`,
        type: 'due_soon',
        icon: Clock,
        iconClass: 'text-yellow-500',
        bgClass: 'bg-yellow-50 dark:bg-yellow-900/20',
        title: 'Due Soon',
        message: `"${task.title}" is due on ${formatDate(task.dueDate)}.`,
        time: formatDate(task.dueDate),
      });
    }
    // Recently completed (status = COMPLETED)
    else if (task.status === 'COMPLETED') {
      notes.push({
        id: `done-${task.id}`,
        type: 'completed',
        icon: CheckCircle2,
        iconClass: 'text-green-500',
        bgClass: 'bg-green-50 dark:bg-green-900/20',
        title: 'Task Completed',
        message: `"${task.title}" has been marked complete.`,
        time: formatDate(task.dueDate),
      });
    }
  });

  // Sort: overdue first, then due_soon, then completed
  const order = { overdue: 0, due_soon: 1, completed: 2 };
  notes.sort((a, b) => order[a.type] - order[b.type]);

  return notes.slice(0, 10); // cap at 10
};

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = ({ onMenuToggle, darkMode, onDarkModeToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu]     = useState(false);
  const [showNotifs, setShowNotifs]         = useState(false);
  const [notifications, setNotifications]   = useState([]);
  const [dismissed, setDismissed]           = useState([]);   // ids the user cleared
  const [notifsLoading, setNotifsLoading]   = useState(false);

  const bellRef  = useRef(null);
  const notifRef = useRef(null);

  // Fetch tasks and derive notifications
  const loadNotifications = async () => {
    setNotifsLoading(true);
    try {
      const res = await taskAPI.getAll();
      const all = buildNotifications(res.data.data || []);
      setNotifications(all);
    } catch {
      // silently fail — notifications are non-critical
    } finally {
      setNotifsLoading(false);
    }
  };

  // Load on mount
  useEffect(() => { loadNotifications(); }, []);

  // Close notification panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        notifRef.current && !notifRef.current.contains(e.target) &&
        bellRef.current  && !bellRef.current.contains(e.target)
      ) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const visibleNotifs = notifications.filter((n) => !dismissed.includes(n.id));
  const unreadCount   = visibleNotifs.filter((n) => n.type !== 'completed').length;

  const dismiss = (id) => setDismissed((prev) => [...prev, id]);
  const clearAll = () => setDismissed(notifications.map((n) => n.id));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 h-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">

        {/* ── Left: Logo + Hamburger ── */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
              <CheckSquare className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent hidden sm:block">
              TaskFlow
            </span>
          </div>
        </div>

        {/* ── Right: Actions ── */}
        <div className="flex items-center gap-2">

          {/* Dark Mode */}
          <button
            onClick={onDarkModeToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode
              ? <Sun  className="h-5 w-5 text-yellow-500" />
              : <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />}
          </button>

          {/* ── Notification Bell ── */}
          <div className="relative">
            <button
              ref={bellRef}
              onClick={() => { setShowNotifs((v) => !v); setShowUserMenu(false); }}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Panel */}
            {showNotifs && (
              <div
                ref={notifRef}
                className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 animate-fade-in overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-medium">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={loadNotifications}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="Refresh"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 text-gray-500 ${notifsLoading ? 'animate-spin' : ''}`} />
                    </button>
                    {visibleNotifs.length > 0 && (
                      <button
                        onClick={clearAll}
                        className="text-xs text-purple-600 hover:text-purple-700 px-2 py-1 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors font-medium"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
                  {notifsLoading ? (
                    <div className="flex items-center justify-center py-8 text-gray-400">
                      <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                      <span className="text-sm">Loading...</span>
                    </div>
                  ) : visibleNotifs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-500">
                      <Bell className="h-8 w-8 opacity-20 mb-2" />
                      <p className="text-sm font-medium">You're all caught up!</p>
                      <p className="text-xs mt-0.5">No new notifications</p>
                    </div>
                  ) : (
                    visibleNotifs.map((notif) => (
                      <div
                        key={notif.id}
                        className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group ${notif.bgClass}`}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          <notif.icon className={`h-4 w-4 ${notif.iconClass}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 dark:text-white">{notif.title}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">{notif.message}</p>
                          {notif.time && (
                            <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
                          )}
                        </div>
                        <button
                          onClick={() => dismiss(notif.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex-shrink-0 mt-0.5"
                          title="Dismiss"
                        >
                          <X className="h-3 w-3 text-gray-500" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                {visibleNotifs.length > 0 && (
                  <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-xs text-gray-400 text-center">
                      {visibleNotifs.length} notification{visibleNotifs.length !== 1 ? 's' : ''}
                      · Based on your current tasks
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── User Avatar Dropdown ── */}
          <div className="relative">
            <button
              onClick={() => { setShowUserMenu((v) => !v); setShowNotifs(false); }}
              className="flex items-center gap-2 p-1.5 pl-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                {getInitials(user?.name)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {user?.role === 'MANAGER' ? '👔 Manager' : '👤 Employee'}
                </p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close user menu on outside click */}
      {showUserMenu && (
        <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
      )}
    </nav>
  );
};

export default Navbar;
