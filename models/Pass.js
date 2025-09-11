const mongoose = require('mongoose');

const passSchema = new mongoose.Schema({
  type: { type: String, required: true, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true }
}, { timestamps: true });

// Ensure endDate defaults to startDate if not provided
passSchema.pre('save', function(next) {
  if (!this.endDate) {
    this.endDate = this.startDate;
  }
  next();
});

// Performance indexes
passSchema.index({ customer: 1, startDate: -1 }); // Optimize customer pass queries
passSchema.index({ type: 1 }); // Optimize queries by pass type

module.exports = mongoose.model('Pass', passSchema);