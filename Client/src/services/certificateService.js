import api from './api';
import blockchainService from './blockchainService';

class CertificateService {
  constructor() {
    this.baseURL = '/api/certificates';
  }

  // Initialize blockchain connection
  async initializeBlockchain() {
    return await blockchainService.initializeBlockchain();
  }

  // Generate certificate based on volunteer performance
  async generateCertificate(volunteerData) {
    try {
      const {
        volunteerId,
        activityId,
        activityType,
        organizationName,
        volunteerName,
        performanceData
      } = volunteerData;

      // First, save certificate data to traditional database
      const certificateData = {
        volunteerId,
        activityId,
        activityType,
        organizationName,
        volunteerName,
        hoursCompleted: performanceData.hoursCompleted,
        performanceMetrics: performanceData,
        status: 'pending',
        dateRequested: new Date().toISOString()
      };

      // Save to database
      const dbResponse = await api.post(`${this.baseURL}/generate`, certificateData);
      
      if (!dbResponse.data.success) {
        throw new Error('Failed to save certificate data');
      }

      // Issue certificate on blockchain
      const blockchainResult = await blockchainService.issueCertificate({
        volunteerName,
        organizationName,
        activityType,
        hoursCompleted: performanceData.hoursCompleted,
        performanceMetrics: performanceData,
        recipientAddress: performanceData.walletAddress
      });

      if (blockchainResult.success) {
        // Update database with blockchain info
        await api.patch(`${this.baseURL}/${dbResponse.data.certificate.id}`, {
          status: 'issued',
          blockchainHash: blockchainResult.certificate.blockchainHash,
          certificateId: blockchainResult.certificate.id,
          performanceScore: blockchainResult.certificate.performanceScore,
          dateIssued: new Date(blockchainResult.certificate.dateIssued).toISOString()
        });

        return {
          success: true,
          certificate: {
            ...dbResponse.data.certificate,
            ...blockchainResult.certificate,
            blockchainHash: blockchainResult.certificate.blockchainHash
          },
          message: 'Certificate generated and issued on blockchain successfully!'
        };
      } else {
        // Update status to failed
        await api.patch(`${this.baseURL}/${dbResponse.data.certificate.id}`, {
          status: 'failed',
          error: blockchainResult.error
        });

        return {
          success: false,
          error: blockchainResult.error,
          message: 'Certificate generation failed'
        };
      }
    } catch (error) {
      console.error('Certificate generation error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to generate certificate'
      };
    }
  }

  // Get user certificates
  async getUserCertificates(userId) {
    try {
      const response = await api.get(`${this.baseURL}/user/${userId}`);
      
      // Also get blockchain certificates
      const blockchainCerts = await blockchainService.getUserCertificates();
      
      return {
        success: true,
        certificates: response.data.certificates,
        blockchainCertificates: blockchainCerts.certificates
      };
    } catch (error) {
      console.error('Error fetching certificates:', error);
      return {
        success: false,
        error: error.message,
        certificates: []
      };
    }
  }

  // Verify certificate authenticity
  async verifyCertificate(certificateId) {
    try {
      // Verify on blockchain
      const blockchainVerification = await blockchainService.verifyCertificate(certificateId);
      
      // Also check database
      const dbResponse = await api.get(`${this.baseURL}/verify/${certificateId}`);
      
      return {
        success: true,
        isValid: blockchainVerification.isValid && dbResponse.data.isValid,
        certificate: blockchainVerification.certificate,
        verification: {
          blockchain: blockchainVerification.isValid,
          database: dbResponse.data.isValid,
          metadata: dbResponse.data.certificate
        }
      };
    } catch (error) {
      console.error('Certificate verification error:', error);
      return {
        success: false,
        error: error.message,
        isValid: false
      };
    }
  }

  // Calculate performance metrics for certificate eligibility
  calculatePerformanceMetrics(volunteerActivity) {
    const {
      hoursLogged = 0,
      tasksCompleted = 0,
      feedbackScores = [],
      attendanceRate = 0,
      onTimeRate = 0,
      leadershipRoles = 0,
      initiativesTaken = 0,
      impactMeasures = {}
    } = volunteerActivity;

    // Calculate individual metrics (1-10 scale)
    const taskQuality = feedbackScores.length > 0 
      ? feedbackScores.reduce((sum, score) => sum + score, 0) / feedbackScores.length 
      : 5;

    const punctuality = Math.min(onTimeRate * 10, 10);
    const teamwork = Math.min((attendanceRate + (leadershipRoles * 2)) * 2, 10);
    const initiative = Math.min(initiativesTaken * 2, 10);
    const feedback = Math.min(taskQuality, 10);

    return {
      hoursCompleted: hoursLogged,
      taskQuality,
      punctuality,
      teamwork,
      initiative,
      feedback,
      tasksCompleted,
      attendanceRate,
      leadershipRoles,
      impactMeasures
    };
  }

  // Check if volunteer is eligible for certificate
  isEligibleForCertificate(performanceMetrics) {
    const {
      hoursCompleted,
      taskQuality,
      punctuality,
      teamwork
    } = performanceMetrics;

    // Minimum requirements
    const minHours = 20;
    const minQuality = 6;
    const minPunctuality = 7;
    const minTeamwork = 6;

    return {
      eligible: hoursCompleted >= minHours && 
                taskQuality >= minQuality && 
                punctuality >= minPunctuality && 
                teamwork >= minTeamwork,
      requirements: {
        hoursCompleted: { required: minHours, current: hoursCompleted, met: hoursCompleted >= minHours },
        taskQuality: { required: minQuality, current: taskQuality, met: taskQuality >= minQuality },
        punctuality: { required: minPunctuality, current: punctuality, met: punctuality >= minPunctuality },
        teamwork: { required: minTeamwork, current: teamwork, met: teamwork >= minTeamwork }
      }
    };
  }

  // Get certificate template
  async getCertificateTemplate(type) {
    try {
      const response = await api.get(`${this.baseURL}/template/${type}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching certificate template:', error);
      return null;
    }
  }

  // Download certificate
  async downloadCertificate(certificateId, format = 'pdf') {
    try {
      const response = await api.get(`${this.baseURL}/${certificateId}/download`, {
        params: { format },
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certificateId}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Certificate download error:', error);
      return { success: false, error: error.message };
    }
  }

  // Share certificate
  async shareCertificate(certificateId, platform) {
    try {
      const certificate = await this.verifyCertificate(certificateId);
      
      if (!certificate.isValid) {
        throw new Error('Cannot share invalid certificate');
      }

      const shareData = {
        title: `${certificate.certificate.activityType} Volunteer Certificate`,
        text: `I earned a blockchain-verified volunteer certificate from ${certificate.certificate.organizationName}!`,
        url: `https://civilsoul.org/certificates/verify/${certificateId}`
      };

      switch (platform) {
        case 'native':
          if (navigator.share) {
            await navigator.share(shareData);
          } else {
            throw new Error('Native sharing not supported');
          }
          break;
        
        case 'linkedin':
          const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`;
          window.open(linkedinUrl, '_blank');
          break;
        
        case 'twitter':
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
          window.open(twitterUrl, '_blank');
          break;
        
        default:
          // Copy to clipboard
          await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Certificate sharing error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new CertificateService();
