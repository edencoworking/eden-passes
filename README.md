# Eden Passes

A minimal React application, ready for deployment on Vercel.

## Getting Started

1. **Install dependencies**
    ```bash
    npm install
    ```

2. **Run locally**
    ```bash
    npm start
    ```

3. **Build for production**
    ```bash
    npm run build
    ```

4. **Deploy automatically via Vercel**
    - See `.github/workflows/vercel-deploy_Version4.yml`.
    - Ensure these secrets are set in your GitHub repository:
        - `VERCEL_TOKEN`
        - `VERCEL_ORG_ID`
        - `VERCEL_PROJECT_ID`

## Environment Variables

Copy `.env.example` to `.env` and fill in as needed.

## Testing

Run tests:
```bash
npm test
```

## Project Structure

- `src/` - React source code
- `public/` - Static assets

## Next Steps

- Replace `public/favicon.ico` with your own logo.
- Add real features and components!