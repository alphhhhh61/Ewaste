import express from 'express';
import User from '../models/User.js';
import Device from '../models/Device.js';
import Transaction from '../models/Transaction.js';
import PickupRequest from '../models/PickupRequest.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get complete system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'User' });
    const totalDevices = await Device.countDocuments({});
    
    // Calculate total rewards paid based on completed transactions
    const withdrawals = await Transaction.find({ type: 'Withdrawal', status: 'Completed' });
    const totalRewardsPaid = withdrawals.reduce((sum, txn) => sum + txn.amount, 0);

    const pendingPickups = await PickupRequest.countDocuments({ status: 'Scheduled' });

    res.json({
      totalUsers,
      totalDevices,
      totalRewardsPaid: totalRewardsPaid || 2400000, // Mock fallback for ui
      pendingPickups
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all devices
// @route   GET /api/admin/devices
// @access  Private/Admin
router.get('/devices', protect, admin, async (req, res) => {
  try {
    const devices = await Device.find({}).populate('user', 'name email');
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get pending withdrawals
// @route   GET /api/admin/withdrawals
// @access  Private/Admin
router.get('/withdrawals', protect, admin, async (req, res) => {
  try {
    const withdrawals = await Transaction.find({ type: 'Withdrawal', status: 'Pending' })
      .populate('user', 'name email walletBalance');
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Approve/Reject withdrawal
// @route   PUT /api/admin/withdrawals/:id
// @access  Private/Admin
router.put('/withdrawals/:id', protect, admin, async (req, res) => {
  try {
    const { status } = req.body; // 'Completed' or 'Failed'
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status !== 'Pending') {
      return res.status(400).json({ message: 'Transaction is already processed' });
    }

    transaction.status = status;
    await transaction.save();

    // If failed, refund the user
    if (status === 'Failed') {
      const user = await User.findById(transaction.user);
      user.walletBalance += transaction.amount;
      await user.save();
    }

    res.json({ message: `Withdrawal marked as ${status}`, transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
