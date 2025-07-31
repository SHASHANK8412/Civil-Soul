const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Blood donation opportunities
router.get('/drives', async (req, res) => {
  try {
    const drives = [
      {
        title: 'Rural Health Center Blood Drive',
        description: 'Mobile blood donation camp in underserved rural areas',
        location: 'Rural communities',
        impact: 'Provide life-saving blood to remote medical facilities',
        requirements: ['Age 18-65', 'Weight >50kg', 'Good health'],
        duration: '1 hour donation + recovery time'
      },
      {
        title: 'Emergency Blood Drive',
        description: 'Urgent blood collection for disaster relief',
        location: 'Mobile units',
        impact: 'Support emergency medical response',
        requirements: ['All blood types needed', 'Health screening required'],
        duration: '1-2 hours'
      },
      {
        title: 'Regular Donation Program',
        description: 'Scheduled blood donations at fixed centers',
        location: 'Blood banks',
        impact: 'Maintain steady blood supply for hospitals',
        requirements: ['Regular health check', 'Commitment to schedule'],
        duration: '1 hour per donation'
      }
    ];

    res.json({ success: true, data: drives });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
