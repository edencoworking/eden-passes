# Eden Passes (Frontend Only)

As of version 1.2.0 the previous Express + MongoDB backend was removed. This repository now contains only the React frontend (and any lightweight serverless/Vercel-style endpoints that may live under `api/`). All legacy backend functionality (health/readiness endpoints, Mongo models, rate limiting, Joi validation, structured logging, graceful shutdown) has been retired.

## What Changed in 1.2.0
- Removed Express server entrypoint (`app.js`).
- Deleted backend directories: `routes/`, `models/`, `middlewares/`, `utils/` (Mongo state helper).
- Pruned backend-only dependencies (express, mongoose, joi, helmet, dotenv, pino, express-rate-limit, cors, pino-http, etc.).
- Bumped version to 1.2.0.
- Simplified documentation to reflect a pure frontend application.

## Getting Started
Install dependencies:
```bash
npm install
```
Run the development server:
```bash
npm start
```
Build for production:
```bash
npm run build
```
Run tests:
```bash
npm test
```

## Environment Variables
Backend-specific variables (PORT, MONGO_URI, RATE_LIMIT_*, LOG_LEVEL, etc.) are no longer used. If the frontend needs to call an external API, add variables prefixed with `REACT_APP_` (e.g. `REACT_APP_API_BASE`) in a local `.env` that you do not commit.

## Future Integration
// TODO: Integrate external API layer or SDK for passes & customers.
// TODO: Replace any former direct backend assumptions with fetch/GraphQL calls.

## Changelog (Excerpt)
| Version | Date | Notes |
|---------|------|-------|
| 1.2.0 | 2025-09-11 | Backend removed; repository is frontend-only. |
| 1.1.x | 2025 | Full-stack (React + Express/Mongo) implementation (now retired). |

Old backend logic can still be examined in Git history prior to tag v1.2.0.