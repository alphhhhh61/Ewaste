import express from 'express';
import { supabase } from '../config/db.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data: centers, error } = await supabase.from('collection_centers').select('*');
    if (error) throw error;
    
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
    
    const formattedCenters = centers.map(c => ({
      ...c,
      _id: c.id,
      operatingHours: c.operatingHours,
      contactNumber: c.contactNumber,
      acceptedCategories: c.acceptedCategories,
      coordinates: { lat: c.lat, lng: c.lng }
    }));
    res.json(formattedCenters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ADMIN: Create a new collection center
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, address, city, operatingHours, contactNumber, acceptedCategories, lat, lng } = req.body;
    const { data: center, error } = await supabase.from('collection_centers').insert([{
      name, address, city,
      "operatingHours": operatingHours,
      "contactNumber": contactNumber,
      "acceptedCategories": acceptedCategories || [],
      lat: lat || null,
      lng: lng || null
    }]).select().single();
    if (error) throw error;
    res.status(201).json({ ...center, _id: center.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: Delete a collection center
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const { error } = await supabase.from('collection_centers').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Collection center deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
