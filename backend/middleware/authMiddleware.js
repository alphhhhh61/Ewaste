import jwt from 'jsonwebtoken';
import { supabase } from '../config/db.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const { data: user, error } = await supabase
        .from('users')
        .select('id, name, email, "phoneNumber", address, role, "walletBalance"')
        .eq('id', decoded.id)
        .single();
      
      if (error || !user) throw new Error('Not authorized');

      // Map UUID id to _id for backward compatibility with frontend
      user._id = user.id;
      user.walletBalance = user.walletBalance; // ensure correct casing
      req.user = user;

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

export { protect, admin };
