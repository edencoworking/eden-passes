const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const passesRoutes = require('./routes/passes');
const guestsRoutes = require('./routes/guests');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/passes', passesRoutes);
app.use('/api/guests', guestsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Eden Passes API is running',
        timestamp: new Date().toISOString()
    });
});

// Default route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to Eden Coworking Passes Management API',
        version: '1.0.0',
        endpoints: {
            passes: '/api/passes',
            guests: '/api/guests',
            health: '/api/health'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Eden Passes API server running on port ${PORT}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
    console.log(`📋 Passes API: http://localhost:${PORT}/api/passes`);
    console.log(`👥 Guests API: http://localhost:${PORT}/api/guests`);
});

module.exports = app;