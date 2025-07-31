const express = require('express');
const { body, validationResult } = require('express-validator');
const OpenAI = require('openai');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Store conversation history in memory (in production, use Redis or database)
const conversationHistory = new Map();

// @route   POST /api/chatbot/chat
// @desc    Chat with AI mental health bot
// @access  Public (but better with auth)
router.post('/chat', [
  optionalAuth,
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('conversationId').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message, conversationId } = req.body;
    const userId = req.user?.id || 'anonymous';
    const convId = conversationId || `${userId}_${Date.now()}`;

    // Get conversation history
    let history = conversationHistory.get(convId) || [];

    // System prompt for mental health chatbot
    const systemPrompt = `You are a compassionate mental health support chatbot for CivilSoul, a social service and wellness platform. Your role is to:

1. Provide emotional support and active listening
2. Offer evidence-based coping strategies and wellness tips
3. Encourage self-care and positive mental health practices
4. Suggest professional help when appropriate
5. Promote the platform's volunteering opportunities as a way to boost mental wellbeing
6. Be empathetic, non-judgmental, and supportive

Important guidelines:
- You are NOT a replacement for professional therapy or medical advice
- Always encourage users to seek professional help for serious mental health concerns
- If someone mentions self-harm or suicide, immediately provide crisis resources
- Keep responses concise but caring
- Suggest relevant CivilSoul features like counseling booking, self-assessment surveys, or volunteering opportunities when appropriate

Crisis Resources:
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- CivilSoul Helpline: +1-800-CIVILSOUL

Remember: You're here to provide support, not diagnose or treat mental health conditions.`;

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];

    // Get response from OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const botResponse = completion.choices[0].message.content;

    // Update conversation history (keep last 10 messages)
    history.push({ role: 'user', content: message });
    history.push({ role: 'assistant', content: botResponse });
    
    if (history.length > 20) {
      history = history.slice(-20);
    }
    
    conversationHistory.set(convId, history);

    // Auto-delete conversation after 24 hours
    setTimeout(() => {
      conversationHistory.delete(convId);
    }, 24 * 60 * 60 * 1000);

    res.json({
      success: true,
      data: {
        message: botResponse,
        conversationId: convId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    
    // Fallback response
    const fallbackResponse = "I'm sorry, I'm having trouble processing your message right now. Please try again in a moment. If you're in crisis, please reach out to the National Suicide Prevention Lifeline at 988 or text HOME to 741741.";
    
    res.json({
      success: true,
      data: {
        message: fallbackResponse,
        conversationId: req.body.conversationId || 'fallback',
        timestamp: new Date().toISOString()
      }
    });
  }
});

// @route   DELETE /api/chatbot/conversation/:id
// @desc    Clear conversation history
// @access  Public
router.delete('/conversation/:id', (req, res) => {
  try {
    const { id } = req.params;
    conversationHistory.delete(id);
    
    res.json({
      success: true,
      message: 'Conversation history cleared'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chatbot/suggestions
// @desc    Get conversation starters/suggestions
// @access  Public
router.get('/suggestions', (req, res) => {
  const suggestions = [
    "I'm feeling anxious about my future",
    "How can I manage stress better?",
    "I want to help others but don't know where to start",
    "Tell me about volunteering opportunities",
    "I'm feeling lonely and isolated",
    "How can I improve my mental wellbeing?",
    "I want to make a positive impact in my community",
    "Can you help me with coping strategies?",
    "I'm interested in environmental conservation",
    "How can I get involved in animal welfare?"
  ];

  res.json({
    success: true,
    data: suggestions
  });
});

module.exports = router;
