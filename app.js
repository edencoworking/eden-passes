const express = require('express');
const mongoose = require('mongoose');
const passesRouter = require('./routes/passes');
const customersRouter = require('./routes/customers');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api/passes', passesRouter);
app.use('/api/customers', customersRouter);

module.exports = app;
