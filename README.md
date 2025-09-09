# Eden Coworking Passes Management System

A Node.js + Express + SQLite backend system for managing coworking passes at Eden Coworking.

## Features

- **Pass Management**: Create, read, update, and delete coworking passes
- **User Tracking**: Track pass holders with names and email addresses
- **Check-in/Check-out**: Log entry and exit times for pass usage
- **Multiple Pass Types**: Support for different pass types (daily, weekly, monthly, etc.)
- **Usage History**: Track and retrieve usage history for each pass
- **RESTful API**: Clean REST endpoints for easy integration

## API Endpoints

### Health Check
- `GET /health` - Check API status

### Pass Management
- `GET /api/passes` - Get all passes
- `GET /api/passes/:id` - Get specific pass by ID
- `POST /api/passes` - Create new pass
- `PUT /api/passes/:id` - Update existing pass
- `DELETE /api/passes/:id` - Delete pass

### Pass Usage
- `POST /api/passes/:id/checkin` - Record check-in
- `POST /api/passes/:id/checkout` - Record check-out
- `GET /api/passes/:id/usage` - Get usage history for a pass

## Local Development

### Prerequisites
- Node.js 16+ 
- npm

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. The API will be available at `http://localhost:3000`

### Environment Variables
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

## Production Deployment on Render

This application is configured for automatic deployment on Render with the following features:
- **Auto-deploy**: Pushes to the main branch automatically trigger deployments
- **Persistent SQLite**: Database persists across deployments using Render disk storage
- **Environment optimized**: Production configuration with appropriate paths and settings

### Deployment Steps

1. **Connect Repository to Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` configuration

2. **Automatic Configuration**:
   The `render.yaml` file configures:
   - Web service with Node.js environment
   - Free tier deployment
   - Automatic npm install and start commands
   - Production environment variables
   - 1GB persistent disk mounted at `/opt/render/project/data` for SQLite database

3. **Expected Public URL Format**:
   ```
   https://eden-passes-api.onrender.com
   ```
   *(The exact URL will be provided by Render after deployment)*

### Production Environment

- **Database**: SQLite database stored on persistent disk (`/opt/render/project/data/database.sqlite`)
- **Environment**: NODE_ENV=production
- **Auto-restart**: Service automatically restarts on crashes
- **Health monitoring**: Built-in health check endpoint at `/health`

### Automatic Deployments

Once connected to Render:
- **Any push to the main branch** automatically triggers a new deployment
- **No manual intervention required** for updates
- **Database persists** through deployments via the mounted disk
- **Zero-downtime deployments** for seamless updates

### Post-Deployment Verification

After deployment, verify the service is running:

1. **Health Check**:
   ```bash
   curl https://your-app-url.onrender.com/health
   ```

2. **API Root**:
   ```bash
   curl https://your-app-url.onrender.com/
   ```

3. **Test Pass Creation**:
   ```bash
   curl -X POST https://your-app-url.onrender.com/api/passes \
     -H "Content-Type: application/json" \
     -d '{"user_name": "Test User", "email": "test@example.com", "pass_type": "daily", "start_date": "2024-01-01", "end_date": "2024-01-01"}'
   ```

### Monitoring and Logs

- **Render Dashboard**: View logs, metrics, and deployment status
- **Health Endpoint**: Monitor service health at `/health`
- **Error Logging**: Server errors are logged to Render's log system

## Database Schema

### Passes Table
- `id` - Primary key
- `user_name` - Pass holder name
- `email` - Pass holder email
- `pass_type` - Type of pass (daily, weekly, monthly, etc.)
- `start_date` - Pass validity start date
- `end_date` - Pass validity end date
- `status` - Pass status (active, expired, suspended)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Pass Usage Table
- `id` - Primary key
- `pass_id` - Foreign key to passes table
- `check_in_time` - Entry timestamp
- `check_out_time` - Exit timestamp (nullable)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Push to main branch (triggers automatic deployment)

## License

ISC