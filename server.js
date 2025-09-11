'use strict';

const app = require('./app');
const logger = require('./middlewares/logger');

const PORT = process.env.PORT || 3000;
let server;

// Start HTTP server
const startServer = () => {
  server = app.listen(PORT, () => {
    logger.info({
      event: 'server_started',
      port: PORT,
      env: process.env.NODE_ENV || 'development',
      pid: process.pid
    }, `Server listening on port ${PORT}`);
  });

  server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    switch (error.code) {
      case 'EACCES':
        logger.error({ event: 'server_error', port: PORT, error: error.code }, `Port ${PORT} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error({ event: 'server_error', port: PORT, error: error.code }, `Port ${PORT} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });
};

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  logger.info({ event: 'shutdown_initiated', signal }, `Received ${signal}, starting graceful shutdown`);
  
  if (server) {
    // Stop accepting new connections
    server.close((err) => {
      if (err) {
        logger.error({ event: 'server_close_error', error: err.message }, 'Error closing HTTP server');
        process.exit(1);
      }
      
      logger.info({ event: 'server_closed' }, 'HTTP server closed');
      
      // Close MongoDB connection
      const mongoose = require('mongoose');
      mongoose.connection.close()
        .then(() => {
          logger.info({ event: 'mongodb_closed' }, 'MongoDB connection closed');
          
          // Flush logs and exit
          logger.info({ event: 'shutdown_complete' }, 'Graceful shutdown completed');
          setTimeout(() => process.exit(0), 100); // Give time for log flush
        })
        .catch((err) => {
          logger.error({ event: 'mongodb_close_error', error: err.message }, 'Error closing MongoDB connection');
          process.exit(1);
        });
    });
  } else {
    logger.info({ event: 'shutdown_complete' }, 'No server to close, exiting');
    process.exit(0);
  }
};

// Signal handlers for graceful shutdown
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.fatal({ event: 'uncaught_exception', error: error.message, stack: error.stack }, 'Uncaught exception');
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ event: 'unhandled_rejection', reason, promise }, 'Unhandled promise rejection');
  process.exit(1);
});

// Start the server
startServer();