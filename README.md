# Eden Coworking Passes Management System

A modern web application for managing coworking passes and guests at Eden Coworking. Built with Node.js, Express, SQLite, React, and Vite.

![Eden Coworking](frontend/src/assets/eden-logo.svg)

## 🌟 Features

### Backend (API)
- **CRUD Operations**: Complete management of passes and guests
- **Pass Logic**: Automatic expiration handling and status updates
- **RESTful API**: Clean, documented endpoints
- **SQLite Database**: Lightweight, file-based database
- **Data Validation**: Input validation and error handling

### Frontend (React SPA)
- **Modern Design**: Clean, responsive UI with Eden branding
- **Navigation**: Dashboard, Passes, and Guests sections
- **Real-time Data**: Live updates and statistics
- **Pass Management**: Create, edit, delete passes with different types
- **Guest Management**: Comprehensive guest profiles and tracking
- **Dashboard**: Overview statistics and recent activity

### Pass Types
- **Day Pass**: Single day access
- **Week Pass**: 7-day access period
- **Month Pass**: 30-day access period
- **Annual Pass**: Year-long access

## 🏗️ Architecture

```
eden-passes/
├── backend/                 # Node.js + Express API
│   ├── database/           # SQLite database and schema
│   ├── routes/             # API route handlers
│   ├── server.js           # Express server configuration
│   └── package.json        # Backend dependencies
├── frontend/               # React + Vite SPA
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── assets/         # Images, logos, static files
│   │   └── App.jsx         # Main application component
│   ├── public/             # Public assets
│   └── package.json        # Frontend dependencies
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/edencoworking/eden-passes.git
   cd eden-passes
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   npm start
   ```
   The API will be available at `http://localhost:3001`

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The web app will be available at `http://localhost:5173`

### Database Setup
The SQLite database is automatically created and populated with sample data when you first run the backend server. The database file will be created at `backend/database/eden_passes.db`.

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### Passes
- `GET /passes` - Get all passes
- `GET /passes/:id` - Get specific pass
- `POST /passes` - Create new pass
- `PUT /passes/:id` - Update pass
- `DELETE /passes/:id` - Delete pass
- `GET /passes/stats/overview` - Get pass statistics

#### Guests
- `GET /guests` - Get all guests
- `GET /guests/:id` - Get specific guest
- `POST /guests` - Create new guest
- `PUT /guests/:id` - Update guest
- `DELETE /guests/:id` - Delete guest
- `GET /guests/stats/overview` - Get guest statistics

#### Health
- `GET /health` - API health check

### Example API Calls

**Create a new pass:**
```bash
curl -X POST http://localhost:3001/api/passes \
  -H "Content-Type: application/json" \
  -d '{
    "type": "week",
    "start_date": "2024-09-09",
    "end_date": "2024-09-16",
    "guest_id": 1
  }'
```

**Create a new guest:**
```bash
curl -X POST http://localhost:3001/api/guests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Tech Corp"
  }'
```

## 🎨 Design & Branding

The application features Eden Coworking's green color palette:
- **Primary Green**: `#4a7c59`
- **Dark Green**: `#2d5016`
- **Light Gray**: `#f8f9fa`
- **Accent Gray**: `#6c757d`

The UI includes:
- Eden logo integration
- Responsive design for mobile and desktop
- Clean, modern Material Design-inspired components
- Accessibility features with proper focus management

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev    # Start with auto-restart
```

### Frontend Development
```bash
cd frontend
npm run dev    # Start Vite dev server with hot reload
```

### Building for Production

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build    # Creates production build in 'dist' folder
npm run preview  # Preview production build
```

## 📊 Database Schema

### Passes Table
- `id` - Primary key
- `type` - Pass type (day, week, month, annual)
- `start_date` - Pass start date
- `end_date` - Pass expiration date
- `guest_id` - Foreign key to guests table
- `status` - Pass status (active, expired, cancelled)
- `created_at` - Record creation timestamp
- `updated_at` - Record update timestamp

### Guests Table
- `id` - Primary key
- `name` - Guest full name
- `email` - Guest email (unique)
- `phone` - Guest phone number
- `company` - Guest company
- `notes` - Additional notes
- `created_at` - Record creation timestamp
- `updated_at` - Record update timestamp

## 🚀 Deployment

### Docker Deployment (Optional)
```bash
# Backend
cd backend
docker build -t eden-passes-backend .
docker run -p 3001:3001 eden-passes-backend

# Frontend
cd frontend
docker build -t eden-passes-frontend .
docker run -p 80:80 eden-passes-frontend
```

### Environment Variables
Create a `.env` file in the backend directory:
```
PORT=3001
NODE_ENV=production
DATABASE_PATH=./database/eden_passes.db
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary to Eden Coworking.

## 📞 Support

For technical support or questions about the Eden Passes Management System, please contact the development team.

---

**Eden Coworking** - Creating collaborative workspaces for the future.