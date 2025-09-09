const express = require('express');
const router = express.Router();
const Pass = require('../models/Pass');
const Customer = require('../models/Customer');

// POST /api/passes
router.post('/', async (req, res) => {
  const { type, startDate, endDate, customerId, customerName } = req.body;
  let customer;
  if (customerId) {
    customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
  } else if (customerName) {
    customer = await Customer.findOne({ name: customerName });
    if (!customer) {
      customer = new Customer({ name: customerName });
      await customer.save();
    }
  } else {
    return res.status(400).json({ error: 'Customer info required' });
  }
  const pass = new Pass({ type, startDate, endDate, customer: customer._id });
  await pass.save();
  res.json(pass);
});

// GET /api/passes
router.get('/', async (req, res) => {
  const passes = await Pass.find().populate('customer').exec();
  res.json(passes);
});

module.exports = router;