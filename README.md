# Eden Passes Management

A React-based management system for Eden Passes.

## Getting Started

This project is built with React and Vite for fast development and optimized builds.

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

To start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

### Deployment

This project is configured for deployment on Vercel. The `vercel.json` configuration ensures proper routing for a single-page application.

## Project Structure

```
├── src/
│   ├── index.jsx         # Application entry point
│   └── App.jsx           # Main App component
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
└── vercel.json           # Vercel deployment configuration
```