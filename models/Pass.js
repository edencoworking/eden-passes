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

module.exports = mongoose.model('Pass', passSchema);