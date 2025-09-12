# Eden Passes (Frontend-Only)

A React application for managing coworking passes and customers. As of version 1.2.0, this is a **frontend-only** application that uses localStorage for data persistence.

## Architecture

This application uses a pure frontend architecture with no backend dependencies:

- **Frontend**: React 18 with Create React App
- **Data Layer**: Browser localStorage for persistent data storage
- **State Management**: React hooks and local component state
- **Build Tool**: Create React App (no custom webpack configuration)

### Data Layer (localStorage)

The application uses two localStorage keys for data persistence:

- `EDEN_PASSES`: Stores all pass records as JSON array
- `EDEN_CUSTOMERS`: Stores all customer records as JSON array

**Data Functions** (in `src/services/api.js`):
- `getPasses()`: Retrieves passes sorted by creation date (newest first)
- `getCustomers()`: Retrieves customers sorted alphabetically  
- `searchCustomers(term)`: Client-side search filtering customers by name
- `createPass({ type, date, customerId?, customerName? })`: Creates new pass and customer if needed

### Key Features

- ✅ **Persistent Data**: Passes and customers persist across browser sessions
- ✅ **No Server Required**: Runs entirely in the browser
- ✅ **Customer Autocomplete**: Real-time client-side search suggestions
- ✅ **Deterministic Dates**: Pass dates default to today's date
- ✅ **Automatic Seeding**: Demo customers created on first run
- ✅ **Static Deployment**: Can be deployed to any static hosting service

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation
```bash
# Clone the repository
git clone https://github.com/edencoworking/eden-passes.git
cd eden-passes

# Install dependencies
npm install
```

### Development
```bash
# Start development server
npm start
# Opens http://localhost:3000
```

### Production Build
```bash
# Create production build
npm run build

# Serve locally to test
npx serve -s build
```

### Testing
```bash
# Run tests
npm test

# Run tests without watch mode
npm test -- --watchAll=false
```

## Usage

### Creating Passes
1. Select a pass type (Hourly, 10-Hour, Weekly, Monthly)
2. Choose a date (defaults to today)
3. Enter customer name (autocomplete will suggest existing customers)
4. Click "Create Pass"

### Customer Management
- **Existing Customers**: Type to see autocomplete suggestions
- **New Customers**: Type a new name and the customer will be created automatically
- **Customer Data**: Persists in localStorage between sessions

### Data Persistence
- All data is stored in browser localStorage
- Data persists between browser sessions
- Clearing browser data will reset the application
- No external database or server required

## Deployment

This application can be deployed to any static hosting service:

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build the project
npm run build

# Deploy the build/ folder to Netlify
```

### GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

## Development Notes

### Environment Variables
Since this is a frontend-only app, no backend environment variables are needed. If you need to configure external API endpoints in the future, use `REACT_APP_` prefixed variables in a `.env` file.

### Adding External APIs
To integrate with external services:

1. Replace functions in `src/services/api.js` with actual API calls
2. Add API endpoints using `fetch()` or a HTTP client library
3. Configure CORS if needed on the external service
4. Add API keys as `REACT_APP_` environment variables

### Data Schema

**Pass Object:**
```javascript
{
  id: "uuid",
  type: "hourly|10-hour|weekly|monthly", 
  date: "YYYY-MM-DD",
  customerId: "uuid",
  customerName: "string",
  createdAt: "ISO 8601 timestamp"
}
```

**Customer Object:**
```javascript
{
  id: "uuid",
  name: "string"
}
```

## Migration from 1.1.x

**⚠️ Breaking Changes in 1.2.0:**

### What Changed
- Removed Express.js backend completely
- Removed MongoDB database dependency  
- Switched to localStorage for data persistence
- Removed all HTTP API endpoints
- Updated React components to use localStorage API

### Migration Steps
1. **Data Backup**: Export any important data from the previous version
2. **Update**: Pull the latest 1.2.0 code
3. **Install**: Run `npm install` (will remove backend dependencies)
4. **Restart**: The app will start fresh with demo data
5. **Import**: Manually recreate important passes/customers if needed

### Lost Functionality
- Multi-user support (localStorage is per-browser)
- Server-side data validation
- Centralized data storage
- API endpoints for external integrations

## Roadmap

### Near Term (1.3.x)
- [ ] Export/import functionality for data backup
- [ ] Enhanced customer management (edit/delete)
- [ ] Pass filtering and search capabilities
- [ ] Basic reporting and analytics

### Future Versions (2.x)
- [ ] **Backend Integration**: Optional API layer for multi-user support
- [ ] **Authentication**: User accounts and access control  
- [ ] **Real Database**: PostgreSQL/MongoDB integration
- [ ] **Multi-tenant**: Support for multiple coworking spaces
- [ ] **API Integrations**: Payment processing, booking systems
- [ ] **Mobile App**: React Native companion app

### External API Candidates
- **Firebase**: For real-time database and authentication
- **Supabase**: Open-source Firebase alternative  
- **GraphQL**: For flexible data queries
- **REST APIs**: Traditional HTTP API integration

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and test: `npm test`
4. Build to verify: `npm run build`
5. Commit: `git commit -m 'Add feature'`
6. Push: `git push origin feature-name`
7. Create a Pull Request

## License

This project is licensed under the MIT License.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.