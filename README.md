# Eden Coworking Passes Management

[![Vercel Deployment](https://vercel.com/button)](https://vercel.com)

A React-based frontend application for managing coworking space passes at Eden Coworking. This application helps track daily passes, member access, and space usage.

## 🚀 Vercel Deployment

This application is configured for automatic deployment to Vercel. The public URL will follow the format:
- **Main deployment**: `https://eden-passes.vercel.app` (or similar)
- **Branch deployments**: `https://eden-passes-git-[branch-name].vercel.app`

### Automatic Deployment Setup

1. **Initial Setup**: Connect your GitHub repository to Vercel
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import the `edencoworking/eden-passes` repository
   - Vercel will automatically detect the React configuration

2. **Automatic Deployments**: 
   - Every push to the `main` branch automatically triggers a production deployment
   - Pull requests create preview deployments with unique URLs
   - The `vercel.json` configuration ensures optimal build settings

### Manual Deployment

To deploy manually via Vercel CLI:
```bash
npm install -g vercel
vercel --prod
```

## 🛠️ Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/edencoworking/eden-passes.git
   cd eden-passes
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run vercel-build` - Special build command for Vercel deployment

## 📦 Project Structure

```
eden-passes/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── App.tsx
│   ├── App.css
│   └── index.tsx
├── vercel.json          # Vercel deployment configuration
├── package.json
└── README.md
```

## ⚙️ Configuration

### Vercel Configuration (`vercel.json`)

The project includes a `vercel.json` file with optimized settings:
- Static build configuration using `@vercel/static-build`
- Proper routing for SPA (Single Page Application)
- Static asset caching for performance
- Clean URLs enabled

### Build Process

The application uses Create React App's build system:
- TypeScript support
- Automatic code splitting
- Production optimizations
- Static file generation in `build/` directory

## 🔧 Deployment Troubleshooting

### Common Issues

1. **Build Failures**: Check the Vercel build logs for any TypeScript or dependency errors
2. **Routing Issues**: The `vercel.json` configuration handles SPA routing automatically
3. **Environment Variables**: Add any required environment variables in the Vercel dashboard

### Environment Variables

If you need to add environment variables:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add variables with the `REACT_APP_` prefix for client-side usage

## 📝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test locally with `npm start` and `npm run build`
4. Push to GitHub - this will create a preview deployment
5. Create a pull request - Vercel will provide a preview URL
6. After review, merge to `main` for automatic production deployment

## 🔗 Links

- **Live Application**: Will be available after Vercel deployment
- **Vercel Dashboard**: [https://vercel.com/dashboard](https://vercel.com/dashboard)
- **Repository**: [https://github.com/edencoworking/eden-passes](https://github.com/edencoworking/eden-passes)

---

Built with React, TypeScript, and deployed on Vercel.