const express = require('express');
const router = express.Router();
const { getPortfolio } = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getPortfolio);

module.exports = router;
