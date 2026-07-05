const Portfolio = require('../models/Portfolio');

// @desc    Get user portfolio
// @route   GET /api/portfolio
// @access  Private
const getPortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ user: req.user._id });

    if (!portfolio) {
      // Create empty portfolio if it doesn't exist
      portfolio = await Portfolio.create({
        user: req.user._id,
        holdings: []
      });
    }

    res.status(200).json(portfolio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPortfolio,
};
