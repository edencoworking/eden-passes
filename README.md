# Eden Passes

A full-stack React and Node.js application for managing coworking space passes, with a comprehensive backend featuring structured logging, validation, security, and monitoring.

## Features

### Backend Enhancements
- ✅ **Structured Logging**: Pino-based JSON logging with request correlation
- ✅ **Request Validation**: Joi-based schema validation for all endpoints
- ✅ **Security**: Helmet middleware and rate limiting
- ✅ **Health Monitoring**: Enhanced health and readiness endpoints
- ✅ **Error Handling**: Comprehensive error handling with proper status codes
- ✅ **Database Optimization**: Performance indexes and lean queries
- ✅ **Graceful Shutdown**: SIGINT/SIGTERM handling with connection cleanup

### API Endpoints
- `GET /health` - Application health status with MongoDB state
- `GET /ready` - Readiness probe for container orchestration
- `GET /api/customers?search=` - Search customers (with validation)
- `POST /api/customers` - Create customer (with validation)
- `GET /api/passes` - List all passes with populated customer data
- `POST /api/passes` - Create pass (with comprehensive validation)

## Environment Variables

Copy `.env.example` to `.env` and configure as needed:

```bash
# Application Configuration
NODE_ENV=development
PORT=3000

# Database
MONGO_URI=mongodb://localhost:27017/edenpasses

# CORS Configuration (comma-separated for multiple origins)
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_WINDOW_MINUTES=15
RATE_LIMIT_MAX=100
```

## Getting Started

### Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB** (required for full functionality)
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   
   # Or install MongoDB locally
   ```

4. **Run backend server**
   ```bash
   npm run dev          # Development with nodemon
   # or
   npm start           # Production mode
   ```

5. **Run React frontend** (in separate terminal)
   ```bash
   npm run client
   ```

### API Testing

Test the enhanced backend features:

```bash
# Health check with detailed status
curl http://localhost:3000/health | jq

# Readiness check (for k8s deployments)
curl http://localhost:3000/ready | jq

# Test validation (should return validation error)
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{}' | jq

# Create a customer
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}' | jq

# Create a pass with validation
curl -X POST http://localhost:3000/api/passes \
  -H "Content-Type: application/json" \
  -d '{"type": "weekly", "date": "2024-01-15", "customerName": "John Doe"}' | jq
```

## Production Deployment

1. **Build React app**
   ```bash
   npm run build
   ```

2. **Environment Setup**
   - Set `NODE_ENV=production`
   - Configure `MONGO_URI` for production database
   - Set appropriate `LOG_LEVEL` (warn or error)
   - Configure `CORS_ORIGIN` for your frontend domain

3. **Deploy with Vercel** (Automatic via GitHub Actions)
   - Ensure these secrets are set in your GitHub repository:
     - `VERCEL_TOKEN`
     - `VERCEL_ORG_ID`
     - `VERCEL_PROJECT_ID`

## Architecture

### Backend Structure
```
├── server.js              # Server entrypoint with graceful shutdown
├── app.js                 # Express app configuration
├── middlewares/           # Custom middleware
│   ├── logger.js         # Structured logging setup
│   ├── requestId.js      # Request correlation IDs
│   ├── validate.js       # Joi validation schemas
│   └── rateLimit.js      # Rate limiting configuration
├── routes/               # API route handlers
│   ├── customers.js      # Customer CRUD with validation
│   └── passes.js         # Pass CRUD with validation
├── models/               # Mongoose models with indexes
│   ├── Customer.js       # Customer schema
│   └── Pass.js           # Pass schema
└── utils/                # Utility functions
    └── mongoState.js     # MongoDB connection state mapper
```

### Frontend Structure
```
src/
├── components/           # Reusable components
├── pages/               # Page components
└── App.js               # Main application component
```

## Logging

The application uses structured JSON logging with request correlation:

```json
{
  "level": "info",
  "time": "2024-01-15T10:30:00.000Z",
  "event": "request_complete",
  "method": "POST",
  "path": "/api/passes",
  "statusCode": 201,
  "duration": 45,
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Security Features

- **Helmet**: Security headers middleware
- **Rate Limiting**: 100 requests per 15 minutes by default
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Joi schema validation for all inputs
- **Error Handling**: No sensitive information in error responses

## Performance Features

- **Database Indexes**: Optimized queries for customers and passes
- **Lean Queries**: Reduced memory usage with lean()
- **Field Projection**: Only fetch required fields in populated queries
- **Connection Pooling**: MongoDB connection optimization

## Monitoring & Health Checks

### Health Endpoint (`/health`)
Returns comprehensive application status including:
- Application uptime
- MongoDB connection state
- Application version
- Request correlation ID

### Readiness Endpoint (`/ready`)
Kubernetes-compatible readiness probe:
- Returns 200 if MongoDB is connected
- Returns 503 if dependencies are not ready

## Next Steps

- Replace `public/favicon.ico` with your own logo
- Add authentication and authorization
- Implement pass usage tracking
- Add customer analytics dashboard
- Set up monitoring and alerting