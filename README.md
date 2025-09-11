# Eden Passes

A minimal React frontend with serverless-style API functions for managing coworking passes and customers.

## Architecture

This application uses:
- **Frontend**: React application built with create-react-app
- **API**: Serverless-style functions in the `api/` directory using in-memory data storage
- **No Database**: Simple in-memory arrays for data persistence during runtime

## API Endpoints

### Customers
- `GET /api/customers?search=term` - Search customers by name
- `POST /api/customers` - Create a new customer

### Passes  
- `GET /api/passes` - Get all passes with customer information
- `POST /api/passes` - Create a new pass (optionally creating customer if needed)

## Development

Install dependencies:
```bash
npm install
```

Start the React development server:
```bash
npm start
```

The React app will run on http://localhost:3000 and the API functions are designed to work with serverless platforms like Vercel.

## Deployment

This project is configured for deployment on Vercel, where the `api/` functions will be automatically deployed as serverless functions.

## Backend Cleanup (v1.2.0)

In version 1.2.0, the deprecated Express/MongoDB backend was removed in favor of the lightweight serverless API implementation. The application now uses simple in-memory data storage and no longer requires database connections or complex backend infrastructure.
