'use strict';

// Load environment variables
require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');
const { logger } = require('./middlewares/logger');

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/edenpasses';

let server;

/**
 * Graceful shutdown handler
 */
async function gracefulShutdown(signal) {
  logger.info(`Received ${signal}, starting graceful shutdown...`);
  
  const shutdownTimeout = setTimeout(() => {
    logger.error('Graceful shutdown timeout exceeded, forcing exit');
    process.exit(1);
  }, 10000); // 10 second timeout

  try {
    // Stop accepting new connections
    if (server) {
      await new Promise((resolve) => {
        server.close(resolve);
      });
      logger.info('HTTP server closed');
    }

    // Close MongoDB connection
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');

    clearTimeout(shutdownTimeout);
    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, 'Error during graceful shutdown');
    clearTimeout(shutdownTimeout);
    process.exit(1);
  }
}

/**
 * Start the server
 */
async function startServer() {
  try {
    // Connect to MongoDB
    logger.info({ mongoUri: MONGO_URI }, 'Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    logger.info('MongoDB connected successfully');

    // Start HTTP server
    server = app.listen(PORT, () => {
      logger.info({
        port: PORT,
        nodeEnv: process.env.NODE_ENV || 'development',
        serviceVersion: process.env.SERVICE_VERSION || 'unknown'
      }, 'Server started successfully');
    });

    // Setup graceful shutdown handlers
    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);

  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
}

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => {
  logger.fatal({ err: error }, 'Uncaught exception');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ err: reason, promise }, 'Unhandled rejection');
  process.exit(1);
});

// Start the server
startServer();