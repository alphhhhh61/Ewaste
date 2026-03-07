import express from 'express';
import Device from '../models/Device.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get user dashboard stats & recent activity
// @route   GET /api/dashboard
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // 1. Get user data (for wallet balance)
    const user = await User.findById(req.user._id).select('walletBalance');

    // 2. Get user's devices
    const devices = await Device.find({ user: req.user._id }).sort({ createdAt: -1 });

    // 3. Calculate statistics
    const totalDevices = devices.length;
    
    const pickedUpDevices = devices.filter(
      (d) => d.status === 'Picked Up' || d.status === 'Completed'
    ).length;

    const pendingPickups = devices.filter(
      (d) => d.status === 'Pickup Scheduled' || (d.status === 'Registered' && d.disposalMethod === 'Home Pickup')
    ).length;

    // 4. Format recent activity (last 5 devices)
    const recentActivity = devices.slice(0, 5).map(device => {
      let actionText = '';
      let amount = 0;

      if (device.status === 'Registered') {
        actionText = `Registered ${device.brand} ${device.category}`;
      } else if (device.status === 'Picked Up' || device.status === 'Completed') {
        actionText = `${device.brand} ${device.category} Collected`;
        amount = device.creditValue || 0;
      } else {
        actionText = `Pickup Scheduled for ${device.brand}`;
      }

      return {
        id: device._id,
        action: actionText,
        date: device.updatedAt || device.createdAt,
        type: device.status === 'Completed' || device.status === 'Picked Up' ? 'credit' : 'info',
        amount: amount,
        status: device.status
      };
    });

    res.json({
      stats: {
        totalDevices,
        devicesCollected: pickedUpDevices,
        walletBalance: user.walletBalance,
        pendingRequests: pendingPickups,
      },
      recentActivity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Mock route: Register a test device
// @route   POST /api/dashboard/mock-device
// @access  Private
router.post('/mock-device', protect, async (req, res) => {
  try {
    const { category, brand, modelName, condition, approximateAge, disposalMethod } = req.body;
    
    // Auto-calculate some random dummy credits based on category for MVP
    let creditValue = 0;
    if (category === 'Mobile phones') creditValue = 40;
    if (category === 'Laptops') creditValue = 120;
    if (category === 'Televisions') creditValue = 150;
    if (category === 'Batteries') creditValue = 10;

    const device = await Device.create({
      user: req.user._id,
      category,
      brand,
      modelName,
      condition,
      approximateAge,
      disposalMethod,
      creditValue,
    });

    res.status(201).json(device);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
