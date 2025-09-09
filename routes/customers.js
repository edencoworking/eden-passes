const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

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
  let customer = await Customer.findOne({ name });
  if (customer) return res.status(409).json({ error: 'Customer already exists' });
  customer = new Customer({ name, email });
  await customer.save();
  res.json(customer);
});

module.exports = router;