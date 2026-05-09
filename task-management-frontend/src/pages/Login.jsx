/**
 * Login page — modern gradient card UI with JWT authentication.
 * Features form validation, loading state, and role-specific demo credentials.
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Loader2, CheckSquare, Zap } from 'lucide-react';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await login(form.email, form.password);
    if (result.success) {
      navigate(result.user.role === 'MANAGER' ? '/admin' : '/dashboard');
    }
  };

  const fillDemo = (type) => {
    if (type === 'manager') setForm({ email: 'manager@taskmanager.com', password: 'manager123' });
    else setForm({ email: 'priya@employee.com', password: 'employee123' });
  };

  const inputClass = (field) => `w-full px-4 py-3 text-sm rounded-xl border ${
    errors[field]
      ? 'border-red-400 focus:ring-red-400 bg-red-50'
      : 'border-gray-200 focus:ring-purple-500 bg-white'
  } focus:outline-none focus:ring-2 transition-all`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/30 mb-4">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
            TaskFlow
          </h1>
          <p className="text-gray-500 text-sm mt-1">Smart Productivity Management</p>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-purple-500/10 p-8 border border-white/50">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-6">Sign in to your workspace</p>

          {/* Demo Credentials Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <button
              type="button"
              onClick={() => fillDemo('manager')}
              className="px-3 py-2 text-xs rounded-xl bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 font-medium transition-colors"
            >
              👔 Demo Manager
            </button>
            <button
              type="button"
              onClick={() => fillDemo('employee')}
              className="px-3 py-2 text-xs rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-medium transition-colors"
            >
              👤 Demo Employee
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                placeholder="you@company.com"
                className={inputClass('email')}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="Enter your password"
                  className={`${inputClass('password')} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 disabled:opacity-60 shadow-lg shadow-purple-500/25 transition-all mt-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-purple-600 hover:text-purple-700 font-semibold">
              Create one
            </Link>
          </p>
        </div>

        {/* Demo info */}
        <div className="mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 text-xs text-gray-500 text-center">
          <p className="font-medium text-gray-600 mb-1">Demo Credentials</p>
          <p>Manager: manager@taskmanager.com / manager123</p>
          <p>Employee: priya@employee.com / employee123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
