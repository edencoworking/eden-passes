const express = require('express');
const Joi = require('joi');
const Customer = require('../models/Customer');
const validate = require('../middlewares/validate');

const router = express.Router();

const createCustomerSchema = Joi.object({
  name: Joi.string().min(1).max(120).required(),
  email: Joi.string().email().optional()
});

router.get('/', async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const regex = new RegExp(search, 'i');
    const customers = await Customer.find({ name: regex })
      .select('name email createdAt')
      .limit(10)
      .lean()
      .exec();
    res.json({
      success: true,
      data: customers,
      requestId: req.id
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', validate(createCustomerSchema), async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const existing = await Customer.findOne({ name }).lean().exec();
    if (existing) {
      return res.status(409).json({
        success: false,
        code: 'CUSTOMER_EXISTS',
        message: 'Customer already exists',
        requestId: req.id
      });
    }
    const customer = await Customer.create({ name, email });
    res.status(201).json({
      success: true,
      data: {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        createdAt: customer.createdAt
      },
      requestId: req.id
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        code: 'CUSTOMER_EXISTS',
        message: 'Customer already exists',
        requestId: req.id
      });
    }
    next(err);
  }
});

module.exports = router;
