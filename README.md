# Eden Passes

A React frontend application for managing coworking passes and customers with an in-memory mock API.

## Features

- Create and track passes (hourly, 10-hour, weekly, monthly)
- Manage customers with name autocomplete
- In-memory data storage (ephemeral - resets on page refresh)
- Clean and intuitive user interface

## Data Model

### Customer
- `id`: Unique identifier
- `name`: Customer name
- `createdAt`: Creation timestamp

### Pass
- `id`: Unique identifier  
- `type`: Pass type (hourly, 10-hour, weekly, monthly)
- `date`: Pass date
- `customerId`: Reference to customer
- `customer`: Populated customer information
- `createdAt`: Creation timestamp

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
npm build
```

Run tests:
```bash
npm test
```

## Data Persistence

This application uses an in-memory mock API for data storage. All data is ephemeral and will be reset when the page is refreshed or the application is restarted. This design provides a clean testing environment without requiring external database setup.

The mock API includes:
- Sample customers (John Doe, Jane Smith, Bob Johnson)
- Sample passes for demonstration

## Architecture Notes

This is a pure frontend React application. The backend architecture was removed in v1.2.0 to simplify deployment and focus on frontend functionality. The mock API provides realistic data interactions for development and demonstration purposes.

---

Built with Create React App.
