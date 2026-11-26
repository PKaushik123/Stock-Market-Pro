import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-slate-100">
    <h1 className="text-6xl font-bold text-cyan-400">404</h1>
    <p className="mt-4 text-xl text-slate-300">This page could not be found.</p>
    <Link to="/" className="mt-6 rounded-xl bg-cyan-500 px-5 py-3 font-medium text-slate-950 hover:bg-cyan-400">
      Back to home
    </Link>
  </div>
);

export default NotFoundPage;
