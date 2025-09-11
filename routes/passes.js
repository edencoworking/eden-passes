const express = require('express');
const Joi = require('joi');
const Pass = require('../models/Pass');
const Customer = require('../models/Customer');
const validate = require('../middlewares/validate');

const router = express.Router();

const createPassSchema = Joi.object({
  type: Joi.string().min(1).max(50).required(),
  // Either date OR (startDate [+ optional endDate])
  date: Joi.date().iso(),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')),
  // Customer reference (exactly one of)
  customerId: Joi.string().hex().length(24),
  customerName: Joi.string().min(1).max(120),
}).custom((value, helpers) => {
  const { date, startDate, endDate } = value;
  if (date && (startDate || endDate)) {
    return helpers.error('any.invalid', 'Provide either date OR startDate(+endDate), not both.');
  }
  if (!date && !startDate) {
    return helpers.error('any.invalid', 'A date or startDate is required.');
  }
  const { customerId, customerName } = value;
  if (customerId && customerName) {
    return helpers.error('any.invalid', 'Use only one of customerId or customerName.');
  }
  if (!customerId && !customerName) {
    return helpers.error('any.invalid', 'Provide customerId or customerName.');
  }
  return value;
}, 'Mutual exclusivity rules');

router.post('/', validate(createPassSchema), async (req, res, next) => {
  try {
    const { type, date, startDate, endDate, customerId, customerName } = req.body;

    let passStart = date || startDate;
    let passEnd = date || endDate || passStart;

    // Find or create customer
    let customer;
    if (customerId) {
      customer = await Customer.findById(customerId).lean().exec();
      if (!customer) {
        return res.status(404).json({
          success: false,
            code: 'CUSTOMER_NOT_FOUND',
            message: 'Customer not found',
            requestId: req.id
        });
      }
    } else {
      customer = await Customer.findOne({ name: customerName }).lean().exec();
      if (!customer) {
        const newCustomer = await Customer.create({ name: customerName });
        customer = {
          _id: newCustomer._id,
          name: newCustomer.name,
          email: newCustomer.email
        };
      }
    }

    const pass = await Pass.create({
      type,
      startDate: passStart,
      endDate: passEnd,
      customer: customer._id
    });

    // Populate customer fields (lean style)
    const response = {
      _id: pass._id,
      type: pass.type,
      startDate: pass.startDate,
      endDate: pass.endDate,
      customer: {
        _id: customer._id,
        name: customer.name,
        email: customer.email || null
      },
      createdAt: pass.createdAt
    };

    res.status(201).json({
      success: true,
      data: response,
      requestId: req.id
    });
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const passes = await Pass.find({})
      .sort({ startDate: -1 })
      .limit(100)
      .populate({ path: 'customer', select: 'name email' })
      .lean()
      .exec();

    const data = passes.map(p => ({
      _id: p._id,
      type: p.type,
      startDate: p.startDate,
      endDate: p.endDate,
      customer: p.customer ? {
        _id: p.customer._id,
        name: p.customer.name,
        email: p.customer.email || null
      } : null,
      createdAt: p.createdAt
    }));

    res.json({
      success: true,
      data,
      requestId: req.id
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
