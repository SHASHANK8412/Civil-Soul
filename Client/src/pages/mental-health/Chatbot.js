import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Send, 
  Bot, 
  User, 
  Heart, 
  Brain, 
  Shield, 
  Phone, 
  AlertTriangle,
  Lightbulb,
  Star,
  RotateCcw,
  Volume2,
  VolumeX,
  Copy,
  Download,
  Share2,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Chatbot = () => {
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hello ${user?.name || 'there'}! 👋 I'm MindBot, your AI mental health companion. I'm here to provide support, resources, and guidance 24/7. How are you feeling today?`,
      timestamp: new Date(),
      emotion: 'welcoming'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [chatMode, setChatMode] = useState('general'); // general, crisis, assessment, resources
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Crisis keywords for immediate intervention
  const crisisKeywords = [
    'suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm', 
    'die', 'death', 'hopeless', 'can\'t go on', 'give up'
  ];

  // Quick response suggestions
  const quickResponses = [
    "How can I manage anxiety?",
    "I'm feeling depressed",
    "Help with stress",
    "Breathing exercises",
    "Sleep tips",
    "Emergency resources"
  ];

  // Mental health responses database
  const responseDatabase = {
    anxiety: {
      keywords: ['anxiety', 'anxious', 'worried', 'panic', 'nervous', 'fear'],
      responses: [
        {
          text: "I understand you're feeling anxious. Anxiety is very common and treatable. Here are some immediate techniques that can help:",
          suggestions: [
            "Try the 4-7-8 breathing technique: Inhale for 4, hold for 7, exhale for 8",
            "Use the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste",
            "Practice progressive muscle relaxation",
            "Consider mindfulness meditation"
          ],
          resources: ["Guided meditation app", "Anxiety worksheets", "Professional counseling"]
        }
      ]
    },
    depression: {
      keywords: ['depressed', 'sad', 'low', 'down', 'hopeless', 'empty'],
      responses: [
        {
          text: "I'm sorry you're feeling this way. Depression can make everything feel overwhelming, but you're not alone. Here are some strategies that might help:",
          suggestions: [
            "Try to maintain a regular sleep schedule",
            "Engage in small, manageable activities",
            "Connect with supportive friends or family",
            "Consider journaling your thoughts and feelings",
            "Get some sunlight and fresh air daily"
          ],
          resources: ["Depression screening tools", "Support groups", "Professional therapy"]
        }
      ]
    },
    stress: {
      keywords: ['stress', 'stressed', 'overwhelmed', 'pressure', 'burnout'],
      responses: [
        {
          text: "Stress can feel overwhelming, but there are effective ways to manage it. Let's work on some strategies:",
          suggestions: [
            "Break large tasks into smaller, manageable steps",
            "Practice time management and prioritization",
            "Set healthy boundaries",
            "Try stress-reduction techniques like deep breathing",
            "Make time for activities you enjoy"
          ],
          resources: ["Stress management tools", "Time management apps", "Relaxation techniques"]
        }
      ]
    },
    sleep: {
      keywords: ['sleep', 'insomnia', 'tired', 'exhausted', 'can\'t sleep'],
      responses: [
        {
          text: "Sleep issues can significantly impact mental health. Here are some evidence-based sleep hygiene tips:",
          suggestions: [
            "Maintain a consistent sleep schedule",
            "Create a relaxing bedtime routine",
            "Keep your bedroom cool, dark, and quiet",
            "Avoid screens 1 hour before bed",
            "Limit caffeine after 2 PM"
          ],
          resources: ["Sleep tracking apps", "Bedtime meditation", "Sleep hygiene guide"]
        }
      ]
    }
  };

  const emergencyResources = {
    crisis: {
      title: "🆘 Crisis Resources",
      resources: [
        { name: "National Suicide Prevention Lifeline", number: "988", available: "24/7" },
        { name: "Crisis Text Line", number: "Text HOME to 741741", available: "24/7" },
        { name: "SAMHSA National Helpline", number: "1-800-662-4357", available: "24/7" },
        { name: "Emergency Services", number: "911", available: "24/7" }
      ]
    }
  };

  // Simulate AI response with more sophisticated logic
  const generateAIResponse = async (userMessage) => {
    setIsTyping(true);
    
    // Check for crisis keywords
    const containsCrisisKeyword = crisisKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword)
    );

    if (containsCrisisKeyword) {
      setChatMode('crisis');
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'bot',
          content: "I'm very concerned about what you've shared. Your safety is the most important thing right now. Please reach out to a crisis counselor immediately:",
          timestamp: new Date(),
          emotion: 'concerned',
          isEmergency: true,
          emergencyResources: emergencyResources.crisis
        }]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    // Find matching response category
    let responseCategory = null;
    let matchedKeywords = [];

    for (const [category, data] of Object.entries(responseDatabase)) {
      const keywords = data.keywords.filter(keyword => 
        userMessage.toLowerCase().includes(keyword)
      );
      if (keywords.length > 0) {
        responseCategory = category;
        matchedKeywords = keywords;
        break;
      }
    }

    setTimeout(() => {
      let response;
      
      if (responseCategory) {
        const categoryData = responseDatabase[responseCategory];
        const responseData = categoryData.responses[0];
        
        response = {
          id: Date.now(),
          type: 'bot',
          content: responseData.text,
          timestamp: new Date(),
          emotion: 'supportive',
          suggestions: responseData.suggestions,
          resources: responseData.resources,
          category: responseCategory
        };
      } else {
        // General supportive response
        const generalResponses = [
          "Thank you for sharing that with me. It takes courage to talk about how you're feeling. Can you tell me more about what's been on your mind?",
          "I hear you, and your feelings are valid. Sometimes it helps to talk through what we're experiencing. What would be most helpful for you right now?",
          "It sounds like you're going through something challenging. Remember that seeking support is a sign of strength. How can I best support you today?",
          "I appreciate you opening up. Everyone faces difficult times, and you don't have to go through this alone. What kind of support are you looking for?"
        ];
        
        response = {
          id: Date.now(),
          type: 'bot',
          content: generalResponses[Math.floor(Math.random() * generalResponses.length)],
          timestamp: new Date(),
          emotion: 'empathetic'
        };
      }

      setMessages(prev => [...prev, response]);
      setIsTyping(false);
      
      // Text-to-speech if enabled
      if (isVoiceEnabled) {
        speakText(response.content);
      }
    }, 1500 + Math.random() * 1000); // Realistic typing delay
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    await generateAIResponse(message);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('Message copied to clipboard');
  };

  const exportChat = () => {
    const chatContent = messages.map(msg => 
      `${msg.type.toUpperCase()} (${msg.timestamp.toLocaleString()}): ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mental-health-chat-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Chat exported successfully');
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      type: 'bot',
      content: `Hello ${user?.name || 'there'}! 👋 I'm MindBot, your AI mental health companion. I'm here to provide support, resources, and guidance 24/7. How are you feeling today?`,
      timestamp: new Date(),
      emotion: 'welcoming'
    }]);
    setChatMode('general');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Mental Health Companion
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Available 24/7 for support, guidance, and mental health resources. 
            This AI assistant is trained to provide helpful information but is not a replacement for professional care.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">MindBot</h3>
                    <p className="text-blue-100 text-sm">Online • Responding</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                    className={`p-2 rounded-lg transition-colors ${
                      isVoiceEnabled 
                        ? 'bg-white bg-opacity-20 text-white' 
                        : 'text-blue-100 hover:bg-white hover:bg-opacity-10'
                    }`}
                    title={isVoiceEnabled ? 'Disable voice' : 'Enable voice'}
                  >
                    {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>
                  
                  <button
                    onClick={exportChat}
                    className="p-2 text-blue-100 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                    title="Export chat"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={clearChat}
                    className="p-2 text-blue-100 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                    title="Clear chat"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-2' : 'mr-2'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'user' 
                            ? 'bg-blue-500' 
                            : message.isEmergency 
                              ? 'bg-red-500' 
                              : 'bg-gradient-to-r from-purple-500 to-indigo-600'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                      
                      <div className={`rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : message.isEmergency
                            ? 'bg-red-50 border border-red-200 dark:bg-red-900 dark:border-red-700'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        
                        {/* Emergency Resources */}
                        {message.isEmergency && message.emergencyResources && (
                          <div className="mt-3 p-3 bg-red-100 dark:bg-red-800 rounded-lg">
                            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                              {message.emergencyResources.title}
                            </h4>
                            <div className="space-y-2">
                              {message.emergencyResources.resources.map((resource, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                  <span className="text-red-700 dark:text-red-300">{resource.name}</span>
                                  <span className="font-mono font-semibold text-red-800 dark:text-red-200">
                                    {resource.number}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Suggestions */}
                        {message.suggestions && (
                          <div className="mt-3 space-y-2">
                            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                              💡 Suggestions:
                            </h4>
                            <ul className="text-sm space-y-1">
                              {message.suggestions.map((suggestion, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-blue-500 mr-2">•</span>
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Resources */}
                        {message.resources && (
                          <div className="mt-3">
                            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
                              📚 Resources:
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {message.resources.map((resource, index) => (
                                <span
                                  key={index}
                                  className="inline-block bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full"
                                >
                                  {resource}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          {message.type === 'bot' && (
                            <button
                              onClick={() => copyMessage(message.content)}
                              className="text-xs opacity-50 hover:opacity-100 transition-opacity"
                              title="Copy message"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex mr-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Responses */}
            <div className="p-4 border-t dark:border-gray-700">
              <div className="mb-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quick responses:</p>
                <div className="flex flex-wrap gap-2">
                  {quickResponses.map((response, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(response)}
                      className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {response}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here... (Press Enter to send)"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                    rows="1"
                    style={{ maxHeight: '120px' }}
                    disabled={isTyping}
                  />
                </div>
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-semibold mb-1">Important Disclaimer:</p>
                <p>
                  This AI chatbot provides general mental health information and support. It is not a substitute for professional medical advice, 
                  diagnosis, or treatment. If you're experiencing a mental health emergency, please contact emergency services or a crisis hotline immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
