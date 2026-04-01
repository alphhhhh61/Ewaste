import express from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/db.js';
import generateToken from '../utils/generateToken.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, phoneNumber, address } = req.body;

    const { data: userExists } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const finalPhone = phone || phoneNumber || '';

    const { data: user, error } = await supabase.from('users').insert([{
      name, email, password: hashedPassword, "phoneNumber": finalPhone, address, role: 'user', "walletBalance": 0
    }]).select().single();

    if (error) throw error;

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
    
    if (error) throw error;

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
