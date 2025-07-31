import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  User,
  Star,
  Filter,
  Search,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Home,
  Activity,
  Shield,
  Camera,
  MessageCircle,
  Share2,
  BookOpen,
  Award,
  DollarSign,
  Truck,
  Stethoscope,
  Gift
} from 'lucide-react';

const AnimalWelfare = () => {
  const [activeTab, setActiveTab] = useState('rescue');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnimalType, setSelectedAnimalType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [favoriteAnimals, setFavoriteAnimals] = useState([]);

  // Sample animals available for adoption
  const adoptionAnimals = [
    {
      id: 1,
      name: "Buddy",
      type: "Dog",
      breed: "Golden Retriever Mix",
      age: "3 years",
      gender: "Male",
      size: "Large",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop",
      location: "Downtown Animal Shelter",
      description: "Buddy is a friendly, energetic dog who loves playing fetch and going on long walks.",
      vaccinated: true,
      spayed: true,
      goodWithKids: true,
      goodWithPets: true,
      specialNeeds: false,
      adoptionFee: 150,
      urgency: "low",
      shelterContact: "+1-555-0123",
      dateAvailable: "2024-12-10"
    },
    {
      id: 2,
      name: "Whiskers",
      type: "Cat",
      breed: "Domestic Shorthair",
      age: "2 years",
      gender: "Female",
      size: "Medium",
      image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop",
      location: "Northside Pet Rescue",
      description: "Whiskers is a gentle, affectionate cat who loves cuddles and sunny windowsills.",
      vaccinated: true,
      spayed: true,
      goodWithKids: true,
      goodWithPets: false,
      specialNeeds: false,
      adoptionFee: 75,
      urgency: "medium",
      shelterContact: "+1-555-0124",
      dateAvailable: "2024-12-05"
    },
    {
      id: 3,
      name: "Charlie",
      type: "Dog",
      breed: "Border Collie",
      age: "5 years",
      gender: "Male",
      size: "Medium",
      image: "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=300&h=300&fit=crop",
      location: "Southside Animal Haven",
      description: "Charlie is a smart, loyal dog who needs an active family. Great with training!",
      vaccinated: true,
      spayed: true,
      goodWithKids: true,
      goodWithPets: true,
      specialNeeds: false,
      adoptionFee: 200,
      urgency: "high",
      shelterContact: "+1-555-0125",
      dateAvailable: "2024-11-28"
    },
    {
      id: 4,
      name: "Luna",
      type: "Cat",
      breed: "Persian Mix",
      age: "1 year",
      gender: "Female",
      size: "Small",
      image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=300&h=300&fit=crop",
      location: "Downtown Animal Shelter",
      description: "Luna is a playful kitten who loves toys and exploring. Perfect for a loving family.",
      vaccinated: true,
      spayed: false,
      goodWithKids: true,
      goodWithPets: true,
      specialNeeds: false,
      adoptionFee: 100,
      urgency: "low",
      shelterContact: "+1-555-0123",
      dateAvailable: "2024-12-15"
    }
  ];

  // Sample rescue stories
  const rescueStories = [
    {
      id: 1,
      title: "Max's Miraculous Recovery",
      animal: "German Shepherd",
      story: "Max was found abandoned with severe injuries. Thanks to our rescue team and veterinary care, he's now healthy and living with a loving family.",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop",
      rescueDate: "2024-10-15",
      volunteer: "Sarah Johnson",
      status: "Success",
      donationsReceived: 2450
    },
    {
      id: 2,
      title: "Rescue Mission: Street Cats",
      animal: "Multiple Cats",
      story: "Our team rescued 12 cats from a hoarding situation. All have been rehabilitated and 8 have found forever homes.",
      image: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=400&h=300&fit=crop",
      rescueDate: "2024-11-20",
      volunteer: "Mike Rodriguez",
      status: "Ongoing",
      donationsReceived: 1800
    },
    {
      id: 3,
      title: "Bella's Second Chance",
      animal: "Labrador Mix",
      story: "Bella was returned to the shelter three times before finding the perfect match. Patience pays off!",
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
      rescueDate: "2024-09-08",
      volunteer: "Emma Wilson",
      status: "Success",
      donationsReceived: 950
    }
  ];

  // Sample shelters and organizations
  const shelters = [
    {
      id: 1,
      name: "Downtown Animal Shelter",
      type: "Municipal Shelter",
      address: "123 Main St, Downtown",
      phone: "+1-555-0123",
      email: "info@downtownshelter.org",
      website: "www.downtownshelter.org",
      hours: "Mon-Fri: 9AM-6PM, Sat-Sun: 10AM-4PM",
      capacity: 150,
      currentAnimals: 87,
      specializations: ["Dogs", "Cats", "Small Animals"],
      services: ["Adoption", "Spay/Neuter", "Veterinary Care", "Training"],
      rating: 4.8,
      reviews: 234,
      verified: true,
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      name: "Northside Pet Rescue",
      type: "Non-Profit Rescue",
      address: "456 Oak Ave, Northside",
      phone: "+1-555-0124",
      email: "contact@northsiderescue.org",
      website: "www.northsiderescue.org",
      hours: "Tue-Sat: 10AM-5PM, Sun: 12PM-4PM",
      capacity: 75,
      currentAnimals: 42,
      specializations: ["Cats", "Exotic Animals"],
      services: ["Adoption", "Foster Care", "Medical Treatment"],
      rating: 4.9,
      reviews: 156,
      verified: true,
      image: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      name: "Southside Animal Haven",
      type: "Private Sanctuary",
      address: "789 Pine Rd, Southside",
      phone: "+1-555-0125",
      email: "help@animalhaven.org",
      website: "www.animalhaven.org",
      hours: "Wed-Sun: 11AM-5PM",
      capacity: 200,
      currentAnimals: 163,
      specializations: ["Large Dogs", "Senior Animals", "Special Needs"],
      services: ["Adoption", "Rehabilitation", "Behavioral Training"],
      rating: 4.7,
      reviews: 189,
      verified: true,
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=200&fit=crop"
    }
  ];

  // Volunteer opportunities
  const volunteerOpportunities = [
    {
      id: 1,
      title: "Dog Walker",
      description: "Help exercise our dogs with daily walks and playtime",
      timeCommitment: "2-4 hours/week",
      requirements: ["Must be 16+", "Comfortable with dogs", "Reliable schedule"],
      location: "Downtown Animal Shelter",
      urgency: "High",
      volunteersNeeded: 8,
      currentVolunteers: 3
    },
    {
      id: 2,
      title: "Cat Socializer",
      description: "Spend time with cats to help them become more adoptable",
      timeCommitment: "3-5 hours/week",
      requirements: ["Patient with animals", "Gentle handling", "Consistent availability"],
      location: "Northside Pet Rescue",
      urgency: "Medium",
      volunteersNeeded: 5,
      currentVolunteers: 4
    },
    {
      id: 3,
      title: "Foster Parent",
      description: "Provide temporary homes for animals in need",
      timeCommitment: "24/7 for 2-8 weeks",
      requirements: ["Own/rent pet-friendly home", "Experience preferred", "Financial stability"],
      location: "All Locations",
      urgency: "High",
      volunteersNeeded: 15,
      currentVolunteers: 7
    },
    {
      id: 4,
      title: "Transportation Helper",
      description: "Help transport animals to vet appointments and adoption events",
      timeCommitment: "4-8 hours/month",
      requirements: ["Valid driver's license", "Reliable vehicle", "Background check"],
      location: "All Locations",
      urgency: "Medium",
      volunteersNeeded: 6,
      currentVolunteers: 2
    }
  ];

  const stats = [
    { label: "Animals Rescued", value: "1,250+", icon: Heart, color: "text-red-600" },
    { label: "Successful Adoptions", value: "890+", icon: Home, color: "text-green-600" },
    { label: "Active Volunteers", value: "120+", icon: User, color: "text-blue-600" },
    { label: "Partner Shelters", value: "25+", icon: Shield, color: "text-purple-600" }
  ];

  const handleAdoptionInquiry = (animalId) => {
    console.log('Adoption inquiry for animal:', animalId);
    // In a real app, this would open adoption form or contact modal
  };

  const handleVolunteerSignup = (opportunityId) => {
    console.log('Volunteer signup for:', opportunityId);
    // In a real app, this would open volunteer registration form
  };

  const handleFavorite = (animalId) => {
    setFavoriteAnimals(prev => 
      prev.includes(animalId) 
        ? prev.filter(id => id !== animalId)
        : [...prev, animalId]
    );
  };

  const handleEmergencyReport = () => {
    // In a real app, this would open emergency animal report form
    alert('Emergency animal report form would open here. Please call local authorities for immediate emergencies.');
  };

  const filteredAnimals = adoptionAnimals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         animal.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedAnimalType === 'all' || animal.type === selectedAnimalType;
    const matchesLocation = selectedLocation === 'all' || animal.location.includes(selectedLocation);
    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Animal Welfare & Rescue
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Saving lives, finding homes, and building a compassionate community for all animals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setActiveTab('adoption')}
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Adopt a Pet
              </button>
              <button 
                onClick={() => setActiveTab('volunteer')}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
              >
                Volunteer with Us
              </button>
              <button 
                onClick={handleEmergencyReport}
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Report Emergency
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
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'adoption', label: 'Adopt a Pet', icon: Heart },
              { id: 'rescue', label: 'Rescue Stories', icon: Shield },
              { id: 'shelters', label: 'Shelters', icon: Home },
              { id: 'volunteer', label: 'Volunteer', icon: User },
              { id: 'donate', label: 'Donate', icon: DollarSign }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600 dark:text-green-400'
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
        {/* Adoption Tab */}
        {activeTab === 'adoption' && (
          <div>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-0">
                Animals Looking for Homes
              </h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by name or breed..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <select
                  value={selectedAnimalType}
                  onChange={(e) => setSelectedAnimalType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Animals</option>
                  <option value="Dog">Dogs</option>
                  <option value="Cat">Cats</option>
                  <option value="Bird">Birds</option>
                  <option value="Rabbit">Rabbits</option>
                </select>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Locations</option>
                  <option value="Downtown">Downtown</option>
                  <option value="Northside">Northside</option>
                  <option value="Southside">Southside</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAnimals.map((animal, index) => (
                <motion.div
                  key={animal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative">
                    <img 
                      src={animal.image} 
                      alt={animal.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        animal.urgency === 'high' ? 'bg-red-100 text-red-600' :
                        animal.urgency === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {animal.urgency === 'high' ? 'Urgent' : 
                         animal.urgency === 'medium' ? 'Available' : 'New'}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => handleFavorite(animal.id)}
                        className={`p-2 rounded-full transition-colors ${
                          favoriteAnimals.includes(animal.id)
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favoriteAnimals.includes(animal.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{animal.name}</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{animal.age}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{animal.breed} • {animal.gender}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <MapPin className="w-3 h-3 mr-1" />
                        {animal.location}
                      </div>
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Adoption Fee: ${animal.adoptionFee}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {animal.vaccinated && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-full">
                          Vaccinated
                        </span>
                      )}
                      {animal.spayed && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                          Spayed/Neutered
                        </span>
                      )}
                      {animal.goodWithKids && (
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded-full">
                          Good with Kids
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {animal.description}
                    </p>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAdoptionInquiry(animal.id)}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Adopt Me
                      </button>
                      <button className="flex-1 border border-green-600 text-green-600 dark:text-green-400 py-2 px-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-sm">
                        Learn More
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Rescue Stories Tab */}
        {activeTab === 'rescue' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Rescue Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rescueStories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <img 
                    src={story.image} 
                    alt={story.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{story.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        story.status === 'Success' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {story.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{story.story}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Heart className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">Animal: {story.animal}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">Volunteer: {story.volunteer}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {new Date(story.rescueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Donations: ${story.donationsReceived}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">
                        Read Full Story
                      </button>
                      <button className="flex-1 border border-green-600 text-green-600 dark:text-green-400 py-2 px-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-sm">
                        Share Story
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Shelters Tab */}
        {activeTab === 'shelters' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Partner Shelters & Organizations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {shelters.map((shelter, index) => (
                <motion.div
                  key={shelter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <img 
                    src={shelter.image} 
                    alt={shelter.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{shelter.name}</h3>
                          {shelter.verified && (
                            <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{shelter.type}</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{shelter.rating}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">{shelter.address}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">{shelter.phone}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">{shelter.hours}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Capacity</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {shelter.currentAnimals}/{shelter.capacity}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(shelter.currentAnimals / shelter.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Specializations:</h4>
                      <div className="flex flex-wrap gap-1">
                        {shelter.specializations.map((spec, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-full"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">
                        Visit Shelter
                      </button>
                      <button className="flex-1 border border-green-600 text-green-600 dark:text-green-400 py-2 px-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-sm">
                        Contact
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Volunteer Tab */}
        {activeTab === 'volunteer' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Volunteer Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {volunteerOpportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{opportunity.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        opportunity.urgency === 'High' ? 'bg-red-100 text-red-600' :
                        opportunity.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {opportunity.urgency} Priority
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{opportunity.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">Time Commitment: {opportunity.timeCommitment}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">Location: {opportunity.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Volunteers: {opportunity.currentVolunteers}/{opportunity.volunteersNeeded}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Requirements:</h4>
                    <ul className="space-y-1">
                      {opportunity.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Volunteers Needed</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {opportunity.currentVolunteers}/{opportunity.volunteersNeeded}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(opportunity.currentVolunteers / opportunity.volunteersNeeded) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleVolunteerSignup(opportunity.id)}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Sign Up to Volunteer
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Donate Tab */}
        {activeTab === 'donate' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Support Our Mission</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Donation Options */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Make a Donation</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[25, 50, 100, 250].map(amount => (
                    <button 
                      key={amount}
                      className="border-2 border-green-600 text-green-600 py-3 px-4 rounded-lg hover:bg-green-600 hover:text-white transition-colors font-semibold"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Custom Amount
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Donation Type
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500">
                    <option>General Support</option>
                    <option>Medical Care</option>
                    <option>Food & Supplies</option>
                    <option>Shelter Maintenance</option>
                    <option>Emergency Rescues</option>
                  </select>
                </div>
                
                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                  Donate Now
                </button>
              </div>

              {/* Impact Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Your Impact</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-4">
                      <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">$25</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Provides food for one animal for a week</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                      <Stethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">$75</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Covers basic veterinary care</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
                      <Home className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">$150</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Provides shelter for one month</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mr-4">
                      <Heart className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">$500</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Sponsors a complete rescue operation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Ways to Help */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Other Ways to Help</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Donate Supplies</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Food, toys, blankets, and medical supplies</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Volunteer Time</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Help with daily care and operations</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Share2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Spread the Word</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Share our mission on social media</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimalWelfare;
