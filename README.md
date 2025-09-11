# Eden Passes

A minimal React frontend for managing coworking passes and customers with an in-memory mock API.

## Features

- React-based user interface for pass and customer management
- In-memory mock API endpoints for development (api/ directory)
- Responsive design and modern React patterns
- Vercel-ready deployment configuration

## API Endpoints

The application uses serverless API routes located in the `api/` directory:

### Customers
- `GET /api/customers?search=term` - Search customers
- `POST /api/customers` - Create new customer

### Passes
- `GET /api/passes` - List all passes with customer information
- `POST /api/passes` - Create new pass

## Architecture Note

**Version 1.2.0**: The legacy Express/MongoDB backend was removed in favor of a simplified in-memory mock API. This change provides a cleaner development experience and easier deployment to serverless platforms like Vercel.

## Development

Install dependencies:
```bash
npm install
```

Start the React development server:
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

This application is configured for deployment on Vercel with serverless API routes. The `api/` directory contains the backend endpoints that will be automatically deployed as serverless functions.

---

For production use, consider implementing a proper database backend and authentication system.
