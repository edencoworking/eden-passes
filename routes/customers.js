const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { connectDB } = require('../utils/db');

// Ensure database connection for all routes
router.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// GET /api/customers?search=
router.get('/', async (req, res) => {
  const search = req.query.search || '';
  const regex = new RegExp(search, 'i');
  const customers = await Customer.find({ name: regex }).limit(10).exec();
  res.json(customers);
});

// POST /api/customers
router.post('/', async (req, res) => {
  const { name, email } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  let customer = await Customer.findOne({ name: name.trim() });
  if (customer) return res.status(409).json({ error: 'Customer already exists' });
  customer = new Customer({ name: name.trim(), email });
  await customer.save();
  res.json(customer);
});

module.exports = router;