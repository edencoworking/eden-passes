# Eden Passes (Backend & Frontend)

A combined minimal React frontend and enhanced Express/MongoDB backend for managing coworking passes and customers.

## Features Added

- Structured logging (pino) with request correlation IDs
- Centralized error handling with standardized JSON format
- Input validation using Joi
- Security hardening (helmet) + basic rate limiting
- Health (`/health`) and readiness (`/ready`) endpoints with MongoDB state
- Graceful shutdown
- Indexed MongoDB schemas for performance
- Lean queries and selective population
- Environment-driven configuration
- Consistent response envelope

## API Response Conventions

Success:
```json
{
  "success": true,
  "data": {...},
  "requestId": "uuid"
}
```

Error:
```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "Human readable message",
  "requestId": "uuid"
}
```

## Endpoints

### Health
GET /health  
Returns service status, uptime, version, Mongo state.

### Readiness
GET /ready  
200 if Mongo connected; 503 otherwise.

### Customers
GET /api/customers?search=term  
Returns up to 10 matching customers.

POST /api/customers
```json
{
  "name": "Alice",
  "email": "alice@example.com"
}
```
409 if name already exists.

### Passes
POST /api/passes
Provide either:
- Single day: `{"type":"day","date":"2025-09-01","customerId":"..."}`
- Range: `{"type":"week","startDate":"2025-09-01","endDate":"2025-09-05","customerName":"Bob"}`

Exactly one of `customerId` or `customerName` required.

GET /api/passes  
Lists up to 100 most recent passes (descending by startDate).

## Environment Variables

See `.env.example`.

Key | Description
----|------------
PORT | Server port
MONGO_URI | Mongo connection string
CORS_ORIGIN | Comma-separated whitelist or `*`
RATE_LIMIT_WINDOW_MS | Rate limiter window (ms)
RATE_LIMIT_MAX | Max requests per window per IP
LOG_LEVEL | pino log level (info, debug, warn, error)
SERVICE_VERSION | Displayed in /health

## Development

Install:
```bash
npm install
```

Run backend:
```bash
npm run dev
```

(React frontend commands remain unchanged if present.)

## Logging

Pretty logging in non-production; JSON in production. Each line includes `requestId`.

## Error Codes (Sample)

Code | Meaning
-----|--------
VALIDATION_ERROR | Joi validation failure
CUSTOMER_EXISTS | Unique name conflict
CUSTOMER_NOT_FOUND | Customer id not found
RATE_LIMIT_EXCEEDED | Rate limiter triggered
NOT_FOUND | 404 route
INTERNAL_ERROR | Unhandled server error

## Mongo Indexes

Collection | Index
-----------|------
customers | `{ email: 1 } (sparse)`
passes | `{ customer:1, startDate:-1 }`, `{ type:1 }`

## Graceful Shutdown

On SIGINT/SIGTERM: stop accepting new connections, close HTTP server, then close Mongo.

---

Adjust or extend this backend as business rules evolve.
