import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Heart, 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  LogOut, 
  Award, 
  MessageCircle,
  Bell,
  Search,
  Moon,
  Sun,
  Globe,
  HelpCircle,
  Shield,
  Zap,
  Gift,
  Calendar,
  BarChart3,
  Share2,
  Bookmark,
  Settings,
  Palette,
  Volume2,
  VolumeX,
  CreditCard,
  DollarSign,
  Wallet
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import blockchainService from '../../services/blockchainService';

const NavbarEnhanced = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  // State management
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  
  // Interactive state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [blockchainConnected, setBlockchainConnected] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => 
    localStorage.getItem('darkMode') === 'true'
  );
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  
  const searchRef = useRef(null);

  // Sample notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'certificate',
      title: 'Certificate Ready!',
      message: 'Your Environment Conservation certificate is ready for download.',
      time: '2 hours ago',
      read: false,
      icon: Award
    },
    {
      id: 2,
      type: 'volunteer',
      title: 'New Opportunity',
      message: 'Beach cleanup volunteer opportunity near you.',
      time: '1 day ago',
      read: false,
      icon: Zap
    },
    {
      id: 3,
      type: 'system',
      title: 'Performance Milestone',
      message: 'Congratulations! You\'ve completed 10 volunteer hours.',
      time: '2 days ago',
      read: false,
      icon: BarChart3
    }
  ]);

  // Language options
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  // Navigation items
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Volunteering', href: '/volunteering' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Contact', href: '/contact' }
  ];

  const services = [
    { 
      name: 'Mental Health Support', 
      href: '/mental-health',
      icon: 'MessageCircle',
      description: 'AI Chatbot, Counselling & Assessments',
      donationEnabled: true
    },
    { 
      name: 'Blood Donation', 
      href: '/blood-donation',
      icon: 'Heart',
      description: 'Find drives, schedule donations',
      donationEnabled: true
    },
    { 
      name: 'Environment', 
      href: '/environment',
      icon: 'Calendar',
      description: 'Conservation projects & initiatives',
      donationEnabled: true
    },
    { 
      name: 'Animal Welfare', 
      href: '/animal-welfare',
      icon: 'Gift',
      description: 'Animal rescue & care programs',
      donationEnabled: true
    },
    { 
      name: 'Elderly Care', 
      href: '/elderly-care',
      icon: 'User',
      description: 'Support programs for seniors',
      donationEnabled: true
    },
    { 
      name: 'Certificates', 
      href: '/certificates',
      icon: 'Award',
      description: 'Blockchain-verified achievements',
      donationEnabled: false
    }
  ];

  // Helper functions
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const connectBlockchain = async () => {
    try {
      await blockchainService.connectWallet();
      setBlockchainConnected(true);
      console.log('Blockchain connected successfully');
    } catch (error) {
      console.error('Failed to connect to blockchain:', error);
      setBlockchainConnected(true);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
    setIsLanguageOpen(false);
    localStorage.setItem('selectedLanguage', langCode);
    console.log('Language changed to:', langCode);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadNotifications(prev => Math.max(0, prev - 1));
  };

  const shareApp = (platform) => {
    const url = window.location.origin;
    const text = 'Check out CivilSoul - Making a difference in our communities together! 🌟';
    
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
      });
    }
    setIsShareModalOpen(false);
  };

  const handleQuickDonation = () => {
    setIsDonationModalOpen(true);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
    
    const savedSound = localStorage.getItem('soundEnabled');
    if (savedSound !== null) {
      setSoundEnabled(JSON.parse(savedSound));
    }
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-900/95 dark:border-gray-700 transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 hover:scale-105 transition-transform"
          >
            <Heart className="w-8 h-8 text-primary-600 animate-pulse" />
            <span className="text-xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              CivilSoul
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-all duration-200 relative group ${
                  isActive(item.href)
                    ? 'text-primary-600 scale-105'
                    : 'text-gray-700 hover:text-primary-600 hover:scale-105 dark:text-gray-300 dark:hover:text-primary-400'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full"></div>
                )}
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-center"></div>
              </Link>
            ))}
            
            {/* Enhanced Services Dropdown with Donation Options */}
            <div className="relative group">
              <button className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 transition-all duration-200 hover:scale-105 dark:text-gray-300 dark:hover:text-primary-400">
                Services
                <ChevronDown className="ml-1 w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-600 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="p-4">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                    Our Services
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {services.map((service) => (
                      <div key={service.name} className="group/service">
                        <Link
                          to={service.href}
                          className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105"
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${
                              service.name === 'Mental Health Support' ? 'bg-blue-100 dark:bg-blue-900/30' :
                              service.name === 'Blood Donation' ? 'bg-red-100 dark:bg-red-900/30' :
                              service.name === 'Environment' ? 'bg-green-100 dark:bg-green-900/30' :
                              service.name === 'Animal Welfare' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                              service.name === 'Elderly Care' ? 'bg-purple-100 dark:bg-purple-900/30' :
                              'bg-orange-100 dark:bg-orange-900/30'
                            }`}>
                              {service.name === 'Mental Health Support' && <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                              {service.name === 'Blood Donation' && <Heart className="w-4 h-4 text-red-600 dark:text-red-400" />}
                              {service.name === 'Environment' && <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />}
                              {service.name === 'Animal Welfare' && <Gift className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
                              {service.name === 'Elderly Care' && <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                              {service.name === 'Certificates' && <Award className="w-4 h-4 text-orange-600 dark:text-orange-400" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 dark:text-white group-hover/service:text-primary-600 dark:group-hover/service:text-primary-400 transition-colors">
                                {service.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {service.description}
                              </div>
                              {service.donationEnabled && (
                                <div className="flex items-center mt-2">
                                  <DollarSign className="w-3 h-3 text-green-500 mr-1" />
                                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">Donations Accepted</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-3 border-t dark:border-gray-600">
                    <Link
                      to="/services"
                      className="flex items-center justify-center w-full py-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium transition-colors"
                    >
                      View All Services
                      <ChevronDown className="ml-1 w-3 h-3 rotate-270" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Icons */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Quick Donation Button */}
            <button
              onClick={handleQuickDonation}
              className="p-2 text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-lg hover:shadow-xl"
              title="Quick Donation"
            >
              <DollarSign className="w-5 h-5" />
            </button>

            {/* Enhanced Search Icon */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 transform hover:scale-110"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              
              {isSearchOpen && (
                <div className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-600 z-50 transform transition-all duration-300">
                  <form onSubmit={handleSearch} className="p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search everything..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        autoFocus
                      />
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold">Quick Access:</div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { name: 'AI Mental Health', icon: MessageCircle, href: '/mental-health/chatbot' },
                          { name: 'Volunteer', icon: Heart, href: '/volunteering' },
                          { name: 'Donate', icon: DollarSign, href: '/donate' },
                          { name: 'Certificates', icon: Shield, href: '/certificates' }
                        ].map((item) => (
                          <Link 
                            key={item.name}
                            to={item.href} 
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center p-2 text-xs text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200 transform hover:scale-105"
                          >
                            <item.icon className="w-3 h-3 mr-2" />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Theme Selector */}
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 transform hover:scale-110"
              title="Theme Settings"
            >
              <Palette className="w-5 h-5" />
            </button>

            {/* Blockchain Connection */}
            <button
              onClick={connectBlockchain}
              className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 ${
                blockchainConnected 
                  ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 animate-pulse' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={blockchainConnected ? 'Blockchain Connected' : 'Connect to Blockchain'}
            >
              <Shield className="w-5 h-5" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 transform hover:scale-110"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Enhanced Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 transform hover:scale-110"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </div>
                )}
              </button>
              
              {isNotificationOpen && (
                <div className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-600 z-50 max-h-96 overflow-hidden">
                  <div className="p-4 border-b dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      {unreadNotifications > 0 && (
                        <button
                          onClick={() => {
                            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                            setUnreadNotifications(0);
                          }}
                          className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div className="p-2">
                        {notifications.slice(0, 5).map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 rounded-lg mb-2 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                              !notification.read ? 'bg-primary-50 dark:bg-primary-900/10 border-l-4 border-primary-500' : ''
                            }`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${
                                notification.type === 'certificate' ? 'bg-green-100 dark:bg-green-900/30' :
                                notification.type === 'volunteer' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                'bg-gray-100 dark:bg-gray-700'
                              }`}>
                                <notification.icon className={`w-4 h-4 ${
                                  notification.type === 'certificate' ? 'text-green-600 dark:text-green-400' :
                                  notification.type === 'volunteer' ? 'text-blue-600 dark:text-blue-400' :
                                  'text-gray-600 dark:text-gray-400'
                                }`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                    {notification.title}
                                  </h4>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="font-medium">{user?.name || 'User'}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-600 z-50">
                    <div className="p-4 border-b dark:border-gray-600">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{user?.name || 'User'}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4 mr-3" />
                        View Profile
                      </Link>
                      <Link
                        to="/donations"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Wallet className="w-4 h-4 mr-3" />
                        My Donations
                      </Link>
                      <div className="border-t dark:border-gray-600 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700 rounded-b-lg shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Quick Donation */}
              <button
                onClick={() => {
                  handleQuickDonation();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center py-3 px-4 text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-medium shadow-lg transition-all duration-200"
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Quick Donation
              </button>
              
              {/* Mobile Navigation Links */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Quick Donation Modal */}
      {isDonationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Quick Donation
              </h3>
              <button
                onClick={() => setIsDonationModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your donation helps us continue making a positive impact in communities worldwide. ❤️
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {['₹100', '₹250', '₹500', '₹1000'].map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    navigate('/donate', { state: { amount } });
                    setIsDonationModalOpen(false);
                  }}
                  className="py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-400 transition-colors font-medium text-gray-900 dark:text-white"
                >
                  {amount}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                navigate('/donate');
                setIsDonationModalOpen(false);
              }}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-lg transition-colors font-medium"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Custom Amount
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarEnhanced;
