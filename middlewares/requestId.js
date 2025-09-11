const { v4: uuidv4 } = require('uuid');

const requestIdMiddleware = (req, res, next) => {
  // Use X-Request-ID header if provided, otherwise generate UUID v4
  req.id = req.get('X-Request-ID') || uuidv4();
  
  // Set the request ID in response header for debugging
  res.set('X-Request-ID', req.id);
  
  next();
};

module.exports = requestIdMiddleware;