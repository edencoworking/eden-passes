const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { validate, schemas } = require('../middlewares/validate');
const logger = require('../middlewares/logger');

// GET /api/customers?search=
router.get('/', validate(schemas.customerSearch, 'query'), async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const regex = new RegExp(search, 'i');
    const customers = await Customer.find({ name: regex }).limit(10).lean().exec();
    
    logger.info({
      event: 'customers_fetched',
      count: customers.length,
      search: search || null,
      requestId: req.id
    }, `Fetched ${customers.length} customers`);
    
    res.json(customers);
  } catch (error) {
    next(error);
  }
});

// POST /api/customers
router.post('/', validate(schemas.customerCreate), async (req, res, next) => {
  try {
    const { name, email } = req.body;
    
    // Check if customer already exists
    let customer = await Customer.findOne({ name });
    if (customer) {
      const error = new Error('Customer already exists');
      error.status = 409;
      return next(error);
    }
    
    customer = new Customer({ name, email });
    await customer.save();
    
    logger.info({
      event: 'customer_created',
      customerId: customer._id,
      name: customer.name,
      requestId: req.id
    }, `Customer created: ${customer.name}`);
    
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
});

module.exports = router;