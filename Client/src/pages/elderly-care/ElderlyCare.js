import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Users, 
  Calendar, 
  Phone, 
  MapPin, 
  Clock, 
  Star,
  ArrowRight,
  Shield,
  Activity,
  Smile,
  Gift,
  BookOpen,
  Music,
  Camera,
  MessageCircle,
  User,
  Mail,
  Home,
  Car,
  Utensils,
  Stethoscope,
  CheckCircle,
  AlertCircle,
  Plus,
  Filter,
  Search
} from 'lucide-react';

const ElderlyCare = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [selectedService, setSelectedService] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Services data
  const services = [
    {
      id: 1,
      title: "Companionship Services",
      description: "Friendly visits and emotional support to combat loneliness",
      icon: Heart,
      color: "bg-pink-100 text-pink-600",
      features: ["Regular visits", "Conversation partner", "Emotional support", "Activity companion"],
      price: "Free for volunteers",
      duration: "2-4 hours per visit",
      availability: "Daily",
      volunteers: 45,
      rating: 4.9
    },
    {
      id: 2,
      title: "Healthcare Support",
      description: "Medical appointment assistance and health monitoring",
      icon: Stethoscope,
      color: "bg-blue-100 text-blue-600",
      features: ["Appointment reminders", "Transportation help", "Medication assistance", "Health monitoring"],
      price: "Covered by insurance",
      duration: "1-3 hours",
      availability: "Mon-Fri",
      volunteers: 23,
      rating: 4.8
    },
    {
      id: 3,
      title: "Home Assistance",
      description: "Help with daily activities and household tasks",
      icon: Home,
      color: "bg-green-100 text-green-600",
      features: ["Meal preparation", "Light housekeeping", "Shopping assistance", "Technology help"],
      price: "$15-25/hour",
      duration: "2-6 hours",
      availability: "Daily",
      volunteers: 38,
      rating: 4.7
    },
    {
      id: 4,
      title: "Transportation Services",
      description: "Safe transportation for appointments and errands",
      icon: Car,
      color: "bg-purple-100 text-purple-600",
      features: ["Medical appointments", "Grocery shopping", "Social visits", "Emergency transport"],
      price: "$0.50/mile",
      duration: "As needed",
      availability: "24/7 emergency",
      volunteers: 31,
      rating: 4.9
    },
    {
      id: 5,
      title: "Activity Programs",
      description: "Engaging activities to promote physical and mental wellness",
      icon: Activity,
      color: "bg-orange-100 text-orange-600",
      features: ["Exercise programs", "Art & crafts", "Music therapy", "Book clubs"],
      price: "Free group activities",
      duration: "1-2 hours",
      availability: "Weekly schedules",
      volunteers: 52,
      rating: 4.8
    },
    {
      id: 6,
      title: "Meal Services",
      description: "Nutritious meal preparation and delivery",
      icon: Utensils,
      color: "bg-yellow-100 text-yellow-600",
      features: ["Meal planning", "Home cooking", "Dietary restrictions", "Nutrition counseling"],
      price: "$10-15/meal",
      duration: "1-2 hours prep",
      availability: "Daily delivery",
      volunteers: 29,
      rating: 4.6
    }
  ];

  // Sample elderly care providers/volunteers
  const careProviders = [
    {
      id: 1,
      name: "Margaret Thompson",
      role: "Certified Caregiver",
      experience: "8 years",
      specialties: ["Dementia care", "Companionship", "Medication assistance"],
      rating: 4.9,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&crop=face",
      availability: "Mon-Fri, 9AM-5PM",
      location: "Downtown",
      verified: true,
      languages: ["English", "Spanish"],
      services: ["Companionship", "Healthcare Support", "Home Assistance"]
    },
    {
      id: 2,
      name: "Robert Johnson",
      role: "Activity Coordinator",
      experience: "5 years",
      specialties: ["Physical therapy", "Music therapy", "Group activities"],
      rating: 4.8,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop&crop=face",
      availability: "Tue-Sat, 10AM-6PM",
      location: "Northside",
      verified: true,
      languages: ["English"],
      services: ["Activity Programs", "Healthcare Support"]
    },
    {
      id: 3,
      name: "Sarah Williams",
      role: "Volunteer Companion",
      experience: "3 years",
      specialties: ["Reading", "Conversation", "Light cooking"],
      rating: 4.7,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=80&h=80&fit=crop&crop=face",
      availability: "Weekends, 1PM-7PM",
      location: "Southside",
      verified: true,
      languages: ["English", "French"],
      services: ["Companionship", "Meal Services"]
    }
  ];

  // Sample upcoming activities
  const upcomingActivities = [
    {
      id: 1,
      title: "Senior Yoga Class",
      date: "2024-12-20",
      time: "10:00 AM",
      duration: "1 hour",
      location: "Community Center",
      participants: 15,
      maxParticipants: 20,
      instructor: "Lisa Chen",
      difficulty: "Beginner",
      category: "Exercise"
    },
    {
      id: 2,
      title: "Art & Crafts Workshop",
      date: "2024-12-21",
      time: "2:00 PM",
      duration: "2 hours",
      location: "Senior Center",
      participants: 8,
      maxParticipants: 12,
      instructor: "Michael Davis",
      difficulty: "All levels",
      category: "Creative"
    },
    {
      id: 3,
      title: "Book Club Meeting",
      date: "2024-12-22",
      time: "3:00 PM",
      duration: "1.5 hours",
      location: "Public Library",
      participants: 12,
      maxParticipants: 15,
      instructor: "Emma Wilson",
      difficulty: "All levels",
      category: "Social"
    }
  ];

  const stats = [
    { label: "Seniors Served", value: "2,400+", icon: Users, color: "text-blue-600" },
    { label: "Active Volunteers", value: "180+", icon: Heart, color: "text-pink-600" },
    { label: "Weekly Activities", value: "50+", icon: Calendar, color: "text-green-600" },
    { label: "Satisfaction Rate", value: "98%", icon: Star, color: "text-yellow-600" }
  ];

  const handleServiceRequest = (serviceId) => {
    setSelectedService(serviceId);
    // In a real app, this would open a booking modal or navigate to booking page
    console.log('Requesting service:', serviceId);
  };

  const handleVolunteerSignup = () => {
    // In a real app, this would navigate to volunteer registration
    console.log('Volunteer signup');
  };

  const handleEmergencyContact = () => {
    // In a real app, this would initiate emergency contact
    alert('Emergency services have been contacted. Help is on the way!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Caring for Our Elders
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Comprehensive support services for senior citizens in our community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setActiveTab('services')}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Services
              </button>
              <button 
                onClick={handleVolunteerSignup}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Become a Volunteer
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 mb-4 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'services', label: 'Services', icon: Shield },
              { id: 'providers', label: 'Care Providers', icon: Users },
              { id: 'activities', label: 'Activities', icon: Calendar },
              { id: 'emergency', label: 'Emergency', icon: AlertCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Services Tab */}
        {activeTab === 'services' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${service.color} mb-4`}>
                      <service.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{service.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Price:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{service.price}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Duration:</span>
                        <span className="text-sm text-gray-900 dark:text-white">{service.duration}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Available:</span>
                        <span className="text-sm text-gray-900 dark:text-white">{service.availability}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Volunteers:</span>
                        <span className="text-sm text-gray-900 dark:text-white">{service.volunteers} active</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{service.rating}</span>
                      </div>
                      <button
                        onClick={() => handleServiceRequest(service.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        Request Service
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Care Providers Tab */}
        {activeTab === 'providers' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">Care Providers</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search providers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Locations</option>
                  <option value="Downtown">Downtown</option>
                  <option value="Northside">Northside</option>
                  <option value="Southside">Southside</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {careProviders.map((provider, index) => (
                <motion.div
                  key={provider.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <img 
                        src={provider.image} 
                        alt={provider.name}
                        className="w-16 h-16 rounded-full mr-4"
                      />
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{provider.name}</h3>
                          {provider.verified && (
                            <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{provider.role}</p>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{provider.rating}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">({provider.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">{provider.experience} experience</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">{provider.location}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">{provider.availability}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Specialties:</h4>
                      <div className="flex flex-wrap gap-1">
                        {provider.specialties.map((specialty, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Services:</h4>
                      <div className="flex flex-wrap gap-1">
                        {provider.services.map((service, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Book Appointment
                      </button>
                      <button className="flex-1 border border-blue-600 text-blue-600 dark:text-blue-400 py-2 px-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm">
                        View Profile
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Upcoming Activities</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Create Activity
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{activity.title}</h3>
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm rounded-full">
                          {activity.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{activity.time}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">{activity.duration}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">{activity.location}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">Instructor: {activity.instructor}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Participants</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {activity.participants}/{activity.maxParticipants}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(activity.participants / activity.maxParticipants) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <button 
                      className={`w-full py-2 px-4 rounded-lg transition-colors ${
                        activity.participants >= activity.maxParticipants
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      disabled={activity.participants >= activity.maxParticipants}
                    >
                      {activity.participants >= activity.maxParticipants ? 'Fully Booked' : 'Join Activity'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Tab */}
        {activeTab === 'emergency' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Emergency Support</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Emergency Contacts */}
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-4 flex items-center">
                  <AlertCircle className="w-6 h-6 mr-2" />
                  Emergency Contacts
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Emergency Services</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Fire, Police, Medical</div>
                    </div>
                    <button 
                      onClick={() => window.open('tel:911')}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      911
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Senior Help Line</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">24/7 Support</div>
                    </div>
                    <button 
                      onClick={() => window.open('tel:1-800-SENIORS')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Call
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Crisis Counseling</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Mental health support</div>
                    </div>
                    <button 
                      onClick={() => window.open('tel:988')}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      988
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-2" />
                  Quick Actions
                </h3>
                <div className="space-y-4">
                  <button 
                    onClick={handleEmergencyContact}
                    className="w-full p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                  >
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Emergency Alert
                  </button>
                  
                  <button className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Request Wellness Check
                  </button>
                  
                  <button className="w-full p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Chat with Support
                  </button>
                </div>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Safety Tips for Seniors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Home Safety</h4>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Keep emergency numbers visible near phones</li>
                    <li>• Install good lighting in hallways and stairs</li>
                    <li>• Remove tripping hazards like loose rugs</li>
                    <li>• Test smoke detectors monthly</li>
                    <li>• Keep medications organized and labeled</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Personal Safety</h4>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Carry a medical alert device</li>
                    <li>• Let someone know your daily routine</li>
                    <li>• Keep a charged phone with you</li>
                    <li>• Avoid sharing personal information</li>
                    <li>• Trust your instincts about suspicious situations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElderlyCare;
