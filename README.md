# Eden Passes

A minimal React frontend with lightweight in-memory API for managing coworking passes and customers.

## Features

- Create and manage coworking passes
- Customer management with autocomplete search
- In-memory API for development and testing
- Responsive React UI

## In-Memory API Endpoints

The application includes a lightweight mock API under the `/api` directory:

### Customers
- `GET /api/customers?search=term` - Search customers by name
- `POST /api/customers` - Create new customer

### Passes  
- `GET /api/passes` - List all passes with customer information
- `POST /api/passes` - Create new pass (with either `customerId` or `customerName`)

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

## API Response Format

The in-memory API returns simple JSON responses compatible with the frontend expectations.

Example pass response:
```json
{
  "id": "1",
  "type": "weekly",
  "date": "2024-01-15",
  "customerId": "1",
  "customer": {
    "id": "1",
    "name": "John Doe"
  },
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

## Changelog

### v1.2.0 - Legacy Backend Removal

- Removed Express/MongoDB backend in favor of simplified in-memory mock API
- Eliminated server dependencies (express, mongoose, joi, helmet, etc.)
- Streamlined to React-only development workflow
- Maintained API compatibility for frontend

---

This lightweight setup is ideal for prototyping and development. For production deployment, consider implementing a proper backend API.
