const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

CustomerSchema.index({ email: 1 }, { sparse: true });

module.exports = mongoose.model('Customer', CustomerSchema);
