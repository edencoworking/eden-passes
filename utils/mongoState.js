'use strict';

const mongoose = require('mongoose');

/**
 * Maps mongoose connection readyState to human-readable strings
 * @returns {string} Connection state description
 */
function mongoState() {
  const state = mongoose.connection.readyState;
  
  switch (state) {
    case 0:
      return 'disconnected';
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'unknown';
  }
}

module.exports = { mongoState };