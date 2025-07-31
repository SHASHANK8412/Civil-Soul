import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  Play,
  Users,
  Heart,
  Globe,
  Award,
  Star
} from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>
      
      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left" data-aos="fade-right">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              Making a Difference Together
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Empower Your
              <span className="text-gradient block">Soul to Serve</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Join CivilSoul to make a meaningful impact through volunteering, 
              mental health support, and community service. Together, we can 
              build a better world.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link
                to="/volunteering"
                className="btn-primary inline-flex items-center justify-center px-8 py-4 text-lg"
              >
                Start Volunteering
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              
              <Link
                to="/mental-health"
                className="btn-outline inline-flex items-center justify-center px-8 py-4 text-lg"
              >
                Mental Health Support
                <Heart className="ml-2 w-5 h-5" />
              </Link>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">10K+</div>
                <div className="text-sm text-gray-600">Volunteers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-600">500+</div>
                <div className="text-sm text-gray-600">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-wellness-600">50K+</div>
                <div className="text-sm text-gray-600">Lives Impacted</div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Visual Content */}
          <div className="relative" data-aos="fade-left">
            <div className="relative z-10">
              {/* Main Hero Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Volunteers working together"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-4 animate-bounce-gentle">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Community</div>
                    <div className="text-sm text-gray-600">Building Together</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4 animate-bounce-gentle" style={{ animationDelay: '1s' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Global Impact</div>
                    <div className="text-sm text-gray-600">Worldwide Reach</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-1/2 -right-12 bg-white rounded-xl shadow-lg p-4 animate-bounce-gentle" style={{ animationDelay: '2s' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-wellness-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-wellness-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Certified</div>
                    <div className="text-sm text-gray-600">Recognition</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background Decorations */}
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full blur-3xl opacity-20"></div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
