/**
 * Register page — new user registration (Employee role by default).
 * Managers are provisioned via system seed data / organizational setup.
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Loader2, Zap } from 'lucide-react';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  // Role is always EMPLOYEE for self-registration; Managers are seeded/provisioned by org admin
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'EMPLOYEE' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await register(form.name, form.email, form.password, form.role);
    if (result.success) {
      navigate(result.user.role === 'MANAGER' ? '/admin' : '/dashboard');
    }
  };

  const inputClass = (field) => `w-full px-4 py-3 text-sm rounded-xl border ${
    errors[field]
      ? 'border-red-400 focus:ring-red-400 bg-red-50'
      : 'border-gray-200 focus:ring-purple-500 bg-white'
  } focus:outline-none focus:ring-2 transition-all`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/30 mb-4">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
            TaskFlow
          </h1>
          <p className="text-gray-500 text-sm mt-1">Create your account</p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-purple-500/10 p-8 border border-white/50">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Get started</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
              <input
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                placeholder="Your full name"
                className={inputClass('name')}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
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

            {/* Role Info — employees self-register; managers are provisioned */}
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
              <span className="text-blue-500 text-base mt-0.5">ℹ️</span>
              <div>
                <p className="text-xs font-semibold text-blue-700">Employee Account</p>
                <p className="text-xs text-blue-600 mt-0.5">
                  All new accounts are created as <strong>Employee</strong> by default. Manager accounts are set up by your organisation administrator.
                </p>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="Min. 6 characters"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={e => setForm({...form, confirmPassword: e.target.value})}
                placeholder="Repeat your password"
                className={inputClass('confirmPassword')}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 disabled:opacity-60 shadow-lg shadow-purple-500/25 transition-all mt-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
