import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Send,
  Award,
  Shield,
  MessageCircle,
  Calendar,
  Gift,
  User,
  ArrowRight,
  ExternalLink,
  Globe,
  ChevronUp
} from 'lucide-react';

const FooterEnhanced = () => {
  const [email, setEmail] = React.useState('');
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  // Handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      console.log('Newsletter subscription:', email);
      setEmail('');
      alert('Thank you for subscribing to our newsletter!');
    }
  };

  // Scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show/hide scroll to top button
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Mission', href: '/about#mission' },
    { name: 'Impact Stories', href: '/impact' },
    { name: 'Volunteer Stories', href: '/stories' },
    { name: 'Annual Report', href: '/reports' },
    { name: 'Careers', href: '/careers' }
  ];

  const services = [
    { 
      name: 'Mental Health Support', 
      href: '/mental-health',
      icon: MessageCircle,
      description: 'AI Chatbot & Counselling'
    },
    { 
      name: 'Blood Donation', 
      href: '/blood-donation',
      icon: Heart,
      description: 'Save Lives Together'
    },
    { 
      name: 'Environment', 
      href: '/environment',
      icon: Calendar,
      description: 'Conservation Projects'
    },
    { 
      name: 'Animal Welfare', 
      href: '/animal-welfare',
      icon: Gift,
      description: 'Animal Care & Rescue'
    },
    { 
      name: 'Elderly Care', 
      href: '/elderly-care',
      icon: User,
      description: 'Support for Seniors'
    },
    { 
      name: 'Certificates', 
      href: '/certificates',
      icon: Award,
      description: 'Blockchain Verified'
    }
  ];

  const supportLinks = [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Support', href: '/support' },
    { name: 'Community Guidelines', href: '/guidelines' },
    { name: 'Safety Resources', href: '/safety' },
    { name: 'Accessibility', href: '/accessibility' },
    { name: 'Report Issue', href: '/report' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Data Protection', href: '/data-protection' },
    { name: 'Disclaimer', href: '/disclaimer' }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/civilsoul', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/civilsoul', color: 'hover:text-sky-500' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/civilsoul', color: 'hover:text-pink-600' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/civilsoul', color: 'hover:text-red-600' },
    { name: 'LinkedIn', icon: ExternalLink, href: 'https://linkedin.com/company/civilsoul', color: 'hover:text-blue-700' }
  ];

  const partnerLogos = [
    { name: 'UN SDG', logo: '🇺🇳', description: 'United Nations SDG Partner' },
    { name: 'Red Cross', logo: '❤️', description: 'Red Cross Partnership' },
    { name: 'WHO', logo: '🏥', description: 'WHO Health Initiative' },
    { name: 'UNESCO', logo: '📚', description: 'UNESCO Education Program' }
  ];

  const stats = [
    { label: 'Volunteers Active', value: '10,000+', icon: User },
    { label: 'Lives Impacted', value: '50,000+', icon: Heart },
    { label: 'Projects Completed', value: '1,200+', icon: Award },
    { label: 'Countries Reached', value: '25+', icon: Globe }
  ];

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_70%)]"></div>
      
      {/* Main Footer Content */}
      <div className="relative">
        {/* Stats Section */}
        <div className="border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-4">
                Making a Real Impact
              </h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Together, we're building a better world. Here's how your participation contributes to meaningful change.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center group hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 mb-4 group-hover:shadow-lg group-hover:shadow-primary-500/25 transition-all duration-300">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter & Contact Section */}
        <div className="border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Newsletter Subscription */}
              <div>
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                  <Mail className="w-6 h-6 mr-2 text-primary-400" />
                  Stay Connected
                </h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Get updates on new volunteer opportunities, impact stories, and ways to make a difference in your community.
                </p>
                
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 rounded-lg font-semibold text-white flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Subscribe
                  </button>
                </form>
                
                <div className="flex items-center mt-4 text-sm text-gray-400">
                  <Shield className="w-4 h-4 mr-2 text-green-400" />
                  We respect your privacy. Unsubscribe anytime.
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-300 hover:text-white transition-colors">
                    <MapPin className="w-5 h-5 mr-3 text-primary-400 flex-shrink-0" />
                    <span>123 Compassion Street, Kindness City, KC 12345</span>
                  </div>
                  
                  <div className="flex items-center text-gray-300 hover:text-white transition-colors">
                    <Phone className="w-5 h-5 mr-3 text-primary-400 flex-shrink-0" />
                    <span>+1 (555) HELP-NOW</span>
                  </div>
                  
                  <div className="flex items-center text-gray-300 hover:text-white transition-colors">
                    <Mail className="w-5 h-5 mr-3 text-primary-400 flex-shrink-0" />
                    <span>hello@civilsoul.org</span>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-4">Follow Our Journey</h4>
                  <div className="flex space-x-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-300 ${social.color} transition-all duration-200 transform hover:scale-110 hover:shadow-lg`}
                        title={social.name}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Services */}
              <div>
                <h3 className="text-lg font-semibold mb-6 text-primary-400">Our Services</h3>
                <ul className="space-y-3">
                  {services.map((service) => (
                    <li key={service.name}>
                      <Link
                        to={service.href}
                        className="flex items-center text-gray-400 hover:text-white transition-all duration-200 group"
                      >
                        <service.icon className="w-4 h-4 mr-3 text-primary-400 group-hover:text-primary-300 transition-colors" />
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-xs text-gray-500">{service.description}</div>
                        </div>
                        <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold mb-6 text-primary-400">Quick Links</h3>
                <ul className="space-y-3">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                      >
                        {link.name}
                        <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-lg font-semibold mb-6 text-primary-400">Support</h3>
                <ul className="space-y-3">
                  {supportLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                      >
                        {link.name}
                        <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="text-lg font-semibold mb-6 text-primary-400">Legal</h3>
                <ul className="space-y-3">
                  {legalLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                      >
                        {link.name}
                        <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div className="border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Proud Partners</h3>
              <p className="text-gray-500 text-sm">Working together with global organizations to create lasting impact</p>
            </div>
            
            <div className="flex justify-center items-center space-x-8 md:space-x-12">
              {partnerLogos.map((partner, index) => (
                <div 
                  key={index}
                  className="text-center group cursor-pointer"
                  title={partner.description}
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-200">
                    {partner.logo}
                  </div>
                  <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                    {partner.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              {/* Logo and Copyright */}
              <div className="flex items-center mb-4 md:mb-0">
                <Link to="/" className="flex items-center space-x-2 group">
                  <Heart className="w-6 h-6 text-primary-400 group-hover:text-primary-300 transition-colors" />
                  <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                    CivilSoul
                  </span>
                </Link>
                <span className="text-gray-500 ml-4 text-sm">
                  © 2024 CivilSoul. All rights reserved.
                </span>
              </div>

              {/* Additional Info */}
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1 text-green-400" />
                  <span>Secure & Verified</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-1 text-yellow-400" />
                  <span>Certified Non-Profit</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-1 text-blue-400" />
                  <span>Global Impact</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 transform hover:scale-110 z-50"
          title="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </footer>
  );
};

export default FooterEnhanced;
