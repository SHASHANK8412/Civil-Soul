const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Animal welfare opportunities
router.get('/opportunities', async (req, res) => {
  try {
    const opportunities = [
      {
        title: 'Animal Shelter Volunteer',
        description: 'Help care for rescued animals at local shelters',
        location: 'Animal shelters',
        impact: 'Provide care and love to abandoned animals',
        skills: ['Animal handling', 'Cleaning', 'Feeding'],
        duration: '3-4 hours per shift'
      },
      {
        title: 'Wildlife Conservation',
        description: 'Participate in wildlife habitat restoration',
        location: 'Nature reserves',
        impact: 'Protect endangered species and their habitats',
        skills: ['Environmental knowledge', 'Physical activity'],
        duration: 'Full day activities'
      },
      {
        title: 'Stray Animal Rescue',
        description: 'Help rescue and rehabilitate stray animals',
        location: 'Urban areas',
        impact: 'Reduce stray animal population and suffering',
        skills: ['Animal handling', 'First aid', 'Transportation'],
        duration: 'As needed basis'
      },
      {
        title: 'Pet Therapy Program',
        description: 'Bring therapy animals to hospitals and elderly homes',
        location: 'Healthcare facilities',
        impact: 'Improve patient wellbeing through animal interaction',
        skills: ['Animal training', 'Communication', 'Empathy'],
        duration: '2-3 hours per visit'
      }
    ];

    res.json({ success: true, data: opportunities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
