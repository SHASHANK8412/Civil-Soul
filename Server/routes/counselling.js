const express = require('express');
const CounsellingSession = require('../models/CounsellingSession');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/counselling/counselors
// @desc    Get available counselors
// @access  Public
router.get('/counselors', async (req, res) => {
  try {
    const counselors = await User.find({ role: 'counselor' })
      .select('firstName lastName profileImage specializations availability');
    
    res.json({ success: true, data: counselors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/counselling/book
// @desc    Book counselling session
// @access  Private
router.post('/book', auth, async (req, res) => {
  try {
    const {
      counselorId,
      scheduledDateTime,
      sessionType,
      mode,
      topic,
      urgencyLevel,
      userNotes
    } = req.body;

    // Verify counselor exists
    const counselor = await User.findById(counselorId);
    if (!counselor || counselor.role !== 'counselor') {
      return res.status(404).json({ message: 'Counselor not found' });
    }

    // Check for scheduling conflicts
    const existingSession = await CounsellingSession.findOne({
      counselor: counselorId,
      scheduledDateTime: new Date(scheduledDateTime),
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (existingSession) {
      return res.status(400).json({ message: 'Time slot not available' });
    }

    const session = new CounsellingSession({
      user: req.user.id,
      counselor: counselorId,
      scheduledDateTime: new Date(scheduledDateTime),
      sessionType,
      mode,
      topic,
      urgencyLevel,
      notes: { userNotes }
    });

    await session.save();

    const populatedSession = await CounsellingSession.findById(session._id)
      .populate('counselor', 'firstName lastName profileImage');

    res.status(201).json({ success: true, data: populatedSession });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/counselling/my-sessions
// @desc    Get user's counselling sessions
// @access  Private
router.get('/my-sessions', auth, async (req, res) => {
  try {
    const sessions = await CounsellingSession.find({ user: req.user.id })
      .populate('counselor', 'firstName lastName profileImage')
      .sort({ scheduledDateTime: -1 });

    res.json({ success: true, data: sessions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
