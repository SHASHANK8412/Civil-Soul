import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  Heart,
  Star,
  Award,
  Search,
  Filter,
  ChevronRight,
  TrendingUp,
  Target,
  Zap,
  Shield,
  ArrowRight
} from 'lucide-react';
import { setOpportunities, setLoading, setFilters } from '../../store/slices/volunteeringSlice';

const Volunteering = () => {
  const dispatch = useDispatch();
  const { opportunities, filters, isLoading, blockchainConnected } = useSelector(state => state.volunteering);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Mock opportunities data
  const mockOpportunities = [
    {
      id: 1,
      title: 'Beach Cleanup Drive',
      organization: 'Ocean Conservation Society',
      category: 'Environment',
      location: 'Santa Monica Beach, CA',
      date: '2025-08-15',
      duration: '4 hours',
      volunteers: 25,
      maxVolunteers: 50,
      description: 'Join us for a community beach cleanup to protect marine life and keep our beaches pristine.',
      requirements: ['Physical fitness', 'Bring water bottle', 'Sun protection'],
      impact: 'Last cleanup collected 500lbs of trash',
      certificate: true,
      blockchainVerified: true,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
    },
    {
      id: 2,
      title: 'Food Bank Volunteer',
      organization: 'City Food Bank',
      category: 'Community Service',
      location: 'Downtown LA, CA',
      date: '2025-08-20',
      duration: '6 hours',
      volunteers: 15,
      maxVolunteers: 30,
      description: 'Help sort, pack, and distribute food to families in need in our community.',
      requirements: ['Food safety training', 'Comfortable shoes'],
      impact: 'Serves 200+ families weekly',
      certificate: true,
      blockchainVerified: true,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400'
    },
    {
      id: 3,
      title: 'Animal Shelter Assistant',
      organization: 'Happy Paws Rescue',
      category: 'Animal Welfare',
      location: 'Beverly Hills, CA',
      date: '2025-08-25',
      duration: '3 hours',
      volunteers: 8,
      maxVolunteers: 15,
      description: 'Care for rescued animals, help with feeding, cleaning, and socialization.',
      requirements: ['Love for animals', 'Allergy considerations'],
      impact: '500+ animals rescued this year',
      certificate: true,
      blockchainVerified: true,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400'
    },
    {
      id: 4,
      title: 'Senior Center Activities',
      organization: 'Golden Years Community',
      category: 'Elderly Care',
      location: 'Pasadena, CA',
      date: '2025-08-30',
      duration: '5 hours',
      volunteers: 12,
      maxVolunteers: 20,
      description: 'Organize activities, provide companionship, and assist with daily programs for seniors.',
      requirements: ['Patience', 'Communication skills', 'Background check'],
      impact: 'Serves 150+ seniors daily',
      certificate: true,
      blockchainVerified: true,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400'
    },
    {
      id: 5,
      title: 'Youth Mentorship Program',
      organization: 'Bright Futures Foundation',
      category: 'Education',
      location: 'Long Beach, CA',
      date: '2025-09-05',
      duration: '8 hours',
      volunteers: 6,
      maxVolunteers: 12,
      description: 'Mentor at-risk youth through educational activities and life skills workshops.',
      requirements: ['Background check', 'Mentoring experience preferred'],
      impact: '90% of participants improve grades',
      certificate: true,
      blockchainVerified: true,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400'
    },
    {
      id: 6,
      title: 'Community Garden Project',
      organization: 'Green City Initiative',
      category: 'Environment',
      location: 'Venice, CA',
      date: '2025-09-10',
      duration: '6 hours',
      volunteers: 20,
      maxVolunteers: 40,
      description: 'Help build and maintain community gardens to provide fresh produce for local families.',
      requirements: ['Gardening tools provided', 'Work clothes'],
      impact: 'Provides fresh food for 100+ families',
      certificate: true,
      blockchainVerified: true,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'
    }
  ];

  const categories = [
    'All Categories',
    'Environment',
    'Community Service',
    'Animal Welfare',
    'Elderly Care',
    'Education',
    'Mental Health',
    'Disaster Relief'
  ];

  useEffect(() => {
    // Simulate loading opportunities
    dispatch(setLoading(true));
    setTimeout(() => {
      dispatch(setOpportunities(mockOpportunities));
      dispatch(setLoading(false));
    }, 1000);
  }, [dispatch]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    dispatch(setFilters({ search: term }));
  };

  const handleCategoryFilter = (category) => {
    const filterValue = category === 'All Categories' ? '' : category;
    setSelectedCategory(filterValue);
    dispatch(setFilters({ category: filterValue }));
  };

  const filteredOpportunities = mockOpportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || opp.category === selectedCategory;
    const matchesLocation = !selectedLocation || opp.location.toLowerCase().includes(selectedLocation.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const getVacancyColor = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage < 50) return 'text-green-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Volunteer Opportunities</h1>
            <div className="flex items-center space-x-2">
              <Shield className={`w-5 h-5 ${blockchainConnected ? 'text-green-600' : 'text-gray-400'}`} />
              <span className={`text-sm font-medium ${blockchainConnected ? 'text-green-600' : 'text-gray-500'}`}>
                {blockchainConnected ? 'Blockchain Certificates Available' : 'Demo Mode'}
              </span>
            </div>
          </div>
          <p className="text-gray-600">
            Make a difference in your community and earn blockchain-verified certificates for your contributions.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category === 'All Categories' ? '' : category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Location Filter */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Filter by location..."
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{filteredOpportunities.length}</div>
              <div className="text-sm opacity-90">Active Opportunities</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {filteredOpportunities.reduce((sum, opp) => sum + opp.volunteers, 0)}
              </div>
              <div className="text-sm opacity-90">Volunteers Registered</div>
            </div>
            <div>
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm opacity-90">Blockchain Verified</div>
            </div>
            <div>
              <div className="text-2xl font-bold">4.8★</div>
              <div className="text-sm opacity-90">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Opportunities Grid */}
        <div className="grid gap-6">
          {filteredOpportunities.map((opportunity) => (
            <div key={opportunity.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
              <div className="md:flex">
                {/* Image */}
                <div className="md:w-1/4">
                  <img
                    src={opportunity.image}
                    alt={opportunity.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="md:w-3/4 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {opportunity.category}
                        </span>
                        {opportunity.blockchainVerified && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                            <Shield className="w-3 h-3 mr-1" />
                            Blockchain Verified
                          </span>
                        )}
                        {opportunity.certificate && (
                          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                            <Award className="w-3 h-3 mr-1" />
                            Certificate Available
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{opportunity.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{opportunity.organization}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {opportunity.location}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(opportunity.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {opportunity.duration}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{opportunity.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className={`text-sm font-medium ${getVacancyColor(opportunity.volunteers, opportunity.maxVolunteers)}`}>
                              {opportunity.volunteers}/{opportunity.maxVolunteers} volunteers
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{opportunity.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Link
                            to={`/volunteering/${opportunity.id}`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
                          >
                            Learn More
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Link>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Impact & Requirements */}
                  <div className="border-t pt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Impact</h4>
                        <p className="text-sm text-gray-600">{opportunity.impact}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Requirements</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {opportunity.requirements.map((req, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredOpportunities.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Opportunities Found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or check back later for new opportunities.
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedLocation('');
                handleSearch('');
                handleCategoryFilter('All Categories');
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg text-white p-8 mt-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of volunteers earning blockchain-verified certificates while creating positive impact in communities worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                Start Volunteering
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/certificates"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                View Certificates
                <Award className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volunteering;
