import React from 'react';
import { 
  Heart, 
  Users, 
  Globe, 
  Award,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  Target,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Compassion',
      description: 'We believe in the power of empathy and kindness to transform lives and communities.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Together we are stronger. Building connections that last and create lasting impact.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Local actions with global vision. Every small act contributes to worldwide change.'
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Maintaining the highest standards of safety and trust in all our programs.'
    }
  ];

  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b526?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      bio: 'Mental health advocate with 15+ years in community service and social innovation.'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Volunteer Programs',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      bio: 'Former Peace Corps volunteer dedicated to creating meaningful volunteer experiences.'
    },
    {
      name: 'Dr. Priya Patel',
      role: 'Chief Mental Health Officer',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      bio: 'Licensed therapist specializing in community mental health and crisis intervention.'
    },
    {
      name: 'James Wilson',
      role: 'Technology Director',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      bio: 'Tech entrepreneur passionate about using technology for social good and innovation.'
    }
  ];

  const milestones = [
    { year: '2020', event: 'CivilSoul founded with vision of combining mental health and volunteer work' },
    { year: '2021', event: 'Launched first volunteer programs in 5 cities, helping 1,000+ people' },
    { year: '2022', event: 'Introduced AI mental health chatbot and expanded to 25 cities' },
    { year: '2023', event: 'Reached 10,000 volunteers and launched certificate program' },
    { year: '2024', event: 'Global expansion to 150+ cities across 20 countries' },
    { year: '2025', event: 'Over 50,000 lives impacted, 100,000+ volunteer hours logged' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 section-padding">
        <div className="container-custom">
          <div className="text-center mb-16" data-aos="fade-up">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Story of
              <span className="text-gradient block">Hope & Service</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              CivilSoul was born from a simple belief: when we care for our mental health 
              and serve others, we create a ripple effect of positive change that transforms 
              communities and heals the world.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Volunteers working together"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div data-aos="fade-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                The Beginning of Our Journey
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                In 2020, during one of humanity's most challenging times, our founder 
                Dr. Sarah Chen recognized a profound connection between mental wellness 
                and community service. Having worked in mental health for over a decade, 
                she witnessed how helping others could be one of the most powerful forms 
                of therapy.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                What started as a small local initiative to connect mental health support 
                with volunteer opportunities has grown into a global movement. Today, 
                CivilSoul serves as a bridge between those seeking purpose and communities 
                in need, creating healing through service.
              </p>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">50K+</div>
                  <div className="text-sm text-gray-600">Lives Touched</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-600">12K+</div>
                  <div className="text-sm text-gray-600">Volunteers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-wellness-600">150+</div>
                  <div className="text-sm text-gray-600">Cities</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="card p-8" data-aos="fade-up">
              <Target className="w-12 h-12 text-primary-600 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To create a world where mental wellness and community service work hand in hand, 
                empowering individuals to heal themselves while healing their communities. We 
                believe that everyone deserves access to mental health support and the opportunity 
                to make a meaningful difference.
              </p>
            </div>
            <div className="card p-8" data-aos="fade-up" data-aos-delay="100">
              <Lightbulb className="w-12 h-12 text-secondary-600 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                A future where every person has the tools and support they need for mental wellness, 
                and every community has dedicated volunteers working to address its most pressing 
                challenges. Together, we envision a world of empowered, connected, and thriving communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and shape the culture of our community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-6"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From a small idea to a global movement - see how we've grown together.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="flex items-start mb-8 last:mb-0"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="flex-shrink-0 w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-6">
                  {milestone.year}
                </div>
                <div className="flex-grow pt-2">
                  <p className="text-gray-700 leading-relaxed">
                    {milestone.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate leaders dedicated to creating positive change in the world.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="text-center"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-6"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Helpline & Contact */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container-custom">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              We're Here to Help
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Whether you need immediate support or want to get involved, our team is ready to assist you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Emergency Helpline */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center" data-aos="fade-up">
              <Phone className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">24/7 Crisis Helpline</h3>
              <p className="text-white/80 mb-6">
                Immediate mental health support available around the clock.
              </p>
              <div className="space-y-2">
                <div className="text-2xl font-bold">1-800-CIVILSOUL</div>
                <div className="text-sm opacity-80">(1-800-248-4576)</div>
              </div>
            </div>

            {/* General Contact */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center" data-aos="fade-up" data-aos-delay="100">
              <Mail className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">General Inquiries</h3>
              <p className="text-white/80 mb-6">
                Questions about volunteering, programs, or partnerships.
              </p>
              <div className="space-y-2">
                <div className="text-lg">contact@civilsoul.org</div>
                <div className="text-sm opacity-80">Response within 24 hours</div>
              </div>
            </div>

            {/* Office Location */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center" data-aos="fade-up" data-aos-delay="200">
              <MapPin className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Visit Our Office</h3>
              <p className="text-white/80 mb-6">
                Come see us for in-person support and collaboration.
              </p>
              <div className="space-y-2">
                <div>123 Service Street</div>
                <div>Community City, CC 12345</div>
                <div className="text-sm opacity-80 flex items-center justify-center mt-4">
                  <Clock className="w-4 h-4 mr-2" />
                  Mon-Fri: 9 AM - 6 PM EST
                </div>
              </div>
            </div>
          </div>

          {/* Additional Crisis Resources */}
          <div className="mt-12 text-center" data-aos="fade-up">
            <h3 className="text-xl font-semibold mb-6">Additional Crisis Resources</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="bg-red-500/20 rounded-lg p-4">
                <div className="font-medium">National Suicide Prevention</div>
                <div className="text-2xl font-bold">988</div>
              </div>
              <div className="bg-red-500/20 rounded-lg p-4">
                <div className="font-medium">Crisis Text Line</div>
                <div className="font-bold">Text HOME to 741741</div>
              </div>
              <div className="bg-red-500/20 rounded-lg p-4">
                <div className="font-medium">Domestic Violence</div>
                <div className="font-bold">1-800-799-7233</div>
              </div>
              <div className="bg-red-500/20 rounded-lg p-4">
                <div className="font-medium">SAMHSA Helpline</div>
                <div className="font-bold">1-800-662-4357</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-white">
        <div className="container-custom text-center" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Join Our Mission?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Whether you're looking to volunteer, seeking support, or want to partner with us, 
            there's a place for you in the CivilSoul community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="btn-primary px-8 py-4 text-lg inline-flex items-center"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a
              href="/contact"
              className="btn-outline px-8 py-4 text-lg"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
