import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/useAuth.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!form.password.trim()) {
      nextErrors.password = 'Password is required.';
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email: form.email.trim(), password: form.password });
      if (data.success) {
        setToken(data.data.token);
        setUser(data.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-glow">
        <h1 className="text-3xl font-bold text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-400">Access your simulated trading dashboard.</p>
        <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="login-email" className="mb-2 block text-sm text-slate-300">Email</label>
            <input id="login-email" name="email" type="email" value={form.email} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400" />
            {fieldErrors.email && <p className="mt-1 text-xs text-red-300">{fieldErrors.email}</p>}
          </div>
          <div>
            <label htmlFor="login-password" className="mb-2 block text-sm text-slate-300">Password</label>
            <div className="relative">
              <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-white outline-none focus:border-cyan-400" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-3 text-slate-400">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {fieldErrors.password && <p className="mt-1 text-xs text-red-300">{fieldErrors.password}</p>}
          </div>

          {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</div>}

          <button type="submit" disabled={loading} className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-400">
          Don’t have an account? <Link to="/signup" className="font-medium text-cyan-300">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
