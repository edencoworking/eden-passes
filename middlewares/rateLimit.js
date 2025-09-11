const rateLimit = require('express-rate-limit');

const createRateLimit = () => {
  const windowMs = (parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15) * 60 * 1000; // Convert to milliseconds
  const max = parseInt(process.env.RATE_LIMIT_MAX) || 100;

  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(windowMs / 1000) // in seconds
    },
    headers: true, // Send rate limit info in response headers
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
};

module.exports = createRateLimit;