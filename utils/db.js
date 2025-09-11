const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  // Check if already connected or connecting
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/edenpasses';
    
    await mongoose.connect(MONGO_URI);

    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

module.exports = { connectDB };