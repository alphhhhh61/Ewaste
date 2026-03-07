import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import deviceRoutes from './routes/device.js';
import centerRoutes from './routes/center.js';
import pickupRoutes from './routes/pickup.js';
import walletRoutes from './routes/wallet.js';
import adminRoutes from './routes/admin.js';

// Middleware
app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/centers', centerRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/admin', adminRoutes);

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
