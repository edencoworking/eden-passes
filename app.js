'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const requestId = require('./middlewares/requestId');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const { mongoState } = require('./utils/mongoState');

const passesRouter = require('./routes/passes');
const customersRouter = require('./routes/customers');

const app = express();

// CORS
app.use(cors({
  origin: (process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : '*'),
  credentials: true
}));

// Security
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Request ID
app.use(requestId);

// Logging (after requestId so it can include correlation)
app.use(logger.httpLogger);

// Body parsing
app.use(express.json({ limit: '1mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
      requestId: req.id
    });
  }
});
app.use('/api/', limiter);

// Mongo connection
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/edenpasses';
mongoose.connect(mongoUri)
  .then(() => logger.info({ mongoUri }, 'MongoDB connected'))
  .catch(err => {
    logger.error({ err }, 'MongoDB connection error');
    process.exit(1);
  });

mongoose.connection.on('error', err => logger.error({ err }, 'MongoDB runtime error'));
mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));

// Health & readiness
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    version: process.env.SERVICE_VERSION || 'unknown',
    mongo: mongoState(),
    requestId: req.id
  });
});

app.get('/ready', (req, res) => {
  const state = mongoState();
  const healthy = state === 'connected';
  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ready' : 'not-ready',
    mongo: state,
    requestId: req.id
  });
});

// Routes
app.use('/api/passes', passesRouter);
app.use('/api/customers', customersRouter);

// 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    code: 'NOT_FOUND',
    message: 'Resource not found',
    requestId: req.id
  });
});

// Central error handler
app.use(errorHandler);

module.exports = app;
