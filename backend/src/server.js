require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const stockRoutes = require('./routes/stockRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const orderRoutes = require('./routes/orderRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  const configuredOrigin = process.env.CLIENT_URL;
  if (configuredOrigin && origin === configuredOrigin) {
    return true;
  }

  return /^(http|https):\/\/(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+)(:\d+)?$/.test(origin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan('dev'));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/profile', profileRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'StockMarket Pro API is running' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong on the server' });
});

if (require.main === module) {
  const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  };

  startServer().catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
}

module.exports = app;
