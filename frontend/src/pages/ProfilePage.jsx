import { useEffect, useState } from 'react';
import api from '../services/api';

const ProfilePage = () => {
  const [profile, setProfile] = useState({ name: 'Trader', email: 'user@example.com' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setProfile(data?.data || { name: 'Trader', email: 'user@example.com' });
      } catch (error) {
        console.error('Failed to fetch profile', error);
        setProfile({ name: 'Trader', email: 'user@example.com' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h1 className="text-3xl font-bold text-white">Profile</h1>

      {loading ? (
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5 text-slate-300">
          Loading profile...
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Account</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{profile.name}</h2>
            <p className="mt-2 text-slate-400">{profile.email}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Preferences</p>
            <ul className="mt-3 space-y-2 text-slate-300">
              <li>Theme: Dark</li>
              <li>Currency: INR</li>
              <li>Data source: Simulated</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
