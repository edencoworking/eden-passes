'use strict';

const { randomUUID } = require('crypto');

/**
 * Middleware to assign or propagate x-request-id
 * Attaches request ID to req.id and sets response header
 */
function requestId(req, res, next) {
  // Use existing x-request-id header or generate new one
  const id = req.headers['x-request-id'] || randomUUID();
  
  // Attach to request object
  req.id = id;
  
  // Set response header
  res.setHeader('x-request-id', id);
  
  next();
}

module.exports = requestId;