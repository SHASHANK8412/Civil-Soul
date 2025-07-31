import React from 'react';
import { 
  Users, 
  Heart, 
  Award, 
  Globe,
  TrendingUp,
  Clock
} from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      number: '12,000+',
      label: 'Active Volunteers',
      description: 'Dedicated individuals making a difference',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      icon: Heart,
      number: '50,000+',
      label: 'Lives Impacted',
      description: 'People helped through our initiatives',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: Award,
      number: '8,500+',
      label: 'Certificates Issued',
      description: 'Recognized volunteer achievements',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: Globe,
      number: '150+',
      label: 'Cities Reached',
      description: 'Global presence across communities',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: TrendingUp,
      number: '95%',
      label: 'Success Rate',
      description: 'Successful project completion',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Clock,
      number: '100K+',
      label: 'Volunteer Hours',
      description: 'Time dedicated to service',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See the tangible difference we're making together in communities 
            around the world through collective action and compassion.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Icon */}
              <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center mb-6`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>

              {/* Number */}
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.number}
              </div>

              {/* Label */}
              <div className="text-lg font-semibold text-gray-700 mb-2">
                {stat.label}
              </div>

              {/* Description */}
              <div className="text-gray-600 text-sm leading-relaxed">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16" data-aos="fade-up">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Be Part of These Numbers?
            </h3>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              Join thousands of volunteers who are already making a difference. 
              Your contribution, no matter how small, creates ripples of positive change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
                Start Volunteering Today
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-semibold transition-colors">
                View Success Stories
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
