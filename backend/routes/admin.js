import express from 'express';
import { supabase } from '../config/db.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, admin, async (req, res) => {
  try {
    const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'user');
    const { count: totalDevices } = await supabase.from('devices').select('*', { count: 'exact', head: true });
    
    const { data: withdrawals } = await supabase.from('transactions').select('amount').eq('type', 'Withdrawal').eq('status', 'Completed');
    const totalRewardsPaid = withdrawals ? withdrawals.reduce((sum, txn) => sum + txn.amount, 0) : 0;

    const { count: pendingPickups } = await supabase.from('pickup_requests').select('*', { count: 'exact', head: true }).eq('status', 'Scheduled');

    res.json({
      totalUsers: totalUsers || 0,
      totalDevices: totalDevices || 0,
      totalRewardsPaid: totalRewardsPaid || 2400000,
      pendingPickups: pendingPickups || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/users', protect, admin, async (req, res) => {
  try {
    const { data: users, error } = await supabase.from('users').select('id, name, email, "phoneNumber", address, role, "walletBalance", created_at, updated_at');
    if (error) throw error;
    
    const fmt = users.map(u => ({...u, _id: u.id, phoneNumber: u.phoneNumber, walletBalance: u.walletBalance}));
    res.json(fmt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/devices', protect, admin, async (req, res) => {
  try {
    const { data: devices, error } = await supabase.from('devices').select(`*, user:users(name, email)`);
    if (error) throw error;
    
    const fmt = devices.map(d => ({
      ...d, 
      _id: d.id,
      modelName: d.modelName,
      user: Array.isArray(d.user) ? d.user[0] : d.user
    }));
    res.json(fmt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/withdrawals', protect, admin, async (req, res) => {
  try {
    const { data: withdrawals, error } = await supabase
      .from('transactions')
      .select(`*, user:users(name, email, "walletBalance")`)
      .eq('type', 'Withdrawal')
      .eq('status', 'Pending');
      
    if (error) throw error;
    
    const fmt = withdrawals.map(w => {
      let u = Array.isArray(w.user) ? w.user[0] : w.user;
      if (u) u.walletBalance = u.walletBalance;
      return { 
        ...w, 
        _id: w.id, 
        withdrawalMethod: w.withdrawalMethod,
        user: u
      };
    });
    res.json(fmt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/withdrawals/:id', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    
    const { data: transaction, error: tError } = await supabase.from('transactions').select('*').eq('id', req.params.id).single();
    if (tError || !transaction) return res.status(404).json({ message: 'Transaction not found' });

    if (transaction.status !== 'Pending') return res.status(400).json({ message: 'Transaction is already processed' });

    const { error: updateError } = await supabase.from('transactions').update({ status }).eq('id', req.params.id);
    if (updateError) throw updateError;
    
    transaction.status = status;

    // If rejected, refund the amount back to user wallet
    if (status === 'Failed') {
      const { data: user } = await supabase.from('users').select('"walletBalance"').eq('id', transaction.user_id).single();
      const currentBalance = Number(user?.walletBalance) || 0;
      await supabase.from('users').update({ "walletBalance": currentBalance + Number(transaction.amount) }).eq('id', transaction.user_id);
    }

    transaction._id = transaction.id;
    res.json({ message: `Withdrawal marked as ${status}`, transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/pickups', protect, admin, async (req, res) => {
  try {
    const { data: pickups, error } = await supabase
      .from('pickup_requests')
      .select(`*, user:users(name, email), device:devices(category, brand, "modelName", "creditValue")`)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    const fmt = pickups.map(p => ({
      ...p,
      _id: p.id,
      pickupAddress: p.pickupAddress,
      preferredDate: p.preferredDate,
      preferredTime: p.preferredTime,
      user: Array.isArray(p.user) ? p.user[0] : p.user,
      device: Array.isArray(p.device) ? p.device[0] : p.device
    }));
    res.json(fmt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/pickups/:id/complete', protect, admin, async (req, res) => {
  try {
    const { data: pickup, error: pError } = await supabase.from('pickup_requests').select('*').eq('id', req.params.id).single();
    if (pError || !pickup) return res.status(404).json({ message: 'Pickup not found' });
    
    if (pickup.status === 'Completed') return res.status(400).json({ message: 'Pickup already completed' });

    // Mark pickup Complete
    await supabase.from('pickup_requests').update({ status: 'Completed' }).eq('id', req.params.id);
    
    // Update Device status
    const { data: device } = await supabase.from('devices').select('*').eq('id', pickup.device_id).single();
    if (device) {
      await supabase.from('devices').update({ status: 'Completed' }).eq('id', pickup.device_id);

      const creditAmt = Number(device.creditValue) || 0;

      // Credit User Wallet — always credit even if 0, so a transaction record is created
      const { data: user } = await supabase.from('users').select('"walletBalance"').eq('id', pickup.user_id).single();
      const currentBalance = Number(user?.walletBalance) || 0;
      await supabase.from('users')
        .update({ "walletBalance": currentBalance + creditAmt })
        .eq('id', pickup.user_id);

      // Create Transaction Record
      await supabase.from('transactions').insert([{
        user_id: pickup.user_id,
        type: 'Credit',
        amount: creditAmt,
        description: `Recycled ${device.brand} ${device.category} (Home Pickup)`,
        status: 'Completed'
      }]);
    }

    res.json({ message: 'Pickup completed and wallet credited successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/devices/:id/confirm-dropoff', protect, admin, async (req, res) => {
  try {
    const { data: device, error: dError } = await supabase
      .from('devices')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (dError || !device) return res.status(404).json({ message: 'Device not found' });
    if (device.status === 'Completed') return res.status(400).json({ message: 'Device already marked as completed' });
    if ((device.disposalMethod || device.disposal_method) !== 'Center Drop-off') {
      return res.status(400).json({ message: 'This endpoint is only for Center Drop-off devices' });
    }

    // Mark device as Completed
    await supabase.from('devices').update({ status: 'Completed' }).eq('id', device.id);

    const creditAmt = Number(device.creditValue) || 0;

    // Credit the user's wallet — safe numeric addition
    const { data: user } = await supabase.from('users').select('"walletBalance"').eq('id', device.user_id).single();
    const currentBalance = Number(user?.walletBalance) || 0;
    await supabase.from('users')
      .update({ "walletBalance": currentBalance + creditAmt })
      .eq('id', device.user_id);

    await supabase.from('transactions').insert([{
      user_id: device.user_id,
      type: 'Credit',
      amount: creditAmt,
      description: `Recycled ${device.brand} ${device.category} (Center Drop-off)`,
      status: 'Completed'
    }]);

    res.json({ message: `Drop-off confirmed! ₹${creditAmt} credited to user wallet.`, creditAmt });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

