const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Elderly care opportunities
router.get('/opportunities', async (req, res) => {
  try {
    const opportunities = [
      {
        title: 'Senior Companion Program',
        description: 'Provide companionship to elderly residents in care homes',
        location: 'Local nursing homes',
        impact: 'Reduce loneliness and improve quality of life for seniors',
        skills: ['Communication', 'Empathy', 'Patience'],
        duration: '2-3 hours per visit'
      },
      {
        title: 'Technology Training for Seniors',
        description: 'Help elderly people learn to use smartphones and computers',
        location: 'Senior centers',
        impact: 'Bridge the digital divide and keep seniors connected',
        skills: ['Technology knowledge', 'Teaching', 'Patience'],
        duration: '1-2 hours per session'
      },
      {
        title: 'Meals on Wheels',
        description: 'Deliver nutritious meals to homebound elderly',
        location: 'Community routes',
        impact: 'Ensure proper nutrition and wellness checks',
        skills: ['Driving', 'Communication', 'Reliability'],
        duration: '3-4 hours'
      }
    ];

    res.json({ success: true, data: opportunities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
