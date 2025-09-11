const express = require('express');
const router = express.Router();
const Pass = require('../models/Pass');
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

// Serializer function for consistent output
function serializePass(pass) {
  return {
    _id: pass._id,
    type: pass.type,
    date: pass.date || (pass.startDate ? pass.startDate : null),
    startDate: pass.startDate || null,
    endDate: pass.endDate || null,
    customer: pass.customer ? {
      _id: pass.customer._id,
      name: pass.customer.name
    } : null,
    createdAt: pass.createdAt
  };
}

// POST /api/passes
router.post('/', async (req, res) => {
  const { type, startDate, endDate, date, customerId, customerName } = req.body;

  // Validate type
  if (!type) {
    return res.status(400).json({ error: "Pass 'type' is required." });
  }

  // Validate date logic
  if (date && startDate) {
    return res.status(400).json({ error: "Cannot specify both 'date' and 'startDate'. Use 'date' for single-day passes or 'startDate'/'endDate' for range passes." });
  }

  if (!date && !startDate) {
    return res.status(400).json({ error: "Either 'date' or 'startDate' must be provided." });
  }

  // Find or create customer
  let customer;
  try {
    if (customerId) {
      customer = await Customer.findById(customerId);
      if (!customer) return res.status(404).json({ error: 'Customer not found.' });
    } else if (customerName) {
      customer = await Customer.findOne({ name: customerName.trim() });
      if (!customer) {
        customer = new Customer({ name: customerName.trim() });
        await customer.save();
      }
    } else {
      return res.status(400).json({ error: 'Customer info required (customerId or customerName).' });
    }

    // Prepare pass data
    const passData = {
      type: type.trim(),
      customer: customer._id,
    };

    if (date) {
      passData.date = new Date(date);
    } else {
      passData.startDate = new Date(startDate);
      passData.endDate = new Date(endDate);
    }

    // Create and save pass
    const pass = new Pass(passData);
    await pass.save();
    
    // Populate customer and serialize response
    await pass.populate('customer');
    const serializedPass = serializePass(pass);
    
    res.status(201).json(serializedPass);

  } catch (err) {
    res.status(500).json({ error: 'Failed to create pass.', details: err?.message || err });
  }
});

// GET /api/passes
router.get('/', async (req, res) => {
  try {
    const passes = await Pass.find()
      .populate('customer')
      .sort({ createdAt: -1 }) // Sort by newest first
      .exec();
    
    const serializedPasses = passes.map(serializePass);
    res.json(serializedPasses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch passes.', details: err?.message || err });
  }
});

module.exports = router;