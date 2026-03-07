import express from 'express';
import CollectionCenter from '../models/CollectionCenter.js';

const router = express.Router();

// @desc    Fetch all collection centers
// @route   GET /api/centers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const centers = await CollectionCenter.find({});
    
    // If no centers exist yet (empty DB), return some mock data for the UI
    if (centers.length === 0) {
      const mockCenters = [
        {
          _id: '1',
          name: 'GreenEarth E-Waste Hub',
          address: '123 Eco Street, Tech Park',
          city: 'Bangalore',
          operatingHours: '9:00 AM - 6:00 PM (Mon-Sat)',
          contactNumber: '+91 98765 43210',
          acceptedCategories: ['Mobile phones', 'Laptops', 'Tablets', 'Computer accessories'],
          coordinates: { lat: 12.9716, lng: 77.5946 }
        },
        {
          _id: '2',
          name: 'EcoRecycle City Center',
          address: '45 Circular Road, Downtown',
          city: 'Mumbai',
          operatingHours: '10:00 AM - 7:00 PM (Everyday)',
          contactNumber: '+91 87654 32109',
          acceptedCategories: ['Televisions', 'Printers', 'Laptops', 'Batteries'],
          coordinates: { lat: 19.0760, lng: 72.8777 }
        },
        {
          _id: '3',
          name: 'TechScrap Solutions',
          address: 'Phase 2, Industrial Area',
          city: 'Delhi',
          operatingHours: '8:00 AM - 5:00 PM (Mon-Fri)',
          contactNumber: '+91 76543 21098',
          acceptedCategories: ['Mobile phones', 'Tablets', 'Batteries', 'Computer accessories'],
          coordinates: { lat: 28.7041, lng: 77.1025 }
        }
      ];
      return res.json(mockCenters);
    }
    
    res.json(centers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
