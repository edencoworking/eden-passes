# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2024-09-11

### BREAKING CHANGES
- **Removed Express/MongoDB backend**: The legacy Express server with MongoDB has been completely removed in favor of a simplified in-memory mock API

### Removed
- Express server (`app.js`)
- MongoDB models (`models/Pass.js`, `models/Customer.js`)
- Express routes (`routes/passes.js`, `routes/customers.js`)
- Backend-only dependencies:
  - express
  - mongoose
  - joi
  - helmet
  - express-rate-limit
  - cors
  - dotenv
  - pino
  - pino-http
  - nodemon
  - pino-pretty

### Changed
- Updated README.md to reflect new simplified architecture
- Renamed project header from "Eden Passes (Backend & Frontend)" to "Eden Passes"
- Removed backend-specific documentation sections

### Migration Guide
If you were using the previous Express/MongoDB endpoints:
- The API endpoints remain the same (`/api/customers`, `/api/passes`) but now use in-memory data
- Health and readiness endpoints (`/health`, `/ready`) are no longer available
- No MongoDB connection is required
- Environment variables for Express/MongoDB are no longer needed

The React frontend continues to work unchanged with the new in-memory API.

## [1.1.0] - Previous Version
- Combined Express/MongoDB backend with React frontend