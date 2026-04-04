import express from 'express';
import { supabase } from '../config/db.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { category, brand, modelName, condition, approximateAge, disposalMethod } = req.body;
    let creditValue = 0;
    if (category === 'Mobile phones') creditValue = 40;
    else if (category === 'Laptops') creditValue = 120;
    else if (category === 'Televisions') creditValue = 150;
    else if (category === 'Tablets') creditValue = 60;
    else if (category === 'Printers') creditValue = 30;
    else if (category === 'Computer accessories') creditValue = 15;
    else if (category === 'Batteries') creditValue = 10;
    
    if (condition === 'Not Working') creditValue = Math.floor(creditValue * 0.7);
    if (condition === 'Broken Screen/Parts') creditValue = Math.floor(creditValue * 0.4);

    // All devices start as 'Registered'. If Home Pickup, user schedules separately.
    const status = 'Registered';

    const { data: device, error } = await supabase.from('devices').insert([{
      user_id: req.user.id,
      category,
      brand,
      "modelName": modelName,
      condition,
      "approximateAge": approximateAge,
      "disposalMethod": disposalMethod,
      "creditValue": creditValue,
      status
    }]).select().single();

    if (error) throw error;
    
    device._id = device.id;
    device.modelName = device.modelName;
    res.status(201).json(device);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const { data: devices, error } = await supabase
      .from('devices')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    const formattedDevices = devices.map(d => ({ 
      ...d, 
      _id: d.id, 
      createdAt: d.created_at, 
      updatedAt: d.updated_at,
      modelName: d.modelName,
      creditValue: d.creditValue
    }));
    res.json(formattedDevices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the device first to verify ownership and status
    const { data: device, error: fetchError } = await supabase
      .from('devices')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError || !device) {
      return res.status(404).json({ message: 'Device not found or not authorized.' });
    }

    if (device.status !== 'Registered') {
      return res.status(400).json({ message: 'Only devices with status "Registered" can be cancelled.' });
    }

    const { error: deleteError } = await supabase
      .from('devices')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (deleteError) throw deleteError;

    res.json({ message: 'Device registration cancelled successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

