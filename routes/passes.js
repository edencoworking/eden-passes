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
    
    // Support both single date and start/end date formats
    if (!date && !startDate) {
      return res.status(400).json({ error: 'Either date or startDate is required' });
    }
    
    // Always require customer info
    if (!customerId && !customerName) {
      return res.status(400).json({ error: 'Customer information is required. Please provide either customerId or customerName' });
    }
    
    let customer;
    
    // Handle customer lookup/creation
    if (customerId) {
      customer = await Customer.findById(customerId);
      if (!customer) {
        return res.status(404).json({ error: 'Customer with provided ID not found' });
      }
    } else if (customerName) {
      // Try to find existing customer by name
      customer = await Customer.findOne({ name: customerName.trim() });
      if (!customer) {
        // Create new customer if not found
        customer = new Customer({ name: customerName.trim() });
        await customer.save();
      }
    }
    
    // Create pass data object
    const passData = {
      type: type.trim(),
      customer: customer._id
    };
    
    // Handle date fields - support both single date and date range
    if (date) {
      passData.date = new Date(date);
    }
    if (startDate) {
      passData.startDate = new Date(startDate);
    }
    if (endDate) {
      passData.endDate = new Date(endDate);
    }
    
    // Create and save the pass
    const pass = new Pass(passData);
    await pass.save();
    
    // Return the pass with populated customer info
    const populatedPass = await Pass.findById(pass._id).populate('customer').exec();
    res.status(201).json(populatedPass);
    
  } catch (error) {
    console.error('Error creating pass:', error);
    
    // Handle specific mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: `Validation failed: ${validationErrors.join(', ')}` });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({ error: 'A similar record already exists' });
    }
    
    // Handle invalid date errors
    if (error.message && error.message.includes('Invalid Date')) {
      return res.status(400).json({ error: 'Invalid date format provided' });
    }
    
    // Generic error response
    res.status(500).json({ error: 'Failed to create pass. Please try again.' });
  }
});

// GET /api/passes
router.get('/', async (req, res) => {
  try {
    const passes = await Pass.find().populate('customer').exec();
    res.json(passes);
  } catch (error) {
    console.error('Error fetching passes:', error);
    res.status(500).json({ error: 'Failed to fetch passes. Please try again.' });
  }
});

module.exports = router;