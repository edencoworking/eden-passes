# Eden Passes (Frontend Only)

A React-based coworking pass management application. As of version 1.2.0, this repository contains only the frontend application with an in-browser mock data layer.

## Features

- **Pass Management**: Create and view coworking passes with different types (hourly, 10-hour, weekly, monthly)
- **Customer Management**: Add customers with intelligent autocomplete search
- **In-Browser Storage**: Data persists across browser sessions using localStorage
- **Real-time Updates**: Form automatically resets after successful pass creation
- **Responsive Design**: Clean, modern interface that works across devices

## Getting Started

### Prerequisites
- Node.js 22.x (specified in package.json engines)
- npm

### Installation
```bash
npm install
```

### Development
```bash
npm start
```
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build
```bash
npm run build
```
Builds the app for production to the `build` folder.

### Test
```bash
npm test
```
Launches the test runner in interactive watch mode.

## Data Storage

The application uses **localStorage** to persist data across browser sessions. Data is stored with a prefixed key (`EP_STORAGE_V1_`) to avoid conflicts.

### Resetting Data
To clear all application data:
1. Open browser Developer Tools (F12)
2. Go to Application/Storage tab
3. Clear localStorage, or specifically remove keys starting with `EP_STORAGE_V1_`

Alternatively, the mock API service includes a `clearAllData()` method for programmatic data reset.

## Future Integration

This frontend is designed to be easily connected to a real backend API. To integrate with an external API:

1. Replace the mock `api` service in `src/services/api.js` with real HTTP calls
2. Update endpoints to match your backend:
   - `GET /api/passes` - fetch all passes with customer info
   - `POST /api/passes` - create new pass
   - `GET /api/customers?search=<term>` - search customers
   - `POST /api/customers` - create new customer

3. Expected data shapes:
   ```javascript
   // Customer
   { id: string, name: string, createdAt: string }
   
   // Pass
   { 
     id: string, 
     type: string, 
     date: string, 
     customerId: string,
     customer: { id: string, name: string },
     createdAt: string 
   }
   ```

## What Changed in 1.2.0

- **Removed Express server** (`app.js`) and all backend infrastructure
- **Deleted backend directories**: `routes/`, `models/`, middleware and utility modules  
- **Removed backend dependencies**: express, mongoose, joi, helmet, dotenv, pino, cors, express-rate-limit, etc.
- **Added mock data layer** with localStorage persistence
- **Bumped version** to 1.2.0 to reflect architectural change
- **Updated documentation** to reflect frontend-only nature

## Environment Variables

Backend-specific environment variables (PORT, MONGO_URI, RATE_LIMIT_*, LOG_LEVEL) are no longer used. 

If you need to configure the frontend for external API integration, use `REACT_APP_` prefixed variables in a local `.env` file:
```bash
REACT_APP_API_BASE=https://your-api.com
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Build the app (`npm run build`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 1.2.0 | 2025-09-11 | **Breaking**: Removed backend; now frontend-only with mock data layer |
| 1.1.x | 2025 | Full-stack implementation (React + Express/MongoDB) - see Git history |

To examine the previous full-stack implementation, check the Git history before the 1.2.0 release.