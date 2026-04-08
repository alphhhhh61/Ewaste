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
      
      if (error || !user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Map UUID id to _id for backward compatibility with frontend
      user._id = user.id;
      req.user = user;

      return next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
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
