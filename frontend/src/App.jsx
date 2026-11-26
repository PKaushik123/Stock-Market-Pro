import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import MarketsPage from './pages/MarketsPage';
import StockDetailPage from './pages/StockDetailPage';
import WatchlistPage from './pages/WatchlistPage';
import PortfolioPage from './pages/PortfolioPage';
import OrdersPage from './pages/OrdersPage';
import NewsPage from './pages/NewsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import AppLayout from './layouts/AppLayout';
import { AuthProvider } from './context/AuthContext.jsx';
import { useAuth } from './context/useAuth.js';
import AcademyPage from './pages/AcademyPage';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route element={<AppLayout />}>
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/markets" element={<ProtectedRoute><MarketsPage /></ProtectedRoute>} />
      <Route path="/stocks/:symbol" element={<ProtectedRoute><StockDetailPage /></ProtectedRoute>} />
      <Route path="/watchlist" element={<ProtectedRoute><WatchlistPage /></ProtectedRoute>} />
      <Route path="/portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
      <Route path="/news" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/academy" element={<ProtectedRoute><AcademyPage /></ProtectedRoute>} />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
