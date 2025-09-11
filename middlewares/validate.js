'use strict';

/**
 * Generic Joi validation middleware
 * Returns standardized error envelope on validation failure
 * @param {Object} schema - Joi schema to validate against
 * @returns {Function} Express middleware function
 */
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));
      
      return res.status(400).json({
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details,
        requestId: req.id
      });
    }
    
    // Replace req.body with validated/transformed value
    req.body = value;
    next();
  };
}

module.exports = validate;