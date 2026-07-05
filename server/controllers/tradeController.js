const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');

// @desc    Execute a trade (BUY or SELL)
// @route   POST /api/trade
// @access  Private
const executeTrade = async (req, res) => {
  const { type, symbol, companyName, quantity, price } = req.body;

  if (!type || !symbol || !companyName || !quantity || !price) {
    return res.status(400).json({ message: 'Please provide all trade details' });
  }

  if (type !== 'BUY' && type !== 'SELL') {
    return res.status(400).json({ message: 'Invalid trade type' });
  }

  const numQuantity = Number(quantity);
  const numPrice = Number(price);
  const totalAmount = numQuantity * numPrice;

  try {
    const user = await User.findById(req.user._id);
    let portfolio = await Portfolio.findOne({ user: req.user._id });

    if (!portfolio) {
      portfolio = await Portfolio.create({ user: req.user._id, holdings: [] });
    }

    if (type === 'BUY') {
      if (user.virtualBalance < totalAmount) {
        return res.status(400).json({ message: 'Insufficient funds' });
      }

      // Deduct balance
      user.virtualBalance -= totalAmount;
      await user.save();

      // Update portfolio
      const holdingIndex = portfolio.holdings.findIndex(h => h.symbol === symbol);
      if (holdingIndex >= 0) {
        const holding = portfolio.holdings[holdingIndex];
        const newTotalCost = (holding.quantity * holding.averagePrice) + totalAmount;
        holding.quantity += numQuantity;
        holding.averagePrice = newTotalCost / holding.quantity;
      } else {
        portfolio.holdings.push({
          symbol,
          companyName,
          quantity: numQuantity,
          averagePrice: numPrice
        });
      }
      await portfolio.save();

    } else if (type === 'SELL') {
      const holdingIndex = portfolio.holdings.findIndex(h => h.symbol === symbol);
      if (holdingIndex === -1 || portfolio.holdings[holdingIndex].quantity < numQuantity) {
        return res.status(400).json({ message: 'Insufficient shares to sell' });
      }

      // Add balance
      user.virtualBalance += totalAmount;
      await user.save();

      // Update portfolio
      portfolio.holdings[holdingIndex].quantity -= numQuantity;
      if (portfolio.holdings[holdingIndex].quantity === 0) {
        portfolio.holdings.splice(holdingIndex, 1);
      }
      await portfolio.save();
    }

    // Record transaction
    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      symbol,
      quantity: numQuantity,
      price: numPrice,
      totalAmount
    });

    res.status(201).json({
      message: 'Trade executed successfully',
      transaction,
      balance: user.virtualBalance
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user transactions
// @route   GET /api/trade/history
// @access  Private
const getTransactionHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ timestamp: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  executeTrade,
  getTransactionHistory
};
