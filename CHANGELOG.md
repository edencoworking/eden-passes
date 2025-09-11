# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2024-12-19

### Removed
- Deprecated Express/MongoDB backend implementation
- Legacy backend files: `app.js`, `routes/`, `models/` directories
- Backend dependencies: express, mongoose, joi, helmet, express-rate-limit, cors, dotenv, pino, pino-http
- Development dependencies: nodemon, pino-pretty

### Changed
- Migrated to serverless-style API architecture using `api/` directory
- Simplified application to use in-memory data storage
- Updated README.md to reflect new serverless architecture
- No longer requires MongoDB or complex backend infrastructure

### Notes
- The `api/customers.js` and `api/passes.js` serverless functions remain unchanged
- React frontend functionality is preserved
- Application now uses lightweight in-memory data persistence