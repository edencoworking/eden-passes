const mongoose = require('mongoose');

const PassSchema = new mongoose.Schema({
  type: { type: String, required: true },
  // Support both single date and start/end date formats
  date: { type: Date }, // For single date passes
  startDate: { type: Date }, // For date range passes
  endDate: { type: Date }, // For date range passes
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pass', PassSchema);