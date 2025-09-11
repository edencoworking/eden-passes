# Eden Passes

A minimal React frontend with lightweight in-memory API handlers for managing coworking passes and customers.

## Architecture 

This application uses a simplified architecture with:
- React frontend for the user interface
- In-memory API handlers in the `api/` directory for data management
- No external database dependencies for easy development and deployment

**Note:** As of version 1.2.0, the legacy Express/MongoDB backend was removed to simplify the architecture and eliminate duplicate implementations.

## API Endpoints

The application provides the following API endpoints via in-memory handlers:

### Customers
- `GET /api/customers?search=term` - Search for customers by name
- `POST /api/customers` - Create a new customer

### Passes  
- `GET /api/passes` - Get all passes with customer information
- `POST /api/passes` - Create a new pass

Example pass creation:
```json
{
  "type": "weekly",
  "date": "2025-09-01", 
  "customerName": "John Doe"
}
```

## Development

Install dependencies:
```bash
npm install
```

Start the React development server:
```bash
npm start
```

Run tests:
```bash
npm test
```

Build for production:
```bash
npm build
```

## CHANGELOG

### v1.2.0
- **BREAKING:** Removed legacy Express/MongoDB backend
- Simplified architecture to use only in-memory API handlers
- Removed server dependencies: express, mongoose, joi, helmet, cors, dotenv, pino, etc.
- Updated documentation to reflect current simplified architecture
