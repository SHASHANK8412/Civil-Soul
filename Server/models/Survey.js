const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['mental-health', 'wellness', 'stress-assessment', 'depression-screening', 'anxiety-assessment', 'general-wellbeing'],
    required: true
  },
  category: {
    type: String,
    enum: ['self-assessment', 'screening', 'feedback', 'research'],
    default: 'self-assessment'
  },
  questions: [{
    questionId: {
      type: String,
      required: true
    },
    questionText: {
      type: String,
      required: true
    },
    questionType: {
      type: String,
      enum: ['multiple-choice', 'rating-scale', 'text', 'yes-no', 'slider'],
      required: true
    },
    options: [String], // For multiple choice questions
    scaleRange: {
      min: Number,
      max: Number,
      labels: {
        min: String,
        max: String
      }
    }, // For rating scale questions
    isRequired: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      required: true
    }
  }],
  scoringSystem: {
    type: {
      type: String,
      enum: ['simple-sum', 'weighted', 'category-based', 'algorithm'],
      default: 'simple-sum'
    },
    weights: [{
      questionId: String,
      weight: Number
    }],
    categories: [{
      name: String,
      questionIds: [String],
      maxScore: Number
    }]
  },
  resultInterpretation: [{
    range: {
      min: Number,
      max: Number
    },
    level: {
      type: String,
      enum: ['low', 'mild', 'moderate', 'high', 'severe']
    },
    title: String,
    description: String,
    recommendations: [String],
    suggestedActions: [String],
    resourceLinks: [String]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metadata: {
    estimatedDuration: Number, // in minutes
    tags: [String],
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    }
  }
}, {
  timestamps: true
});

const surveyResponseSchema = new mongoose.Schema({
  survey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  responses: [{
    questionId: {
      type: String,
      required: true
    },
    answer: mongoose.Schema.Types.Mixed, // Can be string, number, array, etc.
    answeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  results: {
    totalScore: Number,
    categoryScores: [{
      category: String,
      score: Number,
      maxScore: Number
    }],
    interpretation: {
      level: String,
      title: String,
      description: String,
      recommendations: [String],
      suggestedActions: [String]
    }
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  timeTaken: Number, // in seconds
  isCompleted: {
    type: Boolean,
    default: true
  },
  followUpScheduled: {
    type: Boolean,
    default: false
  },
  counselorReferred: {
    type: Boolean,
    default: false
  },
  notes: String
}, {
  timestamps: true
});

// Indexes
surveySchema.index({ type: 1, isActive: 1 });
surveySchema.index({ createdBy: 1, createdAt: -1 });

surveyResponseSchema.index({ user: 1, createdAt: -1 });
surveyResponseSchema.index({ survey: 1, user: 1 });

const Survey = mongoose.model('Survey', surveySchema);
const SurveyResponse = mongoose.model('SurveyResponse', surveyResponseSchema);

module.exports = { Survey, SurveyResponse };
