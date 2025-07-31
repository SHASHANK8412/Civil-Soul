const express = require('express');
const { body, validationResult } = require('express-validator');
const Certificate = require('../models/Certificate');
const VolunteeringOpportunity = require('../models/VolunteeringOpportunity');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');
const crypto = require('crypto');

const router = express.Router();

// Blockchain certificate generation simulation
const generateBlockchainCertificate = async (certificateData) => {
  // Simulate blockchain transaction
  const blockchainHash = crypto.randomBytes(32).toString('hex');
  const certificateId = `CERT-${certificateData.volunteerName.replace(/\s+/g, '').toUpperCase()}-${certificateData.activityType.replace(/\s+/g, '').toUpperCase()}-${Date.now()}`;
  
  // Calculate performance score
  const performanceScore = calculatePerformanceScore(certificateData.performanceMetrics || {});
  
  return {
    success: true,
    certificate: {
      id: certificateId,
      volunteerName: certificateData.volunteerName,
      organizationName: certificateData.organizationName,
      activityType: certificateData.activityType,
      hoursCompleted: certificateData.hoursCompleted,
      performanceScore,
      dateIssued: new Date(),
      blockchainHash,
      isValid: true
    }
  };
};

const calculatePerformanceScore = (metrics) => {
  const {
    hoursCompleted = 0,
    taskQuality = 5,
    punctuality = 5,
    teamwork = 5,
    initiative = 5,
    feedback = 5
  } = metrics;

  // Weight different factors
  const weights = {
    hours: 0.3,
    quality: 0.25,
    punctuality: 0.15,
    teamwork: 0.15,
    initiative: 0.1,
    feedback: 0.05
  };

  // Normalize hours (assuming 100 hours = full score)
  const normalizedHours = Math.min(hoursCompleted / 100, 1) * 10;

  const score = (
    normalizedHours * weights.hours +
    taskQuality * weights.quality +
    punctuality * weights.punctuality +
    teamwork * weights.teamwork +
    initiative * weights.initiative +
    feedback * weights.feedback
  );

  return Math.round(score * 10); // Return as percentage (0-100)
};

// @route   POST /api/certificates/generate
// @desc    Generate blockchain certificate for completed volunteering
// @access  Private
router.post('/generate', [
  auth,
  body('volunteerId').notEmpty().withMessage('Volunteer ID is required'),
  body('activityId').notEmpty().withMessage('Activity ID is required'),
  body('activityType').notEmpty().withMessage('Activity type is required'),
  body('organizationName').notEmpty().withMessage('Organization name is required'),
  body('volunteerName').notEmpty().withMessage('Volunteer name is required'),
  body('hoursCompleted').isNumeric().withMessage('Hours completed must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      volunteerId, 
      activityId, 
      activityType, 
      organizationName, 
      volunteerName, 
      hoursCompleted, 
      performanceData 
    } = req.body;

    // Generate blockchain certificate
    const blockchainResult = await generateBlockchainCertificate({
      volunteerName,
      organizationName,
      activityType,
      hoursCompleted,
      performanceMetrics: performanceData
    });

    if (!blockchainResult.success) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to generate blockchain certificate' 
      });
    }

    // Create certificate record in database
    const certificate = new Certificate({
      userId: req.user.id,
      volunteerId: volunteerId,
      activityId: activityId,
      activityType: activityType,
      organizationName: organizationName,
      volunteerName: volunteerName,
      hoursCompleted: hoursCompleted,
      performanceScore: blockchainResult.certificate.performanceScore,
      blockchainHash: blockchainResult.certificate.blockchainHash,
      certificateId: blockchainResult.certificate.id,
      status: 'issued',
      type: 'volunteering',
      title: `${activityType} Volunteer Certificate`,
      description: `Certificate awarded for outstanding volunteer service with ${organizationName}`,
      issueDate: new Date(),
      metadata: {
        performanceData: performanceData,
        blockchainVerified: true,
        version: '1.0'
      }
    });

    await certificate.save();

    res.status(201).json({
      success: true,
      message: 'Certificate generated successfully',
      certificate: {
        ...certificate.toObject(),
        ...blockchainResult.certificate
      }
    });
  } catch (error) {
    console.error('Certificate generation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during certificate generation',
      error: error.message 
    });
  }
});

// @route   GET /api/certificates/user/:userId
// @desc    Get all certificates for a user
// @access  Private
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const certificates = await Certificate.find({ 
      userId: req.params.userId 
    }).sort({ issueDate: -1 });

    res.json({
      success: true,
      certificates: certificates
    });
  } catch (error) {
    console.error('Error fetching user certificates:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching certificates' 
    });
  }
});

// @route   GET /api/certificates/verify/:certificateId
// @desc    Verify certificate authenticity
// @access  Public
router.get('/verify/:certificateId', async (req, res) => {
  try {
    const { certificateId } = req.params;

    // Find certificate in database
    const certificate = await Certificate.findOne({ 
      certificateId: certificateId 
    });

    if (!certificate) {
      return res.json({
        success: true,
        isValid: false,
        message: 'Certificate not found'
      });
    }

    // In a real blockchain implementation, you would verify on-chain
    // For now, we'll simulate verification
    const isValid = certificate.status === 'issued' && 
                   certificate.blockchainHash && 
                   certificate.blockchainHash.length === 64;

    res.json({
      success: true,
      isValid: isValid,
      certificate: isValid ? certificate : null,
      verification: {
        database: !!certificate,
        blockchain: isValid,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Certificate verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during verification' 
    });
  }
});

// @route   GET /api/certificates/:id/download
// @desc    Download certificate as PDF
// @access  Private
router.get('/:id/download', auth, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Check if user owns the certificate or is admin
    if (certificate.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // In a real implementation, you would generate a PDF here
    // For now, return certificate data
    res.json({
      success: true,
      certificate: certificate,
      downloadUrl: `https://api.civilsoul.org/certificates/${certificate.certificateId}/download`
    });
  } catch (error) {
    console.error('Certificate download error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/certificates/:id
// @desc    Update certificate status
// @access  Private (Admin)
router.patch('/:id', [
  auth,
  authorize('admin')
], async (req, res) => {

    // Create certificate
    const certificate = new Certificate({
      user: userId,
      type,
      title: title || `Volunteering Certificate - ${opportunity.title}`,
      description: description || `This certificate is awarded for successfully completing ${hoursCompleted} hours of volunteering in ${opportunity.category}.`,
      organization: {
        name: opportunity.organization?.name || 'CivilSoul',
        logo: opportunity.organization?.logo || ''
      },
      volunteeringDetails: {
        opportunity: opportunityId,
        hoursCompleted,
        category: opportunity.category,
        startDate: opportunity.schedule.startDate,
        endDate: new Date()
      }
    });

    await certificate.save();

    // Update user's badges
    const badgeName = `${opportunity.category}-volunteer`;
    const existingBadge = user.badges.find(badge => badge.name === badgeName);
    
    if (!existingBadge) {
      user.badges.push({ name: badgeName });
      await user.save();
    }

    const populatedCertificate = await Certificate.findById(certificate._id)
      .populate('user', 'firstName lastName email')
      .populate('volunteeringDetails.opportunity', 'title category organization');

    res.status(201).json({
      success: true,
      data: populatedCertificate
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/certificates/my
// @desc    Get user's certificates
// @access  Private
router.get('/my', auth, async (req, res) => {
  try {
    const certificates = await Certificate.find({ user: req.user.id })
      .populate('volunteeringDetails.opportunity', 'title category organization')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: certificates
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/certificates/:id
// @desc    Get single certificate
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('volunteeringDetails.opportunity', 'title category organization');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Check if user owns the certificate or is admin
    if (certificate.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this certificate' });
    }

    res.json({
      success: true,
      data: certificate
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/certificates/verify/:certificateId
// @desc    Verify certificate by ID
// @access  Public
router.get('/verify/:certificateId', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ 
      certificateId: req.params.certificateId 
    })
    .populate('user', 'firstName lastName')
    .populate('volunteeringDetails.opportunity', 'title category organization');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    if (!certificate.isVerified) {
      return res.status(400).json({ message: 'Certificate is not verified' });
    }

    res.json({
      success: true,
      data: {
        isValid: true,
        certificate: {
          id: certificate.certificateId,
          recipient: certificate.user.fullName,
          title: certificate.title,
          description: certificate.description,
          issueDate: certificate.issueDate,
          organization: certificate.organization,
          volunteeringDetails: certificate.volunteeringDetails
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/certificates/:id/download
// @desc    Track certificate download
// @access  Private
router.post('/:id/download', auth, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Check if user owns the certificate
    if (certificate.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to download this certificate' });
    }

    // Update download count and last downloaded
    certificate.downloadCount += 1;
    certificate.lastDownloaded = new Date();
    await certificate.save();

    res.json({
      success: true,
      message: 'Download tracked successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/certificates/admin/all
// @desc    Get all certificates (admin only)
// @access  Private (Admin)
router.get('/admin/all', [auth, authorize('admin')], async (req, res) => {
  try {
    const { page = 1, limit = 10, type, search } = req.query;

    const query = {};
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { certificateId: { $regex: search, $options: 'i' } }
      ];
    }

    const certificates = await Certificate.find(query)
      .populate('user', 'firstName lastName email')
      .populate('volunteeringDetails.opportunity', 'title category')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Certificate.countDocuments(query);

    res.json({
      success: true,
      data: certificates,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
