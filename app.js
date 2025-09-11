'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');

const logger = require('./middlewares/logger');
const requestIdMiddleware = require('./middlewares/requestId');
const createRateLimit = require('./middlewares/rateLimit');
const { getMongoState } = require('./utils/mongoState');

const passesRouter = require('./routes/passes');
const customersRouter = require('./routes/customers');

const app = express();

// Security middleware
app.use(helmet());

// Request ID middleware (must be early)
app.use(requestIdMiddleware);

// Rate limiting for API routes
const rateLimiter = createRateLimit();
app.use('/api', rateLimiter);

// Basic middleware
app.use(express.json());
app.use(cors({
  origin: (process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()) : '*'),
  credentials: true
}));

// Structured request logging
app.use((req, res, next) => {
  const start = Date.now();
  
  // Log request start
  logger.info({
    event: 'request_start',
    method: req.method,
    path: req.originalUrl,
    requestId: req.id,
    userAgent: req.get('User-Agent'),
    contentLength: req.get('Content-Length')
  }, `${req.method} ${req.originalUrl} started`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const responseSize = res.get('Content-Length');
    
    // Log request completion
    logger.info({
      event: 'request_complete',
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      duration,
      requestId: req.id,
      responseSize
    }, `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});

// Enhanced health check endpoint
app.get('/health', (req, res) => {
  const mongoState = getMongoState();
  const pkg = require('./package.json');
  
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: pkg.version,
    mongoState: mongoState.numerical,
    mongoStateDescription: mongoState.human,
    requestId: req.id
  });
});

// Readiness check endpoint
app.get('/ready', (req, res) => {
  const mongoState = getMongoState();
  const isReady = mongoState.numerical === 1; // 1 = connected
  
  res.status(isReady ? 200 : 503).json({
    ready: isReady,
    mongoState: mongoState.human,
    details: !isReady ? 'MongoDB not connected' : null,
    requestId: req.id
  });
});

// Mongo connection with structured logging
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/edenpasses';
mongoose.connect(mongoUri)
  .then(() => {
    logger.info({
      event: 'mongodb_connected',
      uri: mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@') // Hide password in logs
    }, 'MongoDB connected successfully');
  })
  .catch(err => {
    logger.fatal({
      event: 'mongodb_connection_error',
      error: err.message,
      uri: mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')
    }, 'MongoDB connection failed');
    process.exit(1);
  });

mongoose.connection.on('error', err => {
  logger.error({
    event: 'mongodb_runtime_error',
    error: err.message
  }, 'MongoDB runtime error');
});

mongoose.connection.on('disconnected', () => {
  logger.warn({
    event: 'mongodb_disconnected'
  }, 'MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  logger.info({
    event: 'mongodb_reconnected'
  }, 'MongoDB reconnected');
});

// Routes
app.use('/api/passes', passesRouter);
app.use('/api/customers', customersRouter);

// 404 handler
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Enhanced centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const requestId = req.id || 'unknown';
  
  let payload = {
    error: err.message || 'Internal Server Error',
    requestId
  };

  // Handle different types of errors
  if (err.isJoi) {
    // Joi validation errors (should be handled by validation middleware)
    payload.code = 'VALIDATION_ERROR';
    payload.details = err.details?.map(detail => ({
      path: detail.path.join('.'),
      message: detail.message
    })) || [];
  } else if (err.name === 'ValidationError') {
    // Mongoose validation errors
    payload.code = 'MONGOOSE_VALIDATION';
    payload.details = Object.keys(err.errors).map(field => ({
      path: field,
      message: err.errors[field].message
    }));
  } else if (err.code === 11000) {
    // MongoDB duplicate key errors
    const field = Object.keys(err.keyPattern || {})[0] || 'unknown';
    payload.code = 'DUPLICATE_KEY';
    payload.field = field;
    payload.error = `${field} already exists`;
    res.status(409); // Conflict
  }

  // Include stack trace in non-production
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.stack = err.stack;
  }

  // Log the error with appropriate level
  const logLevel = status >= 500 ? 'error' : 'warn';
  logger[logLevel]({
    event: 'error_handler',
    error: err.message,
    stack: err.stack,
    status,
    requestId,
    path: req.originalUrl,
    method: req.method
  }, `Request error: ${err.message}`);

  res.status(status).json(payload);
});

module.exports = app;
