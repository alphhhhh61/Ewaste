import express from 'express';
import { supabase } from '../config/db.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { deviceId, pickupAddress, preferredDate, preferredTime, specialInstructions } = req.body;

    const { data: device, error: checkError } = await supabase
      .from('devices')
      .select('*')
      .eq('id', deviceId)
      .eq('user_id', req.user.id)
      .single();
    
    if (checkError || !device) {
      return res.status(404).json({ message: 'Device not found or not authorized' });
    }

    if (device.status !== 'Registered') {
      return res.status(400).json({ message: 'Pickup already scheduled or completed for this device' });
    }

    const { data: pickup, error: insertError } = await supabase.from('pickup_requests').insert([{
      user_id: req.user.id,
      device_id: deviceId,
      "pickupAddress": pickupAddress,
      "preferredDate": preferredDate,
      "preferredTime": preferredTime,
      "specialInstructions": specialInstructions,
      status: 'Scheduled'
    }]).select().single();

    if (insertError) throw insertError;

    const { error: updateError } = await supabase
      .from('devices')
      .update({ status: 'Pickup Scheduled', "disposalMethod": 'Home Pickup' })
      .eq('id', deviceId);

    if (updateError) throw updateError;
    
    pickup._id = pickup.id;
    pickup.pickupAddress = pickup.pickupAddress;
    res.status(201).json(pickup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const { data: pickups, error } = await supabase
      .from('pickup_requests')
      .select(`
        *,
        device:devices(id, category, brand, "modelName")
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    const formattedPickups = pickups.map(p => {
      // Supabase joins arrays for one-to-many, objects for many-to-one
      let d = Array.isArray(p.device) ? p.device[0] : p.device;
      if (d) {
        d.modelName = d.modelName; 
        d._id = d.id;
      }
      return {
        ...p,
        _id: p.id,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        pickupAddress: p.pickupAddress,
        preferredDate: p.preferredDate,
        preferredTime: p.preferredTime,
        device: d
      };
    });
    
    res.json(formattedPickups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
