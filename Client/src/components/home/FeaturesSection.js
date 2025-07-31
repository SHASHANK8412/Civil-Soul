import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  Globe, 
  MessageCircle,
  TreePine,
  HeartHandshake,
  Dog,
  Droplets,
  ArrowRight
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Heart,
      title: 'Mental Health Support',
      description: 'Access counseling, AI chatbot support, and wellness resources for your mental wellbeing.',
      link: '/mental-health',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: Users,
      title: 'Volunteering Opportunities',
      description: 'Find meaningful volunteer work and earn certified internship certificates.',
      link: '/volunteering',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      icon: TreePine,
      title: 'Environment Conservation',
      description: 'Join environmental initiatives and help protect our planet for future generations.',
      link: '/environment',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: HeartHandshake,
      title: 'Elderly Care',
      description: 'Support seniors in nursing homes and bring joy to their lives through companionship.',
      link: '/elderly-care',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Droplets,
      title: 'Blood Donation',
      description: 'Participate in life-saving blood donation drives in rural and underserved areas.',
      link: '/blood-donation',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: Dog,
      title: 'Animal Welfare',
      description: 'Help rescue animals, support wildlife conservation, and promote animal rights.',
      link: '/animal-welfare',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How We Make a Difference
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            CivilSoul offers comprehensive support for both mental wellness and 
            community service, connecting you with opportunities to grow while helping others.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card hover-lift p-8 text-center"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Icon */}
              <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>

              {/* CTA Link */}
              <Link
                to={feature.link}
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Learn More
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16" data-aos="fade-up">
          <div className="inline-flex items-center space-x-4">
            <Link
              to="/register"
              className="btn-primary px-8 py-4"
            >
              Join Our Community
            </Link>
            <Link
              to="/about"
              className="btn-outline px-8 py-4"
            >
              Learn About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
