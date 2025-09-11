# Eden Passes

A React frontend application for managing coworking passes and customers, designed for demonstration purposes with lightweight in-memory API handlers.

## Features

- Clean React frontend built with Create React App
- In-memory API handlers for passes and customers management
- Simple customer search and pass creation functionality
- Responsive design for coworking pass management

## Backend Cleanup (v1.2.0)

**Major architectural change**: Removed legacy Express/MongoDB backend implementation in favor of lightweight in-memory API handlers optimized for demo environments.

**What was removed:**
- Express.js server with MongoDB integration
- Complex middleware stack (logging, validation, rate limiting, security)
- Mongoose models and schemas
- Database connection management
- Heavy dependencies: `express`, `mongoose`, `joi`, `helmet`, `express-rate-limit`, `cors`, `dotenv`, `pino`, `pino-http`, `nodemon`, `pino-pretty`

**Current implementation:**
- Lightweight Vercel/Next.js API routes in `api/` directory
- In-memory data storage using JavaScript arrays
- Simple CORS handling and basic validation
- Minimal dependencies focused on frontend needs

This change simplifies deployment, reduces complexity, and provides a fast demo experience while maintaining all user-facing functionality.

## API Endpoints

### Customers
- `GET /api/customers?search=term` - Search customers by name
- `POST /api/customers` - Create new customer with `{"name": "Customer Name"}`

### Passes  
- `GET /api/passes` - List all passes with customer information
- `POST /api/passes` - Create new pass with `{"type": "daily|weekly|monthly", "date": "YYYY-MM-DD", "customerId": "id"}` or `{"type": "...", "date": "...", "customerName": "Name"}`

## Development

Install dependencies:
```bash
npm install
```

Start the development server:
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

## Deployment

This application is optimized for deployment on Vercel or similar platforms that support serverless API routes. The `api/` directory contains the backend endpoints, while the React build serves the frontend.

---

The application now focuses on simplicity and ease of deployment while maintaining full functionality for pass and customer management.
