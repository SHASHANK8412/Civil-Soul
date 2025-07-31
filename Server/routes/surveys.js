const express = require('express');
const { body, validationResult } = require('express-validator');
const { Survey, SurveyResponse } = require('../models/Survey');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/surveys
// @desc    Get all active surveys
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type, category } = req.query;
    
    const query = { isActive: true, isPublic: true };
    if (type) query.type = type;
    if (category) query.category = category;

    const surveys = await Survey.find(query)
      .select('-resultInterpretation')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: surveys
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/surveys/:id
// @desc    Get single survey
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id)
      .populate('createdBy', 'firstName lastName');

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    if (!survey.isActive || !survey.isPublic) {
      return res.status(403).json({ message: 'Survey is not available' });
    }

    res.json({
      success: true,
      data: survey
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/surveys/:id/submit
// @desc    Submit survey response
// @access  Private
router.post('/:id/submit', [
  auth,
  body('responses').isArray().withMessage('Responses must be an array'),
  body('responses.*.questionId').notEmpty().withMessage('Question ID is required'),
  body('responses.*.answer').exists().withMessage('Answer is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    // Check if user already submitted
    const existingResponse = await SurveyResponse.findOne({
      survey: req.params.id,
      user: req.user.id
    });

    if (existingResponse) {
      return res.status(400).json({ message: 'You have already submitted this survey' });
    }

    const { responses, timeTaken } = req.body;

    // Calculate results based on scoring system
    let totalScore = 0;
    let categoryScores = [];

    if (survey.scoringSystem.type === 'simple-sum') {
      totalScore = responses.reduce((sum, response) => {
        const answer = typeof response.answer === 'number' ? response.answer : 0;
        return sum + answer;
      }, 0);
    } else if (survey.scoringSystem.type === 'weighted') {
      totalScore = responses.reduce((sum, response) => {
        const weight = survey.scoringSystem.weights.find(w => w.questionId === response.questionId);
        const answer = typeof response.answer === 'number' ? response.answer : 0;
        return sum + (answer * (weight?.weight || 1));
      }, 0);
    }

    // Find interpretation
    const interpretation = survey.resultInterpretation.find(interp => 
      totalScore >= interp.range.min && totalScore <= interp.range.max
    );

    const surveyResponse = new SurveyResponse({
      survey: req.params.id,
      user: req.user.id,
      responses,
      results: {
        totalScore,
        categoryScores,
        interpretation: interpretation || {
          level: 'unknown',
          title: 'Results',
          description: 'Thank you for completing the survey.',
          recommendations: [],
          suggestedActions: []
        }
      },
      timeTaken: timeTaken || 0
    });

    await surveyResponse.save();

    res.json({
      success: true,
      data: {
        results: surveyResponse.results,
        submittedAt: surveyResponse.completedAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/surveys/my/responses
// @desc    Get user's survey responses
// @access  Private
router.get('/my/responses', auth, async (req, res) => {
  try {
    const responses = await SurveyResponse.find({ user: req.user.id })
      .populate('survey', 'title type category metadata')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: responses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Predefined mental health surveys
const mentalHealthSurveys = [
  {
    title: "Depression Screening (PHQ-9)",
    description: "A brief questionnaire to screen for depression symptoms",
    type: "depression-screening",
    category: "screening",
    questions: [
      {
        questionId: "phq9_1",
        questionText: "Little interest or pleasure in doing things",
        questionType: "rating-scale",
        scaleRange: { min: 0, max: 3, labels: { min: "Not at all", max: "Nearly every day" } },
        isRequired: true,
        order: 1
      },
      {
        questionId: "phq9_2",
        questionText: "Feeling down, depressed, or hopeless",
        questionType: "rating-scale",
        scaleRange: { min: 0, max: 3, labels: { min: "Not at all", max: "Nearly every day" } },
        isRequired: true,
        order: 2
      },
      // Add more PHQ-9 questions...
    ],
    resultInterpretation: [
      {
        range: { min: 0, max: 4 },
        level: "minimal",
        title: "Minimal Depression",
        description: "Your responses suggest minimal depression symptoms.",
        recommendations: ["Continue with regular self-care", "Stay connected with friends and family"],
        suggestedActions: ["Consider volunteering to boost mood", "Maintain regular exercise"]
      },
      {
        range: { min: 5, max: 9 },
        level: "mild",
        title: "Mild Depression",
        description: "Your responses suggest mild depression symptoms.",
        recommendations: ["Consider speaking with a counselor", "Practice stress management techniques"],
        suggestedActions: ["Book a counseling session", "Try our guided meditation resources"]
      }
    ]
  }
];

// @route   POST /api/surveys/init-defaults
// @desc    Initialize default surveys (admin only)
// @access  Private (Admin)
router.post('/init-defaults', [auth, authorize('admin')], async (req, res) => {
  try {
    for (const surveyData of mentalHealthSurveys) {
      const existingSurvey = await Survey.findOne({ title: surveyData.title });
      if (!existingSurvey) {
        const survey = new Survey({
          ...surveyData,
          createdBy: req.user.id
        });
        await survey.save();
      }
    }

    res.json({
      success: true,
      message: 'Default surveys initialized successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
