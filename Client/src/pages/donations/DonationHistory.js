import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Calendar, 
  DollarSign, 
  Download, 
  Eye, 
  RefreshCw,
  TrendingUp,
  Award,
  Filter,
  Search,
  ChevronDown,
  FileText,
  Share2,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  MoreHorizontal,
  Star,
  Gift,
  ArrowUpRight
} from 'lucide-react';
import paymentGatewayService from '../../services/paymentGatewayService';

const DonationHistory = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, completed, pending, failed
  const [sortBy, setSortBy] = useState('date'); // date, amount, type
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [stats, setStats] = useState({
    totalDonated: 0,
    totalDonations: 0,
    favoriteCategory: '',
    impactScore: 0
  });

  // Load donation history
  useEffect(() => {
    const loadDonationHistory = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const history = await paymentGatewayService.getDonationHistory(user.id);
        setDonations(history);
        calculateStats(history);
      } catch (error) {
        console.error('Error loading donation history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDonationHistory();
  }, [user]);

  // Calculate stats
  const calculateStats = (donationData) => {
    const completedDonations = donationData.filter(d => d.status === 'completed');
    const totalAmount = completedDonations.reduce((sum, d) => sum + d.amount, 0);
    
    // Find favorite category
    const categoryCount = {};
    completedDonations.forEach(d => {
      categoryCount[d.donationType] = (categoryCount[d.donationType] || 0) + 1;
    });
    const favoriteCategory = Object.keys(categoryCount).reduce((a, b) => 
      categoryCount[a] > categoryCount[b] ? a : b, ''
    );

    setStats({
      totalDonated: totalAmount,
      totalDonations: completedDonations.length,
      favoriteCategory: favoriteCategory || 'None yet',
      impactScore: Math.min(Math.floor(totalAmount / 10), 100) // Simple impact score
    });
  };

  // Filter and sort donations
  const filteredDonations = donations
    .filter(donation => {
      if (filter !== 'all' && donation.status !== filter) return false;
      if (searchTerm && !donation.donationType.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'type':
          return a.donationType.localeCompare(b.donationType);
        case 'date':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <MoreHorizontal className="h-4 w-4" />;
    }
  };

  // Get donation type info
  const getDonationTypeInfo = (type) => {
    const typeMap = {
      'animal-welfare': { icon: '🐾', name: 'Animal Welfare' },
      'blood-donation': { icon: '❤️', name: 'Blood Donation' },
      'environment': { icon: '🌱', name: 'Environment' },
      'elderly-care': { icon: '👴', name: 'Elderly Care' },
      'mental-health': { icon: '🧠', name: 'Mental Health' }
    };
    return typeMap[type] || { icon: '❤️', name: type };
  };

  // Download receipt
  const downloadReceipt = async (donationId) => {
    try {
      const receipt = await paymentGatewayService.getDonationReceipt(donationId);
      // Create and download receipt PDF
      const blob = new Blob([receipt.pdfData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `donation-receipt-${donationId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading receipt:', error);
    }
  };

  // Generate tax receipt
  const generateTaxReceipt = async (donationId) => {
    try {
      const taxReceipt = await paymentGatewayService.generateTaxReceipt(donationId);
      // Handle tax receipt download
      console.log('Tax receipt generated:', taxReceipt);
    } catch (error) {
      console.error('Error generating tax receipt:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Please Log In
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be logged in to view your donation history
          </p>
          <button
            onClick={() => navigate('/auth/login')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Donations
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your contributions and impact
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Donated
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{stats.totalDonated.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Donations
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalDonations}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Favorite Cause
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {stats.favoriteCategory}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Impact Score
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.impactScore}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search donations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 
                         rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="type">Sort by Type</option>
              </select>

              <button
                onClick={() => navigate('/donations/new')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg 
                         flex items-center space-x-2"
              >
                <Heart className="h-5 w-5" />
                <span>Donate Now</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {['all', 'completed', 'pending', 'failed'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filter === status
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Donations List */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading your donations...</p>
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No donations found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start making a difference today with your first donation'
              }
            </p>
            <button
              onClick={() => navigate('/donations/new')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg"
            >
              Make Your First Donation
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDonations.map(donation => {
              const typeInfo = getDonationTypeInfo(donation.donationType);
              return (
                <div key={donation.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{typeInfo.icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {typeInfo.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(donation.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          ₹{donation.amount}
                        </p>
                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                          {getStatusIcon(donation.status)}
                          <span className="capitalize">{donation.status}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => downloadReceipt(donation.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                          title="Download Receipt"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                        
                        <button
                          onClick={() => setSelectedDonation(donation)}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>

                        {donation.status === 'completed' && (
                          <button
                            onClick={() => generateTaxReceipt(donation.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Generate Tax Receipt"
                          >
                            <FileText className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {donation.message && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                        "{donation.message}"
                      </p>
                    </div>
                  )}

                  {donation.isRecurring && (
                    <div className="mt-4 flex items-center space-x-2 text-sm text-purple-600 dark:text-purple-400">
                      <RefreshCw className="h-4 w-4" />
                      <span>Recurring {donation.frequency}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Call to Action */}
        {donations.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">
              Continue Making a Difference
            </h2>
            <p className="text-purple-100 mb-6">
              Your generosity has already made an impact. Join us in creating even more positive change.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => navigate('/donations/new')}
                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg 
                         flex items-center justify-center space-x-2"
              >
                <Gift className="h-5 w-5" />
                <span>Donate Again</span>
              </button>
              <button
                onClick={() => navigate('/volunteering')}
                className="border border-white text-white hover:bg-white hover:text-purple-600 
                         font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2"
              >
                <ArrowUpRight className="h-5 w-5" />
                <span>Volunteer</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Donation Details Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Donation Details
                </h2>
                <button
                  onClick={() => setSelectedDonation(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                      Amount
                    </label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      ₹{selectedDonation.amount}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                      Status
                    </label>
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedDonation.status)}`}>
                      {getStatusIcon(selectedDonation.status)}
                      <span className="capitalize">{selectedDonation.status}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Transaction ID
                  </label>
                  <p className="font-mono text-sm text-gray-900 dark:text-white">
                    {selectedDonation.transactionId}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Payment Method
                  </label>
                  <p className="text-gray-900 dark:text-white capitalize">
                    {selectedDonation.provider}
                  </p>
                </div>

                {selectedDonation.message && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                      Message
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedDonation.message}
                    </p>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => downloadReceipt(selectedDonation.id)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold 
                             py-2 px-4 rounded-lg flex items-center justify-center space-x-2"
                  >
                    <Download className="h-5 w-5" />
                    <span>Download Receipt</span>
                  </button>
                  <button
                    onClick={() => {/* Share functionality */}}
                    className="flex-1 border border-purple-600 text-purple-600 hover:bg-purple-50 
                             dark:hover:bg-purple-900/20 font-semibold py-2 px-4 rounded-lg 
                             flex items-center justify-center space-x-2"
                  >
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationHistory;
