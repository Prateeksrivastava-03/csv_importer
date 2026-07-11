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

const configuredOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

/**
 * Determines whether an origin should be trusted automatically in
 * development, without requiring the user to configure anything.
 *
 * Covers:
 * - http://localhost:PORT and http://127.0.0.1:PORT
 * - Private LAN IPs (the "Network" URL Next.js prints, e.g. http://192.168.x.x:3000),
 *   which browsers use when a device is opened via its local network address
 *   instead of "localhost" - a very common dev setup, especially on Windows
 *   or when testing from a phone/other device on the same Wi-Fi.
 */
function isTrustedDevOrigin(origin) {
  let hostname;
  try {
    hostname = new URL(origin).hostname;
  } catch {
    return false;
  }

  if (hostname === 'localhost' || hostname === '127.0.0.1') return true;

  // Private IPv4 ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
  const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!ipv4Match) return false;

  const [, a, b] = ipv4Match.map(Number);
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;

  return false;
}

app.use(
  cors({
    origin(origin, callback) {
      // Non-browser requests (curl, server-to-server, Postman) have no origin header.
      if (!origin) return callback(null, true);
      if (isTrustedDevOrigin(origin)) return callback(null, true);
      if (configuredOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin ${origin} is not allowed`));
    },
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
      console.log(`CSV Importer backend running on http://localhost:${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // eslint-disable-next-line no-console
        console.error(
          `\n[Startup error] Port ${PORT} is already in use.\n` +
            `This usually means another copy of this backend (or something else) is already running.\n\n` +
            `Fix it by either:\n` +
            `  1) Finding and closing whatever is using port ${PORT}:\n` +
            `       Windows:      netstat -ano | findstr :${PORT}   then   taskkill /PID <pid> /F\n` +
            `       macOS/Linux:  lsof -i :${PORT}                  then   kill -9 <pid>\n` +
            `  2) Or changing PORT in backend/.env to a free port and restarting.\n`
        );
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