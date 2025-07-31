import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Clock,
  Award,
  TrendingUp,
  Star,
  CheckCircle,
  Users,
  Target,
  Zap,
  Download,
  Share2,
  Shield,
  ExternalLink,
  Calendar,
  BarChart3
} from 'lucide-react';
import certificateService from '../services/certificateService';
import { addCertificate, setPerformanceTracking, setBlockchainConnected } from '../store/slices/volunteeringSlice';

const PerformanceTracker = ({ volunteerActivity }) => {
  const dispatch = useDispatch();
  const { performanceTracking, certificates, blockchainConnected } = useSelector(state => state.volunteering);
  const [isGenerating, setIsGenerating] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [eligibility, setEligibility] = useState(null);

  useEffect(() => {
    // Initialize blockchain connection
    initializeBlockchain();
    
    // Calculate performance metrics
    if (volunteerActivity) {
      const metrics = certificateService.calculatePerformanceMetrics(volunteerActivity);
      setPerformanceMetrics(metrics);
      
      const eligibilityCheck = certificateService.isEligibleForCertificate(metrics);
      setEligibility(eligibilityCheck);
    }
  }, [volunteerActivity]);

  const initializeBlockchain = async () => {
    const connected = await certificateService.initializeBlockchain();
    dispatch(setBlockchainConnected(connected));
  };

  const handleGenerateCertificate = async () => {
    setIsGenerating(true);
    
    try {
      const result = await certificateService.generateCertificate({
        volunteerId: volunteerActivity.volunteerId,
        activityId: volunteerActivity.id,
        activityType: volunteerActivity.type,
        organizationName: volunteerActivity.organizationName,
        volunteerName: volunteerActivity.volunteerName,
        performanceData: performanceMetrics
      });

      if (result.success) {
        dispatch(addCertificate(result.certificate));
        alert('Certificate generated successfully and recorded on blockchain!');
      } else {
        alert(`Certificate generation failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Certificate generation error:', error);
      alert('An error occurred while generating the certificate.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getPerformanceGrade = (score) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 80) return { grade: 'A', color: 'text-green-500', bg: 'bg-green-50' };
    if (score >= 70) return { grade: 'B+', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 60) return { grade: 'B', color: 'text-blue-500', bg: 'bg-blue-50' };
    if (score >= 50) return { grade: 'C+', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { grade: 'C', color: 'text-orange-600', bg: 'bg-orange-100' };
  };

  if (!performanceMetrics) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const overallScore = certificateService.calculatePerformanceMetrics(volunteerActivity);
  const grade = getPerformanceGrade(overallScore.feedback * 10);

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Performance Overview</h3>
          <div className={`px-3 py-1 rounded-full ${grade.bg} ${grade.color} font-bold text-lg`}>
            {grade.grade}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{performanceMetrics.hoursCompleted}</div>
            <div className="text-sm text-gray-500">Hours Logged</div>
          </div>

          <div className="text-center">
            <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{performanceMetrics.tasksCompleted}</div>
            <div className="text-sm text-gray-500">Tasks Done</div>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{performanceMetrics.taskQuality.toFixed(1)}</div>
            <div className="text-sm text-gray-500">Quality Score</div>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{(performanceMetrics.attendanceRate * 100).toFixed(0)}%</div>
            <div className="text-sm text-gray-500">Attendance</div>
          </div>
        </div>

        {/* Performance Bars */}
        <div className="space-y-4">
          {[
            { label: 'Task Quality', value: performanceMetrics.taskQuality, max: 10, color: 'bg-blue-500' },
            { label: 'Punctuality', value: performanceMetrics.punctuality, max: 10, color: 'bg-green-500' },
            { label: 'Teamwork', value: performanceMetrics.teamwork, max: 10, color: 'bg-purple-500' },
            { label: 'Initiative', value: performanceMetrics.initiative, max: 10, color: 'bg-orange-500' }
          ].map((metric) => (
            <div key={metric.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{metric.label}</span>
                <span className="text-gray-900 font-medium">{metric.value.toFixed(1)}/{metric.max}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${metric.color}`}
                  style={{ width: `${(metric.value / metric.max) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Eligibility */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Certificate Eligibility</h3>
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm text-gray-600">
              {blockchainConnected ? 'Blockchain Ready' : 'Mock Mode'}
            </span>
          </div>
        </div>

        {eligibility && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${
              eligibility.eligible 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex items-center mb-2">
                {eligibility.eligible ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                ) : (
                  <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                )}
                <span className={`font-medium ${
                  eligibility.eligible ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {eligibility.eligible ? 'Eligible for Certificate!' : 'Progress Toward Certificate'}
                </span>
              </div>
              <p className={`text-sm ${
                eligibility.eligible ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {eligibility.eligible 
                  ? 'Congratulations! You meet all requirements for a blockchain certificate.'
                  : 'Complete the remaining requirements to earn your certificate.'
                }
              </p>
            </div>

            {/* Requirements Checklist */}
            <div className="space-y-2">
              {Object.entries(eligibility.requirements).map(([key, req]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    {req.met ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    ) : (
                      <Target className="w-5 h-5 text-gray-400 mr-3" />
                    )}
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <span className={`text-sm ${req.met ? 'text-green-600' : 'text-gray-500'}`}>
                    {req.current.toFixed(1)} / {req.required}
                  </span>
                </div>
              ))}
            </div>

            {/* Certificate Generation Button */}
            {eligibility.eligible && (
              <button
                onClick={handleGenerateCertificate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating Certificate...
                  </>
                ) : (
                  <>
                    <Award className="w-5 h-5 mr-2" />
                    Generate Blockchain Certificate
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Existing Certificates */}
      {certificates.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Certificates</h3>
          <div className="space-y-4">
            {certificates.map((cert, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{cert.activityType} Certificate</h4>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Verified
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Issued by {cert.organizationName} • Score: {cert.performanceScore}%
                </p>
                <div className="flex space-x-2">
                  <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </button>
                  <button className="flex items-center text-sm text-green-600 hover:text-green-800">
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </button>
                  <button className="flex items-center text-sm text-purple-600 hover:text-purple-800">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Verify
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceTracker;
