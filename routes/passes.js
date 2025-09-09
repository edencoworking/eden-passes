// Example content for routes/passes.js

const express = require('express');
const router = express.Router();

router.get('/passes', (req, res) => {
    res.json({ message: 'Fetching all passes' });
});

module.exports = router;