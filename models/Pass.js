const mongoose = require('mongoose');

const PassSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true,
    trim: true
  },
  // Single-day pass
  date: { 
    type: Date, 
    required: function() {
      return !this.startDate;
    }
  },
  // Range pass
  startDate: { 
    type: Date,
    required: function() {
      return !this.date;
    }
  },
  endDate: { 
    type: Date,
    required: function() {
      return !!this.startDate;
    }
  },
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true 
  },
  createdAt: { type: Date, default: Date.now }
});

// Validation to ensure either date OR startDate (but not both)
PassSchema.pre('validate', function(next) {
  if (this.date && this.startDate) {
    const error = new Error('Cannot specify both date and startDate. Use date for single-day passes or startDate/endDate for range passes.');
    return next(error);
  }
  
  if (!this.date && !this.startDate) {
    const error = new Error('Either date or startDate must be provided.');
    return next(error);
  }
  
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    const error = new Error('endDate must be greater than or equal to startDate.');
    return next(error);
  }
  
  next();
});

// Method to serialize pass data with consistent output format
PassSchema.methods.serialize = function() {
  const pass = this.toObject();
  
  return {
    _id: pass._id,
    type: pass.type,
    date: pass.date || (pass.startDate ? pass.startDate : null),
    startDate: pass.startDate || null,
    endDate: pass.endDate || null,
    customer: pass.customer ? {
      _id: pass.customer._id || pass.customer,
      name: pass.customer.name || ''
    } : null,
    createdAt: pass.createdAt
  };
};

module.exports = mongoose.model('Pass', PassSchema);