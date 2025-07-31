const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['volunteering', 'internship', 'completion', 'recognition'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  organization: {
    name: String,
    logo: String
  },
  volunteeringDetails: {
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VolunteeringOpportunity'
    },
    hoursCompleted: Number,
    category: String,
    startDate: Date,
    endDate: Date
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: Date,
  verificationCode: {
    type: String,
    required: true
  },
  digitalSignature: String,
  template: {
    type: String,
    enum: ['standard', 'premium', 'internship', 'special'],
    default: 'standard'
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    geolocation: {
      latitude: Number,
      longitude: Number
    }
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  lastDownloaded: Date
}, {
  timestamps: true
});

// Generate certificate ID before saving
certificateSchema.pre('save', function(next) {
  if (!this.certificateId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.certificateId = `CS-${timestamp}-${random}`.toUpperCase();
  }
  
  if (!this.verificationCode) {
    this.verificationCode = Math.random().toString(36).substr(2, 10).toUpperCase();
  }
  
  next();
});

// Index for quick lookups
certificateSchema.index({ certificateId: 1 });
certificateSchema.index({ user: 1, createdAt: -1 });
certificateSchema.index({ verificationCode: 1 });

module.exports = mongoose.model('Certificate', certificateSchema);
