const express = require('express');
const router = express.Router();
const { executeTrade, getTransactionHistory } = require('../controllers/tradeController');
const { protect } = require('../middleware/auth');

router.post('/', protect, executeTrade);
router.get('/history', protect, getTransactionHistory);

module.exports = router;
