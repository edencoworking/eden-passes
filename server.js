const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database setup
const dbPath = process.env.NODE_ENV === 'production' 
  ? '/opt/render/project/data/database.sqlite' 
  : path.join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  const createTablesSQL = `
    CREATE TABLE IF NOT EXISTS passes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name TEXT NOT NULL,
      email TEXT NOT NULL,
      pass_type TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pass_usage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pass_id INTEGER,
      check_in_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      check_out_time DATETIME,
      FOREIGN KEY (pass_id) REFERENCES passes (id)
    );
  `;

  db.exec(createTablesSQL, (err) => {
    if (err) {
      console.error('Error creating tables:', err.message);
    } else {
      console.log('Database tables initialized successfully');
    }
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes

// Get all passes
app.get('/api/passes', (req, res) => {
  const sql = 'SELECT * FROM passes ORDER BY created_at DESC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ passes: rows });
  });
});

// Get pass by ID
app.get('/api/passes/:id', (req, res) => {
  const sql = 'SELECT * FROM passes WHERE id = ?';
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Pass not found' });
      return;
    }
    res.json({ pass: row });
  });
});

// Create new pass
app.post('/api/passes', (req, res) => {
  const { user_name, email, pass_type, start_date, end_date } = req.body;
  
  if (!user_name || !email || !pass_type || !start_date || !end_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `INSERT INTO passes (user_name, email, pass_type, start_date, end_date) 
               VALUES (?, ?, ?, ?, ?)`;
  
  db.run(sql, [user_name, email, pass_type, start_date, end_date], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ 
      message: 'Pass created successfully',
      pass_id: this.lastID 
    });
  });
});

// Update pass
app.put('/api/passes/:id', (req, res) => {
  const { user_name, email, pass_type, start_date, end_date, status } = req.body;
  const sql = `UPDATE passes 
               SET user_name = ?, email = ?, pass_type = ?, start_date = ?, end_date = ?, status = ?, updated_at = CURRENT_TIMESTAMP
               WHERE id = ?`;
  
  db.run(sql, [user_name, email, pass_type, start_date, end_date, status, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Pass not found' });
      return;
    }
    res.json({ message: 'Pass updated successfully' });
  });
});

// Delete pass
app.delete('/api/passes/:id', (req, res) => {
  const sql = 'DELETE FROM passes WHERE id = ?';
  db.run(sql, [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Pass not found' });
      return;
    }
    res.json({ message: 'Pass deleted successfully' });
  });
});

// Check-in endpoint
app.post('/api/passes/:id/checkin', (req, res) => {
  const sql = 'INSERT INTO pass_usage (pass_id) VALUES (?)';
  db.run(sql, [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ 
      message: 'Check-in recorded successfully',
      usage_id: this.lastID 
    });
  });
});

// Check-out endpoint
app.post('/api/passes/:id/checkout', (req, res) => {
  const sql = `UPDATE pass_usage 
               SET check_out_time = CURRENT_TIMESTAMP 
               WHERE pass_id = ? AND check_out_time IS NULL
               ORDER BY check_in_time DESC 
               LIMIT 1`;
  
  db.run(sql, [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'No active check-in found for this pass' });
      return;
    }
    res.json({ message: 'Check-out recorded successfully' });
  });
});

// Get pass usage history
app.get('/api/passes/:id/usage', (req, res) => {
  const sql = 'SELECT * FROM pass_usage WHERE pass_id = ? ORDER BY check_in_time DESC';
  db.all(sql, [req.params.id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ usage: rows });
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Eden Coworking Passes Management API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      passes: '/api/passes',
      pass_by_id: '/api/passes/:id',
      checkin: '/api/passes/:id/checkin',
      checkout: '/api/passes/:id/checkout',
      usage: '/api/passes/:id/usage'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Eden Passes API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;