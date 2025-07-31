import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Brain, 
  MessageCircle, 
  Calendar, 
  FileText, 
  Heart, 
  Shield, 
  Users, 
  Clock, 
  Star, 
  Zap,
  Phone,
  Video,
  User,
  Award,
  TrendingUp,
  BookOpen,
  Lightbulb,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const MentalHealth = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [selectedService, setSelectedService] = useState('overview');

  const services = [
    {
      id: 'chatbot',
      title: 'AI Mental Health Companion',
      description: 'Get 24/7 support from our AI-powered chatbot trained in mental health support.',
      icon: MessageCircle,
      color: 'blue',
      href: '/mental-health/chatbot',
      features: ['24/7 Availability', 'Instant Response', 'Crisis Detection', 'Personalized Support'],
      stats: { users: '10K+', rating: 4.8, sessions: '50K+' }
    },
    {
      id: 'surveys',
      title: 'Self-Assessment Tools',
      description: 'Take validated psychological assessments like PHQ-9 and GAD-7 to understand your mental health.',
      icon: FileText,
      color: 'purple',
      href: '/mental-health/surveys',
      features: ['PHQ-9 Depression', 'GAD-7 Anxiety', 'Personalized Results', 'Progress Tracking'],
      stats: { assessments: '2', accuracy: '95%', completed: '5K+' }
    },
    {
      id: 'counseling',
      title: 'Professional Counseling',
      description: 'Book appointments with licensed mental health professionals for personalized care.',
      icon: Calendar,
      color: 'green',
      href: '/mental-health/counselling',
      features: ['Licensed Therapists', 'Video/In-Person', 'Flexible Scheduling', 'Insurance Accepted'],
      stats: { counselors: '50+', availability: '98%', satisfaction: '4.9/5' }
    }
  ];

  const mentalHealthResources = [
    {
      title: 'Crisis Resources',
      items: [
        { name: 'National Suicide Prevention Lifeline', contact: '988', available: '24/7' },
        { name: 'Crisis Text Line', contact: 'Text HOME to 741741', available: '24/7' },
        { name: 'SAMHSA National Helpline', contact: '1-800-662-4357', available: '24/7' }
      ]
    },
    {
      title: 'Educational Resources',
      items: [
        { name: 'Understanding Depression', type: 'Article' },
        { name: 'Managing Anxiety', type: 'Guide' },
        { name: 'Stress Management Techniques', type: 'Video' },
        { name: 'Mindfulness for Beginners', type: 'Course' }
      ]
    }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Community Member',
      content: 'The AI chatbot helped me through a difficult time at 3 AM when no one else was available. It provided real comfort and guided me to professional help.',
      rating: 5,
      service: 'AI Companion'
    },
    {
      name: 'Michael K.',
      role: 'Student',
      content: 'Taking the PHQ-9 assessment helped me understand my depression better. The personalized recommendations were spot-on.',
      rating: 5,
      service: 'Assessments'
    },
    {
      name: 'Emma L.',
      role: 'Working Professional',
      content: 'Booking therapy through CivilSoul was seamless. My counselor is amazing and the video sessions are so convenient.',
      rating: 5,
      service: 'Counseling'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full">
                <Brain className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Mental Health Support
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Comprehensive mental health resources at your fingertips. From AI-powered support to professional counseling, 
              we're here to help you on your mental wellness journey.
            </p>
            
            {isAuthenticated ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Welcome back, {user?.name || 'Friend'}! 👋
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  How are you feeling today? Let's check in on your mental wellness.
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/mental-health/chatbot"
                  className="border border-blue-500 text-blue-500 px-8 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors font-semibold"
                >
                  Try AI Companion
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Our Mental Health Services
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${
                  service.color === 'blue' ? 'from-blue-500 to-indigo-600' :
                  service.color === 'purple' ? 'from-purple-500 to-pink-600' :
                  'from-green-500 to-emerald-600'
                } p-6 text-white`}>
                  <service.icon className="w-10 h-10 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="opacity-90 text-sm">{service.description}</p>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Features:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {Object.entries(service.stats).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">{value}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{key}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Link
                    to={service.href}
                    className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                      service.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600 text-white' :
                      service.color === 'purple' ? 'bg-purple-500 hover:bg-purple-600 text-white' :
                      'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {service.id === 'chatbot' ? 'Start Chat' :
                     service.id === 'surveys' ? 'Take Assessment' :
                     'Book Session'}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Need Immediate Support?</h2>
              <p className="opacity-90">
                If you're experiencing a mental health crisis, don't wait. Get help immediately.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                <Phone className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">Crisis Hotline</div>
                <div className="text-sm opacity-90">Call 988</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                <MessageCircle className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">Crisis Text</div>
                <div className="text-sm opacity-90">Text HOME to 741741</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                <Video className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">Emergency</div>
                <div className="text-sm opacity-90">Call 911</div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Our Impact on Mental Health
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">15K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">People Supported</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">AI Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">50+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Licensed Counselors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">95%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Satisfaction Rate</div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Stories of Hope and Healing
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                  <div className="text-xs text-blue-500 mt-1">{testimonial.service}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Resources Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Additional Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mentalHealthResources.map((resource, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  {resource.title === 'Crisis Resources' ? (
                    <Phone className="w-5 h-5 mr-2 text-red-500" />
                  ) : (
                    <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                  )}
                  {resource.title}
                </h3>
                <div className="space-y-3">
                  {resource.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.contact || item.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Start Your Mental Wellness Journey?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Take the first step towards better mental health. Our comprehensive support system is here for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/mental-health/chatbot"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                Start with AI Support
              </Link>
              <Link
                to="/mental-health/surveys"
                className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors font-semibold"
              >
                Take an Assessment
              </Link>
              <Link
                to="/mental-health/counselling"
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
              >
                Book Counseling
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalHealth;
