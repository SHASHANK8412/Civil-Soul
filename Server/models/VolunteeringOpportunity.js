const mongoose = require('mongoose');

const volunteeringOpportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['environment', 'elderly-care', 'animal-welfare', 'blood-donation', 'education', 'community-service', 'disaster-relief', 'healthcare']
  },
  organization: {
    name: {
      type: String,
      required: true
    },
    contact: {
      email: String,
      phone: String
    },
    website: String
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  requirements: {
    minimumAge: {
      type: Number,
      default: 16
    },
    skills: [String],
    timeCommitment: {
      hours: Number,
      duration: String // e.g., "per week", "one-time", "monthly"
    },
    background_check_required: {
      type: Boolean,
      default: false
    }
  },
  schedule: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    isRecurring: {
      type: Boolean,
      default: false
    },
    recurringPattern: String, // e.g., "weekly", "monthly"
    timeSlots: [{
      day: String,
      startTime: String,
      endTime: String
    }]
  },
  capacity: {
    maxVolunteers: {
      type: Number,
      required: true
    },
    currentVolunteers: {
      type: Number,
      default: 0
    }
  },
  images: [String],
  tags: [String],
  certificateEligible: {
    type: Boolean,
    default: true
  },
  certificateHours: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'draft'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  volunteers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['applied', 'accepted', 'rejected', 'completed'],
      default: 'applied'
    },
    hoursLogged: {
      type: Number,
      default: 0
    },
    feedback: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }]
}, {
  timestamps: true
});

// Index for geospatial queries
volunteeringOpportunitySchema.index({ "location.coordinates": "2dsphere" });

// Index for text search
volunteeringOpportunitySchema.index({ 
  title: "text", 
  description: "text", 
  tags: "text",
  "organization.name": "text"
});

module.exports = mongoose.model('VolunteeringOpportunity', volunteeringOpportunitySchema);
