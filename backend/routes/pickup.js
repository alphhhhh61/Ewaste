import express from 'express';
import PickupRequest from '../models/PickupRequest.js';
import Device from '../models/Device.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Schedule a new pickup
// @route   POST /api/pickups
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { deviceId, pickupAddress, preferredDate, preferredTime, specialInstructions } = req.body;

    // 1. Verify device exists and belongs to user
    const device = await Device.findOne({ _id: deviceId, user: req.user._id });
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found or not authorized' });
    }

    if (device.status !== 'Registered') {
      return res.status(400).json({ message: 'Pickup already scheduled or completed for this device' });
    }

    // 2. Create pickup request
    const pickup = await PickupRequest.create({
      user: req.user._id,
      device: deviceId,
      pickupAddress,
      preferredDate,
      preferredTime,
      specialInstructions
    });

    // 3. Update device status
    device.status = 'Pickup Scheduled';
    device.disposalMethod = 'Home Pickup';
    await device.save();

    res.status(201).json(pickup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get user's pickup requests
// @route   GET /api/pickups
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const pickups = await PickupRequest.find({ user: req.user._id })
      .populate('device', 'category brand modelName')
      .sort({ createdAt: -1 });
    
    res.json(pickups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
