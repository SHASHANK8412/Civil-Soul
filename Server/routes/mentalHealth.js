const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/mental-health/resources
// @desc    Get mental health resources
// @access  Public
router.get('/resources', async (req, res) => {
  try {
    const resources = [
      {
        category: 'Crisis Support',
        items: [
          {
            title: 'National Suicide Prevention Lifeline',
            phone: '988',
            description: '24/7 crisis support',
            website: 'https://suicidepreventionlifeline.org'
          },
          {
            title: 'Crisis Text Line',
            phone: 'Text HOME to 741741',
            description: 'Free 24/7 crisis support via text'
          }
        ]
      },
      {
        category: 'Professional Help',
        items: [
          {
            title: 'Psychology Today',
            description: 'Find therapists in your area',
            website: 'https://psychologytoday.com'
          },
          {
            title: 'SAMHSA Treatment Locator',
            description: 'Find mental health treatment facilities',
            website: 'https://findtreatment.samhsa.gov'
          }
        ]
      },
      {
        category: 'Self-Help',
        items: [
          {
            title: 'Mindfulness Apps',
            description: 'Headspace, Calm, Insight Timer'
          },
          {
            title: 'Mood Tracking',
            description: 'Daylio, Mood Meter, eMoods'
          }
        ]
      }
    ];

    res.json({ success: true, data: resources });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
