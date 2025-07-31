import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ArrowRight, 
  Heart, 
  Users, 
  MessageCircle,
  Award,
  Sparkles,
  Shield,
  Zap,
  Target
} from 'lucide-react';
import { setBlockchainConnected } from '../../store/slices/volunteeringSlice';
import certificateService from '../../services/certificateService';

const CallToActionSection = () => {
  const dispatch = useDispatch();
  const { blockchainConnected } = useSelector(state => state.volunteering);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectBlockchain = async () => {
    setIsConnecting(true);
    try {
      const connected = await certificateService.initializeBlockchain();
      dispatch(setBlockchainConnected(connected));
      if (connected) {
        alert('Blockchain connection established! You can now earn verified certificates.');
      } else {
        alert('Running in demo mode. Certificates will be simulated.');
      }
    } catch (error) {
      console.error('Blockchain connection failed:', error);
      alert('Blockchain connection failed. Using demo mode.');
    } finally {
      setIsConnecting(false);
    }
  };
  const quickActions = [
    {
      icon: Users,
      title: 'Find Volunteer Work',
      description: 'Browse opportunities that match your interests and skills',
      link: '/volunteering',
      color: 'bg-primary-600',
      enabled: true
    },
    {
      icon: MessageCircle,
      title: 'Get Mental Health Support',
      description: 'Chat with AI assistant or book counseling sessions',
      link: '/mental-health/chatbot',
      color: 'bg-green-600',
      enabled: true
    },
    {
      icon: Award,
      title: 'Earn Blockchain Certificates',
      description: 'Get blockchain-verified certificates for your volunteer work',
      link: '/certificates',
      color: 'bg-purple-600',
      enabled: true,
      badge: 'New!'
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-gray-900 via-primary-900 to-secondary-900 text-white overflow-hidden">
      <div className="container-custom relative">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary-400 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary-400 rounded-full blur-xl"></div>
        </div>

        <div className="relative z-10">
          {/* Main CTA */}
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Join the Movement
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Ready to Make a
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Real Difference?
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Join thousands of volunteers, access mental health resources, and 
              become part of a community that's creating positive change around the world.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/register"
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 inline-flex items-center justify-center group hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/mental-health/chatbot"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 inline-flex items-center justify-center backdrop-blur-sm group hover:scale-105"
              >
                Try AI Support
                <Heart className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>

              <button
                onClick={handleConnectBlockchain}
                disabled={isConnecting}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group hover:scale-105"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Connecting...
                  </>
                ) : blockchainConnected ? (
                  <>
                    <Shield className="ml-2 w-5 h-5 text-green-400" />
                    Blockchain Ready
                  </>
                ) : (
                  <>
                    Connect Blockchain
                    <Zap className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`group bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 relative ${
                  action.enabled ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
                }`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {action.badge && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {action.badge}
                  </div>
                )}
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {action.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {action.description}
                </p>
                <div className="mt-4 flex items-center text-white/80 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Learn More</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {/* Emergency Support Banner */}
          <div className="bg-red-600/20 border border-red-500/30 rounded-xl p-6 text-center backdrop-blur-sm" data-aos="fade-up">
            <div className="flex items-center justify-center mb-3">
              <Heart className="w-6 h-6 text-red-400 mr-2" />
              <span className="font-semibold text-red-400">24/7 Crisis Support Available</span>
            </div>
            <p className="text-gray-300 mb-4">
              If you're experiencing a mental health crisis, immediate help is available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <div className="text-white">
                <strong>Crisis Hotline:</strong> 988
              </div>
              <div className="text-white">
                <strong>Text Support:</strong> HOME to 741741
              </div>
              <div className="text-white">
                <strong>CivilSoul Helpline:</strong> 1-800-CIVILSOUL
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="text-center mt-12" data-aos="fade-up">
            <p className="text-gray-400 mb-6">Join our growing community</p>
            <div className="flex justify-center items-center space-x-8 text-2xl font-bold text-white/60">
              <span>12K+ Volunteers</span>
              <span>•</span>
              <span>50K+ Lives Impacted</span>
              <span>•</span>
              <span>150+ Cities</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
