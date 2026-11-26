import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Wallet, Bell, UserCircle2, LayoutDashboard, Search, Newspaper, Menu, GraduationCap, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/useAuth.js';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/markets', label: 'Markets', icon: Search },
  { to: '/watchlist', label: 'Watchlist', icon: Bell },
  { to: '/portfolio', label: 'Portfolio', icon: Wallet },
  { to: '/orders', label: 'Orders', icon: TrendingUp },
  { to: '/academy', label: 'Academy', icon: GraduationCap },
  { to: '/news', label: 'News', icon: Newspaper },
];

const AppLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 lg:px-6">
          <Link to="/dashboard" className="flex items-center gap-3 font-semibold tracking-wide text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
              <BarChart3 className="h-5 w-5" />
            </div>
            <span className="hidden sm:inline">StockMarket Pro</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                    isActive ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-300 xl:inline">
              Paper trading
            </span>
            <NavLink
              to="/profile"
              aria-label="Profile"
              className="hidden rounded-xl border border-slate-700 p-2 text-slate-300 hover:text-white sm:block"
            >
              <UserCircle2 className="h-5 w-5" />
            </NavLink>
            <button
              onClick={handleLogout}
              className="hidden rounded-xl bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 sm:block"
            >
              Logout
            </button>
            <button
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-label="Toggle navigation"
              className="rounded-xl border border-slate-700 p-2 text-slate-200 lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t border-slate-800 px-4 py-3 lg:hidden">
            <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-2">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-xl px-3 py-3 text-sm ${
                      isActive ? 'bg-slate-800 text-cyan-300' : 'text-slate-400'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
              <NavLink
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm text-slate-400"
              >
                <UserCircle2 className="h-4 w-4" />
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="rounded-xl bg-cyan-500 px-3 py-3 text-sm font-semibold text-slate-950"
              >
                Logout
              </button>
            </div>
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-6 lg:px-6 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
