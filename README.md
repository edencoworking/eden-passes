# Eden Passes

A React application for managing digital passes at Eden Coworking.

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/edencoworking/eden-passes.git
cd eden-passes
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open in your browser at `http://localhost:3000`.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

### Deployment

This app is configured for deployment on Vercel. The `vercel.json` file includes the necessary configuration for a single-page application with proper routing.

To deploy:
1. Connect your repository to Vercel
2. Vercel will automatically build and deploy on every push to the main branch

### Project Structure

```
eden-passes/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.js
│   └── index.js
├── package.json
├── vercel.json
└── README.md
```