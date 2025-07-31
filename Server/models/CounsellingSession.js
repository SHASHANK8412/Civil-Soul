const mongoose = require('mongoose');

const counsellingSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  counselor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionType: {
    type: String,
    enum: ['individual', 'group', 'couple', 'family'],
    default: 'individual'
  },
  mode: {
    type: String,
    enum: ['video', 'audio', 'chat', 'in-person'],
    default: 'video'
  },
  scheduledDateTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  topic: {
    type: String,
    required: true,
    enum: ['anxiety', 'depression', 'stress', 'relationships', 'career', 'family', 'grief', 'addiction', 'trauma', 'general']
  },
  urgencyLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium'
  },
  notes: {
    userNotes: String, // User's initial notes
    counselorNotes: String, // Counselor's session notes
    followUpNotes: String
  },
  sessionSummary: {
    keyPoints: [String],
    recommendations: [String],
    homework: [String],
    nextSteps: String
  },
  feedback: {
    userRating: {
      type: Number,
      min: 1,
      max: 5
    },
    userReview: String,
    counselorRating: {
      type: Number,
      min: 1,
      max: 5
    },
    counselorReview: String
  },
  paymentDetails: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String
  },
  meetingLink: String,
  recordings: [{
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    isUserAccessible: {
      type: Boolean,
      default: false
    }
  }],
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'push']
    },
    sentAt: Date,
    scheduledFor: Date
  }]
}, {
  timestamps: true
});

// Index for efficient queries
counsellingSessionSchema.index({ user: 1, scheduledDateTime: -1 });
counsellingSessionSchema.index({ counselor: 1, scheduledDateTime: -1 });
counsellingSessionSchema.index({ status: 1, scheduledDateTime: 1 });

module.exports = mongoose.model('CounsellingSession', counsellingSessionSchema);
