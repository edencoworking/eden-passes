const Joi = require('joi');

const validate = (schema, property = 'body') => {
  return async (req, res, next) => {
    try {
      const data = req[property];
      await schema.validateAsync(data, { abortEarly: false });
      next();
    } catch (error) {
      if (error.isJoi) {
        const details = error.details.map(detail => ({
          path: detail.path.join('.'),
          message: detail.message
        }));
        
        return res.status(400).json({
          error: 'Validation Error',
          code: 'VALIDATION_ERROR',
          details,
          requestId: req.id
        });
      }
      next(error);
    }
  };
};

// Validation schemas
const schemas = {
  customerCreate: Joi.object({
    name: Joi.string().trim().min(1).required().messages({
      'string.empty': 'Customer name is required',
      'any.required': 'Customer name is required'
    }),
    email: Joi.string().email().optional().allow('')
  }),

  customerSearch: Joi.object({
    search: Joi.string().max(64).optional().allow('')
  }),

  passCreate: Joi.object({
    type: Joi.string().trim().min(1).required().messages({
      'string.empty': 'Pass type is required',
      'any.required': 'Pass type is required'
    }),
    
    // Either date OR (startDate with optional endDate)
    date: Joi.date().iso().optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    
    // Either customerId OR customerName required
    customerId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional().messages({
      'string.pattern.base': 'Customer ID must be a valid ObjectId'
    }),
    customerName: Joi.string().trim().min(1).optional()
  })
  .custom((value, helpers) => {
    // Ensure either date OR startDate is provided
    if (!value.date && !value.startDate) {
      return helpers.error('custom.dateRequired');
    }
    
    // Ensure only one date pattern is used
    if (value.date && value.startDate) {
      return helpers.error('custom.conflictingDates');
    }
    
    // Ensure either customerId OR customerName is provided
    if (!value.customerId && !value.customerName) {
      return helpers.error('custom.customerRequired');
    }
    
    // Validate endDate is not before startDate
    if (value.startDate && value.endDate && new Date(value.endDate) < new Date(value.startDate)) {
      return helpers.error('custom.endDateBeforeStart');
    }
    
    return value;
  })
  .messages({
    'custom.dateRequired': 'Either date or startDate is required',
    'custom.conflictingDates': 'Cannot provide both date and startDate',
    'custom.customerRequired': 'Either customerId or customerName is required',
    'custom.endDateBeforeStart': 'End date cannot be earlier than start date'
  })
};

module.exports = { validate, schemas };