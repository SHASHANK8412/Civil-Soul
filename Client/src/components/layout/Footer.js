import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Get Involved': [
      { name: 'Volunteer Opportunities', href: '/volunteering' },
      { name: 'Mental Health Support', href: '/mental-health' },
      { name: 'Environment Projects', href: '/environment' },
      { name: 'Elderly Care', href: '/elderly-care' },
      { name: 'Animal Welfare', href: '/animal-welfare' },
    ],
    'Resources': [
      { name: 'Blog', href: '/blogs' },
      { name: 'AI Chatbot', href: '/mental-health/chatbot' },
      { name: 'Self-Assessment', href: '/mental-health/surveys' },
      { name: 'Certificates', href: '/certificates' },
      { name: 'Crisis Support', href: '/contact' },
    ],
    'Organization': [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Careers', href: '/careers' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/civilsoul' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/civilsoul' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/civilsoul' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/civilsoul' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">CivilSoul</span>
            </Link>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering communities through social service, mental health support, 
              and volunteer opportunities. Together, we create positive change.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-3 text-primary-400" />
                <span>1-800-CIVILSOUL</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-3 text-primary-400" />
                <span>contact@civilsoul.org</span>
              </div>
              <div className="flex items-start text-gray-300">
                <MapPin className="w-4 h-4 mr-3 text-primary-400 mt-1" />
                <span>123 Service Street<br />Community City, CC 12345</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-6">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors inline-flex items-center group"
                    >
                      {link.name}
                      <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 pt-12 border-t border-gray-800">
          <div className="max-w-md mx-auto text-center lg:max-w-none lg:text-left lg:flex lg:items-center lg:justify-between">
            <div className="lg:flex-1">
              <h3 className="text-xl font-semibold mb-2">Stay Connected</h3>
              <p className="text-gray-300 mb-6 lg:mb-0">
                Get updates on new volunteer opportunities and wellness resources.
              </p>
            </div>
            <div className="lg:flex-shrink-0 lg:ml-8">
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Support Banner */}
      <div className="bg-red-900/30 border-t border-red-800/50">
        <div className="container-custom py-6">
          <div className="text-center">
            <p className="text-red-200 font-medium mb-2">
              🚨 Need immediate help? Crisis support is available 24/7
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <span className="text-red-100">
                <strong>Crisis Hotline:</strong> 988
              </span>
              <span className="text-red-100">
                <strong>Text Support:</strong> HOME to 741741
              </span>
              <span className="text-red-100">
                <strong>Emergency:</strong> 911
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} CivilSoul. All rights reserved. Made with ❤️ for humanity.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
