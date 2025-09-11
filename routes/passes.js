const express = require('express');
const router = express.Router();
const Pass = require('../models/Pass');
const Customer = require('../models/Customer');

// POST /api/passes
router.post('/', async (req, res) => {
  try {
    const { type, date, startDate, endDate, customerId, customerName } = req.body;
    
    // Validate required fields
    if (!type) {
      return res.status(400).json({ error: 'Pass type is required' });
    }
    
    // Handle date logic - accept either 'date' or 'startDate'/'endDate'
    let finalStartDate, finalEndDate;
    if (date) {
      // If single date provided, use it for both start and end
      finalStartDate = date;
      finalEndDate = date;
    } else if (startDate || endDate) {
      // If separate dates provided, use them
      finalStartDate = startDate;
      finalEndDate = endDate;
    } else {
      // No date provided at all
      return res.status(400).json({ error: 'At least one date field is required (date, startDate, or endDate)' });
    }
    
    // Handle customer logic
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
      return res.status(400).json({ error: 'Customer info required (customerId or customerName)' });
    }
    
    // Create the pass
    const pass = new Pass({ 
      type, 
      startDate: finalStartDate, 
      endDate: finalEndDate, 
      customer: customer._id 
    });
    await pass.save();
    res.json(pass);
  } catch (error) {
    console.error('Error creating pass:', error);
    res.status(500).json({ error: 'Internal server error while creating pass' });
  }
});

// GET /api/passes
router.get('/', async (req, res) => {
  const passes = await Pass.find().populate('customer').exec();
  res.json(passes);
});

module.exports = router;