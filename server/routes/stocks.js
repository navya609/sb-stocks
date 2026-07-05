const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Mock stock data
const mockStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, change: 1.2 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 340.20, change: -0.5 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 135.80, change: 0.8 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 130.40, change: 2.1 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 215.30, change: -3.4 },
  { symbol: 'META', name: 'Meta Platforms', price: 300.10, change: 1.5 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 450.00, change: 4.2 },
];

// @desc    Get mock stock listings
// @route   GET /api/stocks
// @access  Private
router.get('/', protect, (req, res) => {
  const query = req.query.q;
  if (query) {
    const filtered = mockStocks.filter(s => 
      s.symbol.toLowerCase().includes(query.toLowerCase()) || 
      s.name.toLowerCase().includes(query.toLowerCase())
    );
    return res.json(filtered);
  }
  res.json(mockStocks);
});

// @desc    Get mock stock by symbol
// @route   GET /api/stocks/:symbol
// @access  Private
router.get('/:symbol', protect, (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const stock = mockStocks.find(s => s.symbol === symbol);
  if (stock) {
    res.json(stock);
  } else {
    // Return a dynamically generated price if not found in mock list
    res.json({
      symbol,
      name: `${symbol} Corporation`,
      price: Math.floor(Math.random() * 500) + 10,
      change: (Math.random() * 5 - 2.5).toFixed(2)
    });
  }
});

module.exports = router;
