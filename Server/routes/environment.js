const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Environment volunteering opportunities
router.get('/opportunities', async (req, res) => {
  try {
    const opportunities = [
      {
        title: 'Tree Planting Drive',
        description: 'Help plant native trees in urban areas',
        location: 'City Parks',
        impact: 'Combat climate change and improve air quality',
        skills: ['Physical activity', 'Environmental awareness'],
        duration: '4-6 hours'
      },
      {
        title: 'Beach Cleanup',
        description: 'Remove plastic waste from beaches and waterways',
        location: 'Coastal areas',
        impact: 'Protect marine life and ecosystems',
        skills: ['Physical activity', 'Environmental stewardship'],
        duration: '3-4 hours'
      },
      {
        title: 'Urban Gardening',
        description: 'Maintain community gardens and green spaces',
        location: 'Community centers',
        impact: 'Promote local food production and green spaces',
        skills: ['Gardening', 'Community engagement'],
        duration: 'Ongoing'
      }
    ];

    res.json({ success: true, data: opportunities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
