# Changelog

All notable changes to Eden Passes will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-09-11

### 🚨 BREAKING CHANGES
- **Architecture**: Converted from full-stack (React + Express/MongoDB) to frontend-only React application
- **Data Storage**: Replaced MongoDB with in-browser localStorage mock data layer
- **API**: Removed all HTTP endpoints; replaced with in-memory mock services

### ✨ Added
- **Mock Data Services**: New `src/services/api.js` providing in-memory data management
- **LocalStorage Persistence**: Data persists across browser sessions with `EP_STORAGE_V1_` prefixing
- **Autocomplete**: Enhanced customer search with case-insensitive filtering
- **Data Management**: `clearAllData()` method for programmatic data reset

### ❌ Removed
- **Backend Server**: Deleted `app.js` Express server entrypoint
- **Database Layer**: Removed MongoDB integration and Mongoose models
- **Backend Routes**: Deleted `routes/` directory with Express endpoints
- **Data Models**: Removed `models/` directory with Mongoose schemas
- **Dependencies**: Removed backend dependencies:
  - express
  - mongoose
  - cors
  - helmet
  - express-rate-limit
  - joi
  - pino
  - pino-http
  - dotenv
  - nodemon
  - pino-pretty

### 🔧 Changed
- **Version**: Bumped from 1.1.0 to 1.2.0
- **Package.json**: Cleaned up scripts and dependencies for frontend-only setup
- **Tests**: Updated test mocks to use new API service instead of axios
- **UI Components**: Removed duplicate "Eden Passes" heading from PassesPage component
- **Data Flow**: PassesPage now uses mock API services instead of HTTP calls

### 📚 Documentation
- **README**: Complete rewrite for frontend-only architecture
- **API Integration Guide**: Added instructions for future backend integration
- **Data Shapes**: Documented expected customer and pass object structures
- **Storage Guide**: Added localStorage management instructions

### 🎯 Migration Notes
- **For Developers**: Replace `src/services/api.js` with real HTTP calls to integrate with backend
- **For Users**: Existing data will be lost; application now starts with sample data
- **For Deployment**: No server infrastructure needed; can deploy to static hosting

## [1.1.x] - 2025

### Full-Stack Implementation (Deprecated)
- React frontend with Express/MongoDB backend
- RESTful API with `/api/passes` and `/api/customers` endpoints
- Mongoose models for data persistence
- Express middleware for cors, helmet, rate limiting
- Joi validation and Pino logging
- Health and readiness endpoints

*Note: This version is available in Git history before the 1.2.0 release*