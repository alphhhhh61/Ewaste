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

    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (txError) throw txError;

    const formattedTransactions = transactions.map(t => ({
      ...t,
      _id: t.id,
      createdAt: t.created_at,
      withdrawalMethod: t.withdrawalMethod,
      updatedAt: t.updated_at
    }));

    res.json({
      balance: user.walletBalance,
      transactions: formattedTransactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/withdraw', protect, async (req, res) => {
  try {
    const { amount, withdrawalMethod } = req.body;
    
    if (amount < 500) {
      return res.status(400).json({ message: 'Minimum withdrawal amount is ₹500' });
    }

    const { data: user, error: uError } = await supabase
      .from('users')
      .select('"walletBalance"')
      .eq('id', req.user.id)
      .single();
    
    if (uError) throw uError;

    if (user.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const { data: transaction, error: insertError } = await supabase.from('transactions').insert([{
      user_id: req.user.id,
      type: 'Withdrawal',
      amount,
      description: `Withdrawal request via ${withdrawalMethod}`,
      status: 'Pending',
      "withdrawalMethod": withdrawalMethod
    }]).select().single();

    if (insertError) throw insertError;

    const newBalance = user.walletBalance - amount;
    const { error: updateError } = await supabase
      .from('users')
      .update({ "walletBalance": newBalance })
      .eq('id', req.user.id);
      
    if (updateError) throw updateError;
    
    transaction._id = transaction.id;
    res.status(201).json({
      message: 'Withdrawal request submitted successfully',
      newBalance,
      transaction
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
