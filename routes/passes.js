const express = require('express');
const router = express.Router();
const Pass = require('../models/Pass');
const Customer = require('../models/Customer');

// POST /api/passes
router.post('/', async (req, res) => {
  const { type, startDate, endDate, date, customerId, customerName } = req.body;

  // Validate type
  if (!type) {
    return res.status(400).json({ error: "Pass 'type' is required." });
  }

  // Handle date logic
  let passStartDate = startDate;
  let passEndDate = endDate;

  if (date) {
    passStartDate = date;
    passEndDate = date;
  }

  if (!passStartDate && !passEndDate) {
    return res.status(400).json({ error: "At least one date ('date', 'startDate', or 'endDate') is required." });
  }

  // Customer lookup/creation logic
  let customer;
  if (customerId) {
    customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found.' });
  } else if (customerName) {
    customer = await Customer.findOne({ name: customerName });
    if (!customer) {
      customer = new Customer({ name: customerName });
      await customer.save();
    }
  } else {
    return res.status(400).json({ error: 'Customer info required.' });
  }

  // Save the pass
  try {
    const pass = new Pass({
      type,
      startDate: passStartDate,
      endDate: passEndDate,
      customer: customer._id,
    });
    await pass.save();
    res.json(pass);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create pass.', details: err.message });
  }
});

// GET /api/passes
router.get('/', async (req, res) => {
  const passes = await Pass.find().populate('customer').exec();
  res.json(passes);
});

module.exports = router;
