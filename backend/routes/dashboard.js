import express from 'express';
import { supabase } from '../config/db.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('"walletBalance"')
      .eq('id', req.user.id)
      .single();

    if (userError) throw userError;

    const { data: devices, error: deviceError } = await supabase
      .from('devices')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (deviceError) throw deviceError;

    const totalDevices = devices.length;
    
    const pickedUpDevices = devices.filter(
      (d) => d.status === 'Picked Up' || d.status === 'Completed'
    ).length;

    const pendingPickups = devices.filter(
      (d) => d.status === 'Pickup Scheduled' || (d.status === 'Registered' && d.disposalMethod === 'Home Pickup')
    ).length;

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
        id: device.id,
        action: actionText,
        date: device.updated_at || device.created_at,
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

router.post('/mock-device', protect, async (req, res) => {
  try {
    const { category, brand, modelName, condition, approximateAge, disposalMethod } = req.body;
    
    let creditValue = 0;
    if (category === 'Mobile phones') creditValue = 40;
    if (category === 'Laptops') creditValue = 120;
    if (category === 'Televisions') creditValue = 150;
    if (category === 'Batteries') creditValue = 10;

    const { data: device, error } = await supabase.from('devices').insert([{
      user_id: req.user.id,
      category,
      brand,
      "modelName": modelName,
      condition,
      "approximateAge": approximateAge,
      "disposalMethod": disposalMethod,
      "creditValue": creditValue,
      status: 'Registered'
    }]).select().single();

    if (error) throw error;

    device._id = device.id;
    device.modelName = device.modelName;
    res.status(201).json(device);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
