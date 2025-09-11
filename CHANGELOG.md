# Changelog

All notable changes to Eden Passes will be documented in this file.

## [1.2.0] - 2024-12-19

### Removed
- **Legacy Express/MongoDB backend** - Eliminated entire Express server infrastructure
  - Removed `app.js` Express server entry point
  - Removed Express route handlers (`routes/passes.js`, `routes/customers.js`)
  - Removed Mongoose models (`models/Pass.js`, `models/Customer.js`)
  - Removed server-only dependencies:
    - express
    - mongoose
    - joi (validation)
    - helmet (security)
    - express-rate-limit
    - cors
    - dotenv
    - pino, pino-http, pino-pretty (logging)
    - nodemon
- **Backend-specific features**
  - Health and readiness endpoints (`/health`, `/ready`)
  - Request correlation IDs and structured logging
  - MongoDB connection and indexing
  - Joi validation middleware
  - Rate limiting and security headers
  - Graceful shutdown handling

### Changed
- **Simplified architecture** - Now uses only lightweight in-memory API handlers
- **Version bump** - Updated from 1.1.0 to 1.2.0
- **Documentation** - Updated README to reflect simplified React-only setup
- **Dependencies** - Retained only essential dependencies for React frontend

### Technical Details
- Frontend continues to use existing `/api/passes` and `/api/customers` endpoints
- In-memory API handlers maintain compatibility with frontend expectations
- Build and development workflows remain unchanged (`npm start`, `npm build`)
- Significantly reduced dependency footprint and maintenance overhead

### Migration Notes
- This is a **breaking change** for any deployments expecting the Express server
- API response format simplified (no longer wrapped in `{success, data, requestId}` envelope)
- No database persistence - all data is in-memory for development/testing only

## [1.1.0] - Previous Version
- Combined Express/MongoDB backend with React frontend
- Full-featured server with logging, validation, security, and database persistence