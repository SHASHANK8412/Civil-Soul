const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const router = express.Router();

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// @route   POST /api/contact/general
// @desc    Send general contact message
// @access  Public
router.post('/general', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('phone').optional().isMobilePhone()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, subject, message, category } = req.body;

    const transporter = createTransporter();

    // Email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `[CivilSoul Contact] ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Category:</strong> ${category || 'General'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <p><em>Sent from CivilSoul Contact Form</em></p>
      `
    };

    // Auto-reply to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting CivilSoul',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank you for reaching out!</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and appreciate you taking the time to contact us. Our team will review your inquiry and get back to you as soon as possible.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4>Your Message Details:</h4>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong> ${message}</p>
          </div>
          
          <p>In the meantime, feel free to explore our platform:</p>
          <ul>
            <li>🤝 Browse volunteering opportunities</li>
            <li>💬 Chat with our AI wellness assistant</li>
            <li>📝 Take a mental health self-assessment</li>
            <li>📖 Read our wellness blog</li>
          </ul>
          
          <p>If you need immediate assistance, please call our helpline: <strong>${process.env.HELPLINE_NUMBER}</strong></p>
          
          <p>Best regards,<br>The CivilSoul Team</p>
          
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            This is an automated response. Please do not reply to this email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      message: 'Failed to send message. Please try again or contact us directly.',
      helpline: process.env.HELPLINE_NUMBER
    });
  }
});

// @route   POST /api/contact/volunteer-inquiry
// @desc    Send volunteer program inquiry
// @access  Public
router.post('/volunteer-inquiry', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('interests').isArray().withMessage('Interests must be an array'),
  body('availability').trim().notEmpty().withMessage('Availability is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, interests, availability, experience, message } = req.body;

    const transporter = createTransporter();

    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: '[CivilSoul] New Volunteer Inquiry',
      html: `
        <h3>New Volunteer Program Inquiry</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Interests:</strong> ${interests.join(', ')}</p>
        <p><strong>Availability:</strong> ${availability}</p>
        <p><strong>Experience:</strong> ${experience || 'Not provided'}</p>
        <p><strong>Additional Message:</strong></p>
        <p>${message ? message.replace(/\n/g, '<br>') : 'None'}</p>
      `
    };

    await transporter.sendMail(adminMailOptions);

    res.json({
      success: true,
      message: 'Your volunteer inquiry has been submitted! Our volunteer coordinator will contact you soon.'
    });
  } catch (error) {
    console.error('Volunteer inquiry error:', error);
    res.status(500).json({ message: 'Failed to submit inquiry. Please try again.' });
  }
});

// @route   POST /api/contact/emergency
// @desc    Send emergency/crisis message
// @access  Public
router.post('/emergency', [
  body('name').optional().trim(),
  body('email').optional().isEmail(),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('phone').optional().isMobilePhone()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, message, location } = req.body;

    const transporter = createTransporter();

    const emergencyMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: '🚨 URGENT - Emergency Contact from CivilSoul',
      html: `
        <div style="background-color: #fee2e2; padding: 20px; border-left: 4px solid #dc2626;">
          <h2 style="color: #dc2626;">🚨 EMERGENCY CONTACT</h2>
          <p><strong>Name:</strong> ${name || 'Anonymous'}</p>
          <p><strong>Email:</strong> ${email || 'Not provided'}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Location:</strong> ${location || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p style="color: #dc2626;"><strong>ACTION REQUIRED: Please respond immediately</strong></p>
        </div>
      `
    };

    await transporter.sendMail(emergencyMailOptions);

    // Provide immediate crisis resources
    const crisisResources = {
      "National Suicide Prevention Lifeline": "988",
      "Crisis Text Line": "Text HOME to 741741",
      "National Domestic Violence Hotline": "1-800-799-7233",
      "SAMHSA National Helpline": "1-800-662-4357",
      "CivilSoul Emergency Helpline": process.env.HELPLINE_NUMBER
    };

    res.json({
      success: true,
      message: 'Your emergency message has been sent. Please reach out to immediate crisis resources if needed.',
      crisisResources,
      immediateActions: [
        "If you're in immediate danger, call 911",
        "For suicide prevention support, call 988",
        "For crisis text support, text HOME to 741741",
        "Go to your nearest emergency room if needed"
      ]
    });
  } catch (error) {
    console.error('Emergency contact error:', error);
    res.status(500).json({ 
      message: 'Failed to send emergency message.',
      crisisResources: {
        "Emergency Services": "911",
        "National Suicide Prevention Lifeline": "988",
        "Crisis Text Line": "Text HOME to 741741"
      }
    });
  }
});

// @route   GET /api/contact/info
// @desc    Get contact information and helpline details
// @access  Public
router.get('/info', (req, res) => {
  res.json({
    success: true,
    data: {
      helpline: process.env.HELPLINE_NUMBER || '+1-800-CIVILSOUL',
      email: process.env.ADMIN_EMAIL || 'contact@civilsoul.com',
      emergencyResources: {
        "Emergency Services": "911",
        "National Suicide Prevention Lifeline": "988",
        "Crisis Text Line": "Text HOME to 741741",
        "National Domestic Violence Hotline": "1-800-799-7233",
        "SAMHSA National Helpline": "1-800-662-4357"
      },
      businessHours: "Monday - Friday: 9 AM - 6 PM EST",
      emergencySupport: "24/7 crisis support available",
      socialMedia: {
        facebook: "https://facebook.com/civilsoul",
        twitter: "https://twitter.com/civilsoul",
        instagram: "https://instagram.com/civilsoul",
        linkedin: "https://linkedin.com/company/civilsoul"
      }
    }
  });
});

module.exports = router;
