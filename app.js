const express = require('express');
const { connectDB } = require('./utils/db');
const passesRouter = require('./routes/passes');
const customersRouter = require('./routes/customers');

const app = express();
app.use(express.json());

// Initialize database connection
connectDB().catch(console.error);

app.use('/api/passes', passesRouter);
app.use('/api/customers', customersRouter);

module.exports = app;
