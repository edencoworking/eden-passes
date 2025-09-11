'use strict';

const { logger } = require('./logger');

/**
 * Central error handler middleware
 * Produces standardized error envelope and logs appropriately
 */
function errorHandler(err, req, res, next) {
  // If response already sent, delegate to default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  // Default error response
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'An internal server error occurred';

  // Handle specific error types
  if (err.statusCode || err.status) {
    statusCode = err.statusCode || err.status;
  }

  if (err.code) {
    code = err.code;
  }

  if (err.message) {
    message = err.message;
  }

  // Log based on status code
  if (statusCode >= 500) {
    logger.error({
      err,
      req: {
        id: req.id,
        method: req.method,
        url: req.url,
        headers: req.headers
      }
    }, `Server error: ${message}`);
  } else if (statusCode >= 400) {
    logger.warn({
      err: {
        message: err.message,
        code: err.code,
        stack: err.stack
      },
      req: {
        id: req.id,
        method: req.method,
        url: req.url
      }
    }, `Client error: ${message}`);
  }

  // Send standardized error response
  res.status(statusCode).json({
    success: false,
    code,
    message,
    requestId: req.id
  });
}

module.exports = errorHandler;