const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: String,
  createdAt: { type: Date, default: Date.now }
});

// Sparse index on email (only indexes documents that have email field)
CustomerSchema.index({ email: 1 }, { sparse: true });

module.exports = mongoose.model('Customer', CustomerSchema);