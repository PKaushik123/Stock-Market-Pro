import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/useAuth.js';

const SignupPage = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const nextErrors = {};
    const trimmedName = form.name.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName || trimmedName.length < 2) {
      nextErrors.name = 'Name must be at least 2 characters long.';
    }

    if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters long.';
    }

    if (form.confirmPassword.length < 6) {
      nextErrors.confirmPassword = 'Please confirm your password.';
    }

    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const passwordStrength = form.password.length >= 8 ? 'Strong' : form.password.length >= 6 ? 'Medium' : 'Weak';

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
      const { data } = await api.post('/auth/register', { name: form.name.trim(), email: form.email.trim(), password: form.password });
      if (data.success) {
        setToken(data.data.token);
        setUser(data.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-glow">
        <h1 className="text-3xl font-bold text-white">Create your account</h1>
        <p className="mt-2 text-sm text-slate-400">Start paper trading with a virtual starting balance.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="signup-name" className="mb-2 block text-sm text-slate-300">Full name</label>
            <input id="signup-name" name="name" value={form.name} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400" />
            {fieldErrors.name && <p className="mt-1 text-xs text-red-300">{fieldErrors.name}</p>}
          </div>
          <div>
            <label htmlFor="signup-email" className="mb-2 block text-sm text-slate-300">Email</label>
            <input id="signup-email" name="email" type="email" value={form.email} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400" />
            {fieldErrors.email && <p className="mt-1 text-xs text-red-300">{fieldErrors.email}</p>}
          </div>
          <div>
            <label htmlFor="signup-password" className="mb-2 block text-sm text-slate-300">Password</label>
            <div className="relative">
              <input id="signup-password" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-white outline-none focus:border-cyan-400" />
              <button type="button" className="absolute right-3 top-3 text-slate-400" onClick={() => setShowPassword((value) => !value)}>
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {fieldErrors.password && <p className="mt-1 text-xs text-red-300">{fieldErrors.password}</p>}
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Password strength</span>
              <span className={passwordStrength === 'Strong' ? 'text-emerald-400' : passwordStrength === 'Medium' ? 'text-yellow-400' : 'text-red-400'}>{passwordStrength}</span>
            </div>
          </div>
          <div>
            <label htmlFor="signup-confirm-password" className="mb-2 block text-sm text-slate-300">Confirm password</label>
            <input id="signup-confirm-password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400" />
            {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-red-300">{fieldErrors.confirmPassword}</p>}
          </div>

          {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</div>}

          <button type="submit" disabled={loading} className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="font-medium text-cyan-300">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
