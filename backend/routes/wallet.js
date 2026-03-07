import express from 'express';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get user wallet balance and transactions
// @route   GET /api/wallet
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('walletBalance');
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });

    // Mock data if empty
    if (transactions.length === 0) {
      const mockTransactions = [
        {
          _id: 't1',
          type: 'Credit',
          amount: 150,
          description: 'Recycled Dell Latitude Laptop',
          status: 'Completed',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
        },
        {
          _id: 't2',
          type: 'Credit',
          amount: 40,
          description: 'Recycled Samsung Galaxy S8',
          status: 'Completed',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
        }
      ];
      // Sync mock balance
      user.walletBalance = 190;
      await user.save();

      return res.json({
        balance: 190,
        transactions: mockTransactions
      });
    }

    res.json({
      balance: user.walletBalance,
      transactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Request withdrawal
// @route   POST /api/wallet/withdraw
// @access  Private
router.post('/withdraw', protect, async (req, res) => {
  try {
    const { amount, withdrawalMethod } = req.body;
    
    // Minimum withdrawal threshold
    if (amount < 500) {
      return res.status(400).json({ message: 'Minimum withdrawal amount is ₹500' });
    }

    const user = await User.findById(req.user._id);

    if (user.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // 1. Create pending transaction
    const transaction = await Transaction.create({
      user: req.user._id,
      type: 'Withdrawal',
      amount,
      description: `Withdrawal request via ${withdrawalMethod}`,
      status: 'Pending',
      withdrawalMethod
    });

    // 2. Deduct from user balance
    user.walletBalance -= amount;
    await user.save();

    res.status(201).json({
      message: 'Withdrawal request submitted successfully',
      newBalance: user.walletBalance,
      transaction
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
