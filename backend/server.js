require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const uploadRoutes = require('./routes/uploadRoutes');
const importRoutes = require('./routes/importRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST'],
  })
);
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'csv-importer-backend' });
});

// API routes
app.use('/upload', uploadRoutes);
app.use('/import', importRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Centralized error handler (must be last)
app.use(errorHandler);

async function startServer() {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      // eslint-disable-next-line no-console
    
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // eslint-disable-next-line no-console
       
        process.exit(1);
      }

      // eslint-disable-next-line no-console
      console.error('[Startup error]', err);
      process.exit(1);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[Startup error]', err.message || err);
    process.exit(1);
  }
}

startServer();
