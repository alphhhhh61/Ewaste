import express from 'express';
import Device from '../models/Device.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Register a new device
// @route   POST /api/devices
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { 
      category, 
      brand, 
      modelName, 
      condition, 
      approximateAge, 
      disposalMethod,
      photoUrl // Optional
    } = req.body;

    // Calculate initial credit value logic
    let creditValue = 0;
    if (category === 'Mobile phones') creditValue = 40;
    else if (category === 'Laptops') creditValue = 120;
    else if (category === 'Televisions') creditValue = 150;
    else if (category === 'Tablets') creditValue = 60;
    else if (category === 'Printers') creditValue = 30;
    else if (category === 'Computer accessories') creditValue = 15;
    else if (category === 'Batteries') creditValue = 10;
    
    // Slight deduction for not working or broken condition
    if (condition === 'Not Working') creditValue = Math.floor(creditValue * 0.7);
    if (condition === 'Broken Screen/Parts') creditValue = Math.floor(creditValue * 0.4);

    const device = await Device.create({
      user: req.user._id,
      category,
      brand,
      modelName,
      condition,
      approximateAge,
      disposalMethod,
      creditValue,
      status: disposalMethod === 'Home Pickup' ? 'Pickup Scheduled' : 'Registered'
    });

    res.status(201).json(device);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get user devices
// @route   GET /api/devices
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const devices = await Device.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
