import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Award,
  Download,
  Share2,
  Shield,
  ExternalLink,
  Search,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  Zap,
  QrCode,
  Copy,
  Globe,
  Calendar,
  BarChart3,
  Trophy,
  Users,
  Target
} from 'lucide-react';
import certificateService from '../../services/certificateService';
import PerformanceTracker from '../../components/PerformanceTracker';
import { setCertificates, setBlockchainConnected } from '../../store/slices/volunteeringSlice';

const Certificates = () => {
  const dispatch = useDispatch();
  const { certificates, blockchainConnected } = useSelector(state => state.volunteering);
  const { user } = useSelector(state => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Mock volunteer activity data for demo
  const mockVolunteerActivity = {
    id: 'vol_001',
    volunteerId: user?.id || 'user_001',
    volunteerName: user?.name || 'John Doe',
    type: 'Environmental Conservation',
    organizationName: 'Green Earth Initiative',
    hoursLogged: 45,
    tasksCompleted: 12,
    feedbackScores: [8.5, 9.0, 8.7, 9.2, 8.8],
    attendanceRate: 0.95,
    onTimeRate: 0.92,
    leadershipRoles: 2,
    initiativesTaken: 3,
    impactMeasures: {
      treesPlanted: 50,
      wasteCollected: 25,
      volunteersRecruited: 3
    }
  };

  useEffect(() => {
    initializePage();
  }, []);

  const initializePage = async () => {
    setIsLoading(true);
    
    // Initialize blockchain
    const connected = await certificateService.initializeBlockchain();
    dispatch(setBlockchainConnected(connected));
    
    // Load existing certificates
    if (user?.id) {
      const result = await certificateService.getUserCertificates(user.id);
      if (result.success) {
        dispatch(setCertificates(result.certificates));
      }
    }
    
    setIsLoading(false);
  };

  const handleVerifyCertificate = async (certificateId) => {
    setIsVerifying(true);
    try {
      const result = await certificateService.verifyCertificate(certificateId);
      setVerificationResult(result);
    } catch (error) {
      console.error('Verification failed:', error);
      setVerificationResult({ success: false, error: error.message });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownloadCertificate = async (certificateId) => {
    try {
      await certificateService.downloadCertificate(certificateId, 'pdf');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const handleShareCertificate = async (certificateId, platform) => {
    try {
      await certificateService.shareCertificate(certificateId, platform);
    } catch (error) {
      console.error('Sharing failed:', error);
      alert('Sharing failed. Please try again.');
    }
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.activityType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.organizationName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || cert.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'issued': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Blockchain Certificates</h1>
            <div className="flex items-center space-x-2">
              <Shield className={`w-5 h-5 ${blockchainConnected ? 'text-green-600' : 'text-gray-400'}`} />
              <span className={`text-sm font-medium ${blockchainConnected ? 'text-green-600' : 'text-gray-500'}`}>
                {blockchainConnected ? 'Blockchain Connected' : 'Demo Mode'}
              </span>
            </div>
          </div>
          <p className="text-gray-600">
            Earn verified, blockchain-secured certificates for your volunteer contributions. 
            These certificates are tamper-proof and globally verifiable.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search certificates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="issued">Issued</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Performance Tracker */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Performance & Eligibility</h2>
              <PerformanceTracker volunteerActivity={mockVolunteerActivity} />
            </div>

            {/* Certificates List */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Your Certificates</h2>
              
              {filteredCertificates.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Certificates Yet</h3>
                  <p className="text-gray-600 mb-6">
                    Complete volunteer activities and meet performance requirements to earn your first blockchain certificate.
                  </p>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Start Volunteering
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCertificates.map((certificate, index) => (
                    <div key={index} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 rounded-full p-2">
                              <Award className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {certificate.activityType} Certificate
                              </h3>
                              <p className="text-sm text-gray-600">
                                {certificate.organizationName}
                              </p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(certificate.status)}`}>
                            {certificate.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{certificate.hoursCompleted}</div>
                            <div className="text-xs text-gray-500">Hours</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-2xl font-bold ${getPerformanceColor(certificate.performanceScore)}`}>
                              {certificate.performanceScore}%
                            </div>
                            <div className="text-xs text-gray-500">Score</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-900">
                              {certificate.dateIssued ? new Date(certificate.dateIssued).toLocaleDateString() : 'Pending'}
                            </div>
                            <div className="text-xs text-gray-500">Issued</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center">
                              {certificate.blockchainHash ? (
                                <Shield className="w-5 h-5 text-green-600" />
                              ) : (
                                <Clock className="w-5 h-5 text-yellow-600" />
                              )}
                            </div>
                            <div className="text-xs text-gray-500">Blockchain</div>
                          </div>
                        </div>

                        {certificate.blockchainHash && (
                          <div className="bg-gray-50 rounded p-3 mb-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Blockchain Hash:</span>
                              <button
                                onClick={() => navigator.clipboard.writeText(certificate.blockchainHash)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="text-xs text-gray-800 font-mono break-all">
                              {certificate.blockchainHash}
                            </div>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDownloadCertificate(certificate.id)}
                            className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </button>
                          
                          <button
                            onClick={() => handleShareCertificate(certificate.id, 'linkedin')}
                            className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                          </button>
                          
                          <button
                            onClick={() => handleVerifyCertificate(certificate.id)}
                            disabled={isVerifying}
                            className="flex items-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm disabled:opacity-50"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Verify</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Impact</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm text-gray-600">Certificates Earned</span>
                  </div>
                  <span className="font-semibold text-gray-900">{certificates.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-600">Total Hours</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {certificates.reduce((sum, cert) => sum + (cert.hoursCompleted || 0), 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-600">Avg. Performance</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {certificates.length > 0 ? 
                      Math.round(certificates.reduce((sum, cert) => sum + (cert.performanceScore || 0), 0) / certificates.length) + '%' : 
                      'N/A'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Verification Card */}
            {verificationResult && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Result</h3>
                <div className={`p-4 rounded-lg ${verificationResult.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {verificationResult.isValid ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <ExternalLink className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-medium ${verificationResult.isValid ? 'text-green-800' : 'text-red-800'}`}>
                      {verificationResult.isValid ? 'Valid Certificate' : 'Invalid Certificate'}
                    </span>
                  </div>
                  <p className={`text-sm ${verificationResult.isValid ? 'text-green-700' : 'text-red-700'}`}>
                    {verificationResult.isValid 
                      ? 'This certificate is verified on the blockchain and authentic.'
                      : 'This certificate could not be verified or does not exist.'
                    }
                  </p>
                </div>
              </div>
            )}

            {/* How It Works */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How Blockchain Certificates Work</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-full p-1 mt-1">
                    <Users className="w-3 h-3 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Complete Volunteer Work</div>
                    <div className="text-xs text-gray-600">Participate in activities and meet performance requirements</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 rounded-full p-1 mt-1">
                    <BarChart3 className="w-3 h-3 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Performance Evaluation</div>
                    <div className="text-xs text-gray-600">Your work is assessed based on multiple criteria</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 rounded-full p-1 mt-1">
                    <Shield className="w-3 h-3 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Blockchain Verification</div>
                    <div className="text-xs text-gray-600">Certificate is issued and secured on blockchain</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-yellow-100 rounded-full p-1 mt-1">
                    <Globe className="w-3 h-3 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Global Recognition</div>
                    <div className="text-xs text-gray-600">Share and verify anywhere in the world</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificates;
