// @module api | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const routes = require('./src/routes');
const { errorMiddleware } = require('./src/middleware/error.middleware');
const { sendError } = require('./src/utils/response');
const { checkDatabaseConnection } = require('./src/config/database');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
if (process.env.NODE_ENV !== 'test') app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.get('/health', (req, res) => res.status(200).json({ success: true, message: 'Vendora API is healthy.', data: { service: 'vendora-backend', database: 'mongodb' } }));
app.use('/api', async (req, res, next) => {
  try { await checkDatabaseConnection(); return next(); } catch (error) { return next(error); }
});
app.use('/api', routes);
app.use((req, res) => sendError(res, 'Route not found.', 404, 'ROUTE_NOT_FOUND'));
app.use(errorMiddleware);

if (require.main === module) {
  const port = Number(process.env.PORT || 5000);
  checkDatabaseConnection()
    .then(() => app.listen(port, () => process.stdout.write(`Vendora API running on http://localhost:${port}\n`)))
    .catch((error) => {
      process.stderr.write(`MongoDB connection failed: ${error.message}\n`);
      process.exitCode = 1;
    });
}

module.exports = app;
