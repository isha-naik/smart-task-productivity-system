/**
 * App.jsx — Root component with React Router configuration.
 * Implements protected routes and role-based access control.
 */
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import AdminPanel from './pages/AdminPanel';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Loader from './components/Loader';

// ========================================
// Protected Route wrapper
// ========================================
const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, user, isInitialized } = useAuth();

  if (!isInitialized) return <Loader fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

// ========================================
// App Layout — Navbar + Sidebar + Content
// ========================================
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' ||
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          onMenuToggle={() => setSidebarOpen(true)}
          darkMode={darkMode}
          onDarkModeToggle={() => setDarkMode(d => !d)}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

// ========================================
// Root App component
// ========================================
const AppRoutes = () => {
  const { isAuthenticated, user, isInitialized } = useAuth();

  if (!isInitialized) return <Loader fullScreen />;

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to={user?.role === 'MANAGER' ? '/admin' : '/dashboard'} replace /> : <Login />
      } />
      <Route path="/register" element={
        isAuthenticated ? <Navigate to={user?.role === 'MANAGER' ? '/admin' : '/dashboard'} replace /> : <Register />
      } />

      {/* Protected routes — require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
      </Route>

      {/* Default redirect */}
      <Route path="/" element={
        <Navigate to={isAuthenticated ? (user?.role === 'MANAGER' ? '/admin' : '/dashboard') : '/login'} replace />
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1f2937',
              color: '#f9fafb',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '500',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
