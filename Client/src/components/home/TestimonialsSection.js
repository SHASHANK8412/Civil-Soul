import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Environmental Volunteer',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b526?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      content: 'CivilSoul helped me find my purpose. Through their platform, I\'ve been able to contribute to environmental conservation while earning certificates that boosted my career.',
      rating: 5,
      project: 'Tree Planting Initiative'
    },
    {
      name: 'Michael Chen',
      role: 'Mental Health Advocate',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      content: 'The mental health support I received here was life-changing. Now I volunteer as a peer counselor, giving back to the community that helped me heal.',
      rating: 5,
      project: 'Peer Counseling Program'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Elderly Care Volunteer',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      content: 'Working with seniors through CivilSoul has been incredibly rewarding. The platform made it easy to find opportunities that align with my values and schedule.',
      rating: 5,
      project: 'Senior Companion Program'
    },
    {
      name: 'David Kim',
      role: 'Animal Welfare Activist',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      content: 'CivilSoul connected me with local animal shelters and wildlife conservation projects. The impact we\'ve made together has been beyond my expectations.',
      rating: 5,
      project: 'Wildlife Conservation'
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Stories from Our Community
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from volunteers and beneficiaries who have experienced the 
            transformative power of community service and mutual support.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-8 relative hover:shadow-lg transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-primary-200">
                <Quote className="w-8 h-8" />
              </div>

              {/* Content */}
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed text-lg italic">
                  "{testimonial.content}"
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Author Info */}
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                  <div className="text-sm text-primary-600 font-medium">
                    {testimonial.project}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Testimonial */}
        <div className="mt-16" data-aos="fade-up">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white text-center">
            <Quote className="w-12 h-12 text-white/30 mx-auto mb-6" />
            <blockquote className="text-xl md:text-2xl font-medium mb-6 max-w-4xl mx-auto">
              "CivilSoul isn't just a platform—it's a movement. It has brought together 
              people from all walks of life to create positive change. The sense of 
              community and purpose I've found here has enriched my life beyond measure."
            </blockquote>
            <div className="flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                alt="Dr. James Wilson"
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div className="text-left">
                <div className="font-semibold">Dr. James Wilson</div>
                <div className="text-white/80">Community Leader & Advisor</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center" data-aos="fade-up">
          <p className="text-gray-600 mb-8">Trusted by organizations worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">WHO</div>
            <div className="text-2xl font-bold text-gray-400">UNICEF</div>
            <div className="text-2xl font-bold text-gray-400">Red Cross</div>
            <div className="text-2xl font-bold text-gray-400">Habitat</div>
            <div className="text-2xl font-bold text-gray-400">Greenpeace</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
