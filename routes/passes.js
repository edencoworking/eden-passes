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

  // Determine dates
  let passStartDate = startDate;
  let passEndDate = endDate;
  if (date) {
    passStartDate = date;
    passEndDate = date;
  }

  if (!passStartDate) {
    return res.status(400).json({ error: "A date is required (either 'date' or 'startDate')." });
  }

  // Find or create customer
  let customer;
  try {
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
      return res.status(400).json({ error: 'Customer info required (customerId or customerName).' });
    }

    // Create and save pass
    const pass = new Pass({
      type,
      startDate: passStartDate,
      endDate: passEndDate,
      customer: customer._id,
    });
    await pass.save();
    res.status(201).json(pass);

  } catch (err) {
    res.status(500).json({ error: 'Failed to create pass.', details: err?.message || err });
  }
});

// GET /api/passes
router.get('/', async (req, res) => {
  try {
    const passes = await Pass.find().populate('customer').exec();
    res.json(passes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch passes.', details: err?.message || err });
  }
});

module.exports = router;