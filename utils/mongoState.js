const mongoose = require('mongoose');

const getMongoState = () => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  return {
    numerical: state,
    human: states[state] || 'unknown'
  };
};

module.exports = { getMongoState };