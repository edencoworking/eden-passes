# Eden Passes API Documentation

## Base URL
- Development: `http://localhost:3000`
- Production: `https://eden-passes-api.onrender.com` *(or your assigned Render URL)*

## Authentication
Currently, the API does not require authentication. This is suitable for internal coworking management but should be secured for production use.

## Request/Response Format
All endpoints accept and return JSON data.

## Error Responses
All errors return JSON in the following format:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (missing/invalid data)
- `404` - Not Found
- `500` - Internal Server Error

## Endpoints

### GET /health
Health check endpoint to verify service status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### GET /
API information and available endpoints.

**Response:**
```json
{
  "message": "Eden Coworking Passes Management API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "passes": "/api/passes",
    "pass_by_id": "/api/passes/:id",
    "checkin": "/api/passes/:id/checkin",
    "checkout": "/api/passes/:id/checkout",
    "usage": "/api/passes/:id/usage"
  }
}
```

### GET /api/passes
Get all passes in the system.

**Response:**
```json
{
  "passes": [
    {
      "id": 1,
      "user_name": "John Doe",
      "email": "john@example.com",
      "pass_type": "monthly",
      "start_date": "2024-01-01",
      "end_date": "2024-01-31",
      "status": "active",
      "created_at": "2024-01-01 10:30:00",
      "updated_at": "2024-01-01 10:30:00"
    }
  ]
}
```

### GET /api/passes/:id
Get a specific pass by ID.

**Parameters:**
- `id` (URL parameter) - Pass ID

**Response:**
```json
{
  "pass": {
    "id": 1,
    "user_name": "John Doe",
    "email": "john@example.com",
    "pass_type": "monthly",
    "start_date": "2024-01-01",
    "end_date": "2024-01-31",
    "status": "active",
    "created_at": "2024-01-01 10:30:00",
    "updated_at": "2024-01-01 10:30:00"
  }
}
```

### POST /api/passes
Create a new pass.

**Request Body:**
```json
{
  "user_name": "Jane Smith",
  "email": "jane@example.com",
  "pass_type": "weekly",
  "start_date": "2024-01-15",
  "end_date": "2024-01-21"
}
```

**Required Fields:**
- `user_name` - Pass holder's name
- `email` - Pass holder's email
- `pass_type` - Type of pass (daily, weekly, monthly, etc.)
- `start_date` - Pass validity start date (YYYY-MM-DD)
- `end_date` - Pass validity end date (YYYY-MM-DD)

**Response:**
```json
{
  "message": "Pass created successfully",
  "pass_id": 2
}
```

### PUT /api/passes/:id
Update an existing pass.

**Parameters:**
- `id` (URL parameter) - Pass ID

**Request Body:**
```json
{
  "user_name": "Jane Smith Updated",
  "email": "jane.updated@example.com",
  "pass_type": "monthly",
  "start_date": "2024-01-15",
  "end_date": "2024-02-15",
  "status": "active"
}
```

**Response:**
```json
{
  "message": "Pass updated successfully"
}
```

### DELETE /api/passes/:id
Delete a pass.

**Parameters:**
- `id` (URL parameter) - Pass ID

**Response:**
```json
{
  "message": "Pass deleted successfully"
}
```

### POST /api/passes/:id/checkin
Record a check-in for a pass.

**Parameters:**
- `id` (URL parameter) - Pass ID

**Response:**
```json
{
  "message": "Check-in recorded successfully",
  "usage_id": 1
}
```

### POST /api/passes/:id/checkout
Record a check-out for a pass.

**Parameters:**
- `id` (URL parameter) - Pass ID

**Response:**
```json
{
  "message": "Check-out recorded successfully"
}
```

### GET /api/passes/:id/usage
Get usage history for a specific pass.

**Parameters:**
- `id` (URL parameter) - Pass ID

**Response:**
```json
{
  "usage": [
    {
      "id": 1,
      "pass_id": 1,
      "check_in_time": "2024-01-01 09:00:00",
      "check_out_time": "2024-01-01 17:30:00"
    },
    {
      "id": 2,
      "pass_id": 1,
      "check_in_time": "2024-01-02 08:45:00",
      "check_out_time": null
    }
  ]
}
```

## Example Usage

### Creating a Daily Pass
```bash
curl -X POST https://your-app-url.onrender.com/api/passes \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "Alice Johnson",
    "email": "alice@example.com",
    "pass_type": "daily",
    "start_date": "2024-01-15",
    "end_date": "2024-01-15"
  }'
```

### Recording Check-in/Check-out
```bash
# Check-in
curl -X POST https://your-app-url.onrender.com/api/passes/1/checkin

# Check-out (later)
curl -X POST https://your-app-url.onrender.com/api/passes/1/checkout
```

### Getting Usage Report
```bash
curl https://your-app-url.onrender.com/api/passes/1/usage
```