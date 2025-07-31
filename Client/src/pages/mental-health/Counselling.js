import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Calendar, 
  Clock, 
  User, 
  Star, 
  MapPin, 
  Phone, 
  Video, 
  MessageCircle, 
  Heart, 
  Award, 
  CheckCircle, 
  Filter,
  Search,
  ExternalLink,
  Shield,
  Brain,
  Stethoscope,
  Users,
  Globe,
  BookOpen,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Counselling = () => {
  const { user } = useSelector((state) => state.auth);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedSessionType, setSelectedSessionType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCalendlyLoading, setIsCalendlyLoading] = useState(false);

  // Mock counselors data (in real app, this would come from API)
  const counselors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      title: "Licensed Clinical Psychologist",
      specialties: ["Depression", "Anxiety", "Trauma", "CBT"],
      rating: 4.9,
      reviews: 127,
      experience: "12 years",
      location: "New York, NY",
      sessionTypes: ["video", "in-person"],
      languages: ["English", "Spanish"],
      priceRange: "$150-200",
      availability: "Available today",
      image: "/api/placeholder/100/100",
      bio: "Dr. Johnson specializes in cognitive-behavioral therapy and has extensive experience treating anxiety and depression. She takes a collaborative approach to therapy.",
      credentials: ["PhD in Clinical Psychology", "Licensed in NY", "APA Member"],
      calendlyUrl: "https://calendly.com/dr-sarah-johnson"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      title: "Licensed Marriage & Family Therapist",
      specialties: ["Couples Therapy", "Family Therapy", "Communication"],
      rating: 4.8,
      reviews: 89,
      experience: "8 years",
      location: "San Francisco, CA",
      sessionTypes: ["video", "in-person"],
      languages: ["English", "Mandarin"],
      priceRange: "$120-180",
      availability: "Available tomorrow",
      image: "/api/placeholder/100/100",
      bio: "Dr. Chen helps couples and families improve communication and resolve conflicts using evidence-based approaches.",
      credentials: ["MA in Marriage & Family Therapy", "Licensed LMFT", "Gottman Method Certified"],
      calendlyUrl: "https://calendly.com/dr-michael-chen"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      title: "Licensed Clinical Social Worker",
      specialties: ["Trauma", "PTSD", "Grief", "EMDR"],
      rating: 4.9,
      reviews: 156,
      experience: "15 years",
      location: "Austin, TX",
      sessionTypes: ["video", "phone"],
      languages: ["English", "Spanish"],
      priceRange: "$100-150",
      availability: "Available this week",
      image: "/api/placeholder/100/100",
      bio: "Dr. Rodriguez specializes in trauma therapy and uses EMDR to help clients process traumatic experiences.",
      credentials: ["MSW", "Licensed LCSW", "EMDR Certified"],
      calendlyUrl: "https://calendly.com/dr-emily-rodriguez"
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      title: "Psychiatrist",
      specialties: ["Medication Management", "Bipolar", "Depression", "Anxiety"],
      rating: 4.7,
      reviews: 94,
      experience: "20 years",
      location: "Chicago, IL",
      sessionTypes: ["video", "in-person"],
      languages: ["English"],
      priceRange: "$200-300",
      availability: "Available next week",
      image: "/api/placeholder/100/100",
      bio: "Dr. Wilson is a board-certified psychiatrist who specializes in medication management for mood disorders.",
      credentials: ["MD", "Board Certified Psychiatrist", "APA Fellow"],
      calendlyUrl: "https://calendly.com/dr-james-wilson"
    },
    {
      id: 5,
      name: "Dr. Lisa Thompson",
      title: "Licensed Professional Counselor",
      specialties: ["Adolescents", "Young Adults", "Identity", "Self-Esteem"],
      rating: 4.8,
      reviews: 78,
      experience: "6 years",
      location: "Denver, CO",
      sessionTypes: ["video", "in-person"],
      languages: ["English"],
      priceRange: "$90-140",
      availability: "Available today",
      image: "/api/placeholder/100/100",
      bio: "Dr. Thompson works primarily with teens and young adults, helping them navigate identity issues and build self-confidence.",
      credentials: ["MA in Counseling", "Licensed LPC", "Adolescent Specialist"],
      calendlyUrl: "https://calendly.com/dr-lisa-thompson"
    },
    {
      id: 6,
      name: "Dr. David Kim",
      title: "Licensed Clinical Psychologist",
      specialties: ["Mindfulness", "Stress Management", "Work-Life Balance"],
      rating: 4.9,
      reviews: 112,
      experience: "10 years",
      location: "Seattle, WA",
      sessionTypes: ["video", "in-person"],
      languages: ["English", "Korean"],
      priceRange: "$130-170",
      availability: "Available this week",
      image: "/api/placeholder/100/100",
      bio: "Dr. Kim integrates mindfulness and acceptance-based therapies to help clients manage stress and find balance.",
      credentials: ["PhD in Psychology", "Licensed Psychologist", "Mindfulness Certified"],
      calendlyUrl: "https://calendly.com/dr-david-kim"
    }
  ];

  const specialties = [
    { value: 'all', label: 'All Specialties', icon: Brain },
    { value: 'anxiety', label: 'Anxiety', icon: Heart },
    { value: 'depression', label: 'Depression', icon: Brain },
    { value: 'trauma', label: 'Trauma & PTSD', icon: Shield },
    { value: 'couples', label: 'Couples Therapy', icon: Users },
    { value: 'family', label: 'Family Therapy', icon: Users },
    { value: 'adolescent', label: 'Teen & Young Adult', icon: User },
    { value: 'medication', label: 'Medication Management', icon: Stethoscope }
  ];

  const sessionTypes = [
    { value: 'all', label: 'All Types', icon: Globe },
    { value: 'video', label: 'Video Sessions', icon: Video },
    { value: 'in-person', label: 'In-Person', icon: MapPin },
    { value: 'phone', label: 'Phone Sessions', icon: Phone }
  ];

  const filteredCounselors = counselors.filter(counselor => {
    const matchesSpecialty = selectedSpecialty === 'all' || 
      counselor.specialties.some(spec => 
        spec.toLowerCase().includes(selectedSpecialty) ||
        (selectedSpecialty === 'anxiety' && spec.toLowerCase().includes('anxiety')) ||
        (selectedSpecialty === 'depression' && spec.toLowerCase().includes('depression')) ||
        (selectedSpecialty === 'trauma' && (spec.toLowerCase().includes('trauma') || spec.toLowerCase().includes('ptsd'))) ||
        (selectedSpecialty === 'couples' && spec.toLowerCase().includes('couples')) ||
        (selectedSpecialty === 'family' && spec.toLowerCase().includes('family')) ||
        (selectedSpecialty === 'adolescent' && (spec.toLowerCase().includes('adolescent') || spec.toLowerCase().includes('young adult'))) ||
        (selectedSpecialty === 'medication' && spec.toLowerCase().includes('medication'))
      );
    
    const matchesSessionType = selectedSessionType === 'all' || 
      counselor.sessionTypes.includes(selectedSessionType);
    
    const matchesSearch = searchQuery === '' || 
      counselor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      counselor.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSpecialty && matchesSessionType && matchesSearch;
  });

  const openCalendlyModal = (counselor) => {
    setSelectedCounselor(counselor);
    setShowBookingModal(true);
    setIsCalendlyLoading(true);
    
    // Simulate Calendly loading
    setTimeout(() => {
      setIsCalendlyLoading(false);
    }, 1500);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedCounselor(null);
    setIsCalendlyLoading(false);
  };

  // Simulate Calendly widget (in real app, you'd use the actual Calendly embed)
  const CalendlyWidget = ({ counselor }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [appointmentType, setAppointmentType] = useState('video');

    const availableDates = [
      new Date().toISOString().split('T')[0],
      new Date(Date.now() + 86400000).toISOString().split('T')[0],
      new Date(Date.now() + 172800000).toISOString().split('T')[0],
      new Date(Date.now() + 259200000).toISOString().split('T')[0]
    ];

    const availableTimes = [
      '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'
    ];

    const bookAppointment = () => {
      if (selectedDate && selectedTime) {
        toast.success(`Appointment booked with ${counselor.name} on ${selectedDate} at ${selectedTime}`);
        closeBookingModal();
      } else {
        toast.error('Please select both date and time');
      }
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Book Session with {counselor.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {counselor.title}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Session Type
            </label>
            <select
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {counselor.sessionTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'video' ? 'Video Session' : 
                   type === 'in-person' ? 'In-Person Session' : 
                   'Phone Session'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Date
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Choose a date</option>
              {availableDates.map(date => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Time
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableTimes.map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-2 text-sm rounded-lg border transition-colors ${
                    selectedTime === time
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Session Duration:</span>
              <span className="font-medium">50 minutes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">Session Fee:</span>
              <span className="font-medium">{counselor.priceRange}</span>
            </div>
          </div>

          <button
            onClick={bookAppointment}
            disabled={!selectedDate || !selectedTime}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            Book Appointment
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Professional Counseling
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Connect with licensed mental health professionals. Book appointments with certified counselors, 
            therapists, and psychiatrists who can provide the support you need.
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search counselors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Specialty Filter */}
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {specialties.map(specialty => (
                  <option key={specialty.value} value={specialty.value}>
                    {specialty.label}
                  </option>
                ))}
              </select>

              {/* Session Type Filter */}
              <select
                value={selectedSessionType}
                onChange={(e) => setSelectedSessionType(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {sessionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Counselors Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredCounselors.map((counselor) => (
                <motion.div
                  key={counselor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="p-6">
                    {/* Profile Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mr-4">
                          <User className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {counselor.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {counselor.title}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-yellow-500 mb-1">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="ml-1 text-sm font-medium">{counselor.rating}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {counselor.reviews} reviews
                        </p>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {counselor.specialties.slice(0, 3).map((specialty, index) => (
                          <span
                            key={index}
                            className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                        {counselor.specialties.length > 3 && (
                          <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
                            +{counselor.specialties.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <Award className="w-4 h-4 mr-2" />
                        {counselor.experience} experience
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {counselor.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {counselor.availability}
                      </div>
                    </div>

                    {/* Session Types */}
                    <div className="flex space-x-2 mb-4">
                      {counselor.sessionTypes.map((type, index) => (
                        <div key={index} className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          {type === 'video' && <Video className="w-3 h-3 mr-1" />}
                          {type === 'in-person' && <MapPin className="w-3 h-3 mr-1" />}
                          {type === 'phone' && <Phone className="w-3 h-3 mr-1" />}
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </div>
                      ))}
                    </div>

                    {/* Price and Book Button */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {counselor.priceRange}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                          /session
                        </span>
                      </div>
                      <button
                        onClick={() => openCalendlyModal(counselor)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                      >
                        Book Session
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredCounselors.length === 0 && (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No counselors found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your filters to see more results.
              </p>
            </div>
          )}
        </div>

        {/* Booking Modal */}
        <AnimatePresence>
          {showBookingModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Book Appointment
                    </h2>
                    <button
                      onClick={closeBookingModal}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {isCalendlyLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-300">Loading calendar...</p>
                    </div>
                  ) : (
                    selectedCounselor && <CalendlyWidget counselor={selectedCounselor} />
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Information Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Why Choose Professional Counseling?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Licensed Professionals
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  All our counselors are licensed mental health professionals with verified credentials.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Flexible Sessions
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Choose from video, phone, or in-person sessions based on your comfort and needs.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Personalized Care
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Get matched with counselors who specialize in your specific needs and concerns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Counselling;
