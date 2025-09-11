# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2024-12-20

### Removed - Backend Cleanup
- **BREAKING**: Removed entire Express.js backend implementation
  - Deleted `app.js` - Express application server
  - Deleted `routes/` directory - Express route handlers for passes and customers
  - Deleted `models/` directory - Mongoose schemas for Pass and Customer
  - Referenced but non-existent `middlewares/` and `utils/` directories

### Changed - Dependencies
- Bumped version from 1.1.0 to 1.2.0
- Removed backend dependencies:
  - `express` ^4.19.2
  - `mongoose` ^8.6.0
  - `joi` ^17.13.3
  - `helmet` ^7.1.0
  - `express-rate-limit` ^7.0.0
  - `cors` ^2.8.5
  - `dotenv` ^16.4.5
  - `pino` ^9.3.0
  - `pino-http` ^9.0.0
- Removed development dependencies:
  - `nodemon` ^3.1.4
  - `pino-pretty` ^11.2.2
- Retained frontend dependencies:
  - `react` ^18.0.0
  - `react-dom` ^18.0.0  
  - `react-scripts` 5.0.1
  - `axios` ^1.11.0
  - `uuid` ^9.0.1

### Enhanced - Documentation
- Completely updated README.md to reflect new lightweight architecture
- Added "Backend Cleanup (v1.2.0)" section explaining the architectural change
- Removed references to MongoDB, Express middleware, and complex backend features
- Updated API documentation to reflect in-memory handlers in `api/` directory
- Added browserslist configuration for consistent build targets

### Maintained - Functionality
- All user-facing functionality preserved via in-memory API handlers
- Customer search and creation still available
- Pass creation and listing still available
- React frontend unchanged

### Rationale
This cleanup removes the heavyweight Express/MongoDB backend that was not being used in production, simplifying the architecture for demo purposes. The in-memory API handlers in the `api/` directory provide the same functionality with significantly reduced complexity and faster deployment times.

## [1.1.0] - Previous Version
- Legacy Express/MongoDB backend implementation (now removed)
- Complex middleware stack with logging, validation, and security features
- MongoDB integration with Mongoose schemas
- Structured error handling and response conventions