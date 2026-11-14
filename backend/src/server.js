const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes');

// Import models for sync
const User = require('./models/User');
const ContactMessage = require('./models/ContactMessage');
const InterviewPrep = require('./models/InterviewPrep');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ COOP headers — must be first
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

// ✅ CORS — once only
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// ✅ Body parsing — once only
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// ✅ Diagnostics endpoint - helps debug configuration
app.get('/api/diagnostics', (req, res) => {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    server: {
      running: true,
      port: PORT,
      url: `http://localhost:${PORT}`,
    },
    config: {
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasDatabaseConfig: !!process.env.DB_HOST,
      hasJWTSecret: !!process.env.JWT_SECRET,
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    },
    database: {
      status: 'checking...',
    },
  };

  // Check database connection
  sequelize.authenticate()
    .then(() => {
      diagnostics.database.status = 'connected';
      diagnostics.database.host = process.env.DB_HOST;
      diagnostics.database.database = process.env.DB_NAME;
      res.json(diagnostics);
    })
    .catch((err) => {
      diagnostics.database.status = 'failed';
      diagnostics.database.error = err.message;
      res.status(503).json(diagnostics);
    });
});

// ✅ All API routes go through ./routes/index.js only
// Remove the duplicate app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api', apiRoutes);

// ✅ Error handler
app.use(errorHandler);

// ✅ 404 handler — must be last
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const startServer = async () => {
  try {
    console.log('Attempting to sync database...');
    await sequelize.sync({ alter: false, force: false });
    console.log('✓ Database synchronized');

    app.listen(PORT, () => {
      console.log(`✓ Server running at http://localhost:${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Server error:', error.message);
    process.exit(1);
  }
};

startServer();
module.exports = app;