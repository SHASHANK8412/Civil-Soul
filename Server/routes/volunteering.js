const express = require('express');
const { body, validationResult } = require('express-validator');
const VolunteeringOpportunity = require('../models/VolunteeringOpportunity');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/volunteering
// @desc    Get all volunteering opportunities
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      city,
      state,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { status: 'active' };

    // Apply filters
    if (category) query.category = category;
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (state) query['location.state'] = new RegExp(state, 'i');
    if (search) {
      query.$text = { $search: search };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
      populate: [
        { path: 'createdBy', select: 'firstName lastName profileImage' },
        { path: 'volunteers.user', select: 'firstName lastName profileImage' }
      ]
    };

    const opportunities = await VolunteeringOpportunity.find(query)
      .populate(options.populate)
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit)
      .exec();

    const total = await VolunteeringOpportunity.countDocuments(query);

    res.json({
      success: true,
      data: opportunities,
      pagination: {
        current: options.page,
        pages: Math.ceil(total / options.limit),
        total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/volunteering/:id
// @desc    Get single volunteering opportunity
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const opportunity = await VolunteeringOpportunity.findById(req.params.id)
      .populate('createdBy', 'firstName lastName profileImage')
      .populate('volunteers.user', 'firstName lastName profileImage');

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    res.json({ success: true, data: opportunity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/volunteering
// @desc    Create volunteering opportunity
// @access  Private (Admin/Organization)
router.post('/', [
  auth,
  authorize('admin', 'counselor'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['environment', 'elderly-care', 'animal-welfare', 'blood-donation', 'education', 'community-service', 'disaster-relief', 'healthcare']).withMessage('Valid category is required'),
  body('location.address').trim().notEmpty().withMessage('Address is required'),
  body('location.city').trim().notEmpty().withMessage('City is required'),
  body('location.state').trim().notEmpty().withMessage('State is required'),
  body('schedule.startDate').isISO8601().withMessage('Valid start date is required'),
  body('capacity.maxVolunteers').isInt({ min: 1 }).withMessage('Max volunteers must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const opportunityData = {
      ...req.body,
      createdBy: req.user.id
    };

    const opportunity = new VolunteeringOpportunity(opportunityData);
    await opportunity.save();

    const populatedOpportunity = await VolunteeringOpportunity.findById(opportunity._id)
      .populate('createdBy', 'firstName lastName profileImage');

    res.status(201).json({ success: true, data: populatedOpportunity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/volunteering/:id
// @desc    Update volunteering opportunity
// @access  Private (Admin/Creator)
router.put('/:id', auth, async (req, res) => {
  try {
    const opportunity = await VolunteeringOpportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Check if user is admin or creator
    if (req.user.role !== 'admin' && opportunity.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this opportunity' });
    }

    const updatedOpportunity = await VolunteeringOpportunity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'firstName lastName profileImage');

    res.json({ success: true, data: updatedOpportunity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/volunteering/:id/apply
// @desc    Apply for volunteering opportunity
// @access  Private
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const opportunity = await VolunteeringOpportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Check if opportunity is active
    if (opportunity.status !== 'active') {
      return res.status(400).json({ message: 'This opportunity is not currently accepting applications' });
    }

    // Check if already applied
    const existingApplication = opportunity.volunteers.find(
      vol => vol.user.toString() === req.user.id
    );

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this opportunity' });
    }

    // Check capacity
    if (opportunity.capacity.currentVolunteers >= opportunity.capacity.maxVolunteers) {
      return res.status(400).json({ message: 'This opportunity is at full capacity' });
    }

    // Add volunteer application
    opportunity.volunteers.push({
      user: req.user.id,
      status: 'applied'
    });

    opportunity.capacity.currentVolunteers += 1;
    await opportunity.save();

    res.json({ success: true, message: 'Application submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/volunteering/:id/volunteers/:volunteerId
// @desc    Update volunteer status
// @access  Private (Admin/Creator)
router.put('/:id/volunteers/:volunteerId', auth, async (req, res) => {
  try {
    const { status, hoursLogged, feedback, rating } = req.body;

    const opportunity = await VolunteeringOpportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && opportunity.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const volunteer = opportunity.volunteers.id(req.params.volunteerId);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    // Update volunteer details
    if (status) volunteer.status = status;
    if (hoursLogged !== undefined) volunteer.hoursLogged = hoursLogged;
    if (feedback) volunteer.feedback = feedback;
    if (rating) volunteer.rating = rating;

    await opportunity.save();

    // If volunteer completed, update their total hours
    if (status === 'completed' && hoursLogged) {
      await User.findByIdAndUpdate(
        volunteer.user,
        { $inc: { volunteeringHours: hoursLogged } }
      );
    }

    res.json({ success: true, message: 'Volunteer status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/volunteering/my-applications
// @desc    Get user's volunteering applications
// @access  Private
router.get('/my/applications', auth, async (req, res) => {
  try {
    const opportunities = await VolunteeringOpportunity.find({
      'volunteers.user': req.user.id
    }).populate('createdBy', 'firstName lastName');

    const applications = opportunities.map(opportunity => {
      const volunteer = opportunity.volunteers.find(
        vol => vol.user.toString() === req.user.id
      );
      
      return {
        opportunity: {
          _id: opportunity._id,
          title: opportunity.title,
          category: opportunity.category,
          location: opportunity.location,
          createdBy: opportunity.createdBy
        },
        application: volunteer
      };
    });

    res.json({ success: true, data: applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
