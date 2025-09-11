const express = require('express');
const router = express.Router();
const Pass = require('../models/Pass');
const Customer = require('../models/Customer');
const { validate, schemas } = require('../middlewares/validate');
const logger = require('../middlewares/logger');

// POST /api/passes
router.post('/', validate(schemas.passCreate), async (req, res, next) => {
  try {
    const { type, startDate, endDate, date, customerId, customerName } = req.body;

    // Determine dates - validation middleware ensures either date or startDate exists
    let passStartDate = startDate || date;
    let passEndDate = endDate || date;

    // Find or create customer
    let customer;
    if (customerId) {
      customer = await Customer.findById(customerId);
      if (!customer) {
        const error = new Error('Customer not found');
        error.status = 404;
        return next(error);
      }
    } else {
      // customerName is provided (validated by middleware)
      customer = await Customer.findOne({ name: customerName });
      if (!customer) {
        customer = new Customer({ name: customerName });
        await customer.save();
        
        logger.info({
          event: 'customer_auto_created',
          customerId: customer._id,
          name: customer.name,
          requestId: req.id
        }, `Auto-created customer: ${customer.name}`);
      }
    }

    // Create and save pass
    const pass = new Pass({
      type,
      startDate: passStartDate,
      endDate: passEndDate,
      customer: customer._id,
    });
    
    await pass.save();
    
    // Return populated pass for convenience
    const populatedPass = await Pass.findById(pass._id)
      .populate('customer', 'name email')
      .lean()
      .exec();
    
    logger.info({
      event: 'pass_created',
      passId: pass._id,
      type,
      customerId: customer._id,
      customerName: customer.name,
      requestId: req.id
    }, `Pass created: ${type} for ${customer.name}`);
    
    res.status(201).json(populatedPass);
  } catch (error) {
    next(error);
  }
});

// GET /api/passes
router.get('/', async (req, res, next) => {
  try {
    const passes = await Pass.find()
      .populate('customer', 'name email')
      .lean()
      .exec();
    
    logger.info({
      event: 'passes_fetched',
      count: passes.length,
      requestId: req.id
    }, `Fetched ${passes.length} passes`);
    
    res.json(passes);
  } catch (error) {
    next(error);
  }
});

module.exports = router;