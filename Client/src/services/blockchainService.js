// Blockchain Certificate Service
import { ethers } from 'ethers';

class BlockchainService {
  constructor() {
    this.contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    this.contractABI = [
      {
        "inputs": [
          {"name": "recipient", "type": "address"},
          {"name": "certificateId", "type": "string"},
          {"name": "volunteerName", "type": "string"},
          {"name": "organizationName", "type": "string"},
          {"name": "activityType", "type": "string"},
          {"name": "hoursCompleted", "type": "uint256"},
          {"name": "performanceScore", "type": "uint256"},
          {"name": "dateIssued", "type": "uint256"}
        ],
        "name": "issueCertificate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [{"name": "certificateId", "type": "string"}],
        "name": "getCertificate",
        "outputs": [
          {"name": "volunteerName", "type": "string"},
          {"name": "organizationName", "type": "string"},
          {"name": "activityType", "type": "string"},
          {"name": "hoursCompleted", "type": "uint256"},
          {"name": "performanceScore", "type": "uint256"},
          {"name": "dateIssued", "type": "uint256"},
          {"name": "isValid", "type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"name": "certificateId", "type": "string"}],
        "name": "verifyCertificate",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
      }
    ];
    this.provider = null;
    this.signer = null;
    this.contract = null;
  }

  // Initialize connection to blockchain
  async initializeBlockchain() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.signer = await this.provider.getSigner();
        this.contract = new ethers.Contract(this.contractAddress, this.contractABI, this.signer);
        return true;
      } else {
        console.warn('MetaMask not detected. Using mock blockchain service.');
        return this.initializeMockBlockchain();
      }
    } catch (error) {
      console.error('Blockchain initialization failed:', error);
      return this.initializeMockBlockchain();
    }
  }

  // Mock blockchain for development/demo
  initializeMockBlockchain() {
    this.mockCertificates = new Map();
    this.isMockMode = true;
    return true;
  }

  // Generate certificate ID
  generateCertificateId(volunteerName, activityType, timestamp) {
    return `CERT-${volunteerName.replace(/\s+/g, '').toUpperCase()}-${activityType.replace(/\s+/g, '').toUpperCase()}-${timestamp}`;
  }

  // Calculate performance score based on various metrics
  calculatePerformanceScore(metrics) {
    const {
      hoursCompleted = 0,
      taskQuality = 0, // 1-10 scale
      punctuality = 0, // 1-10 scale
      teamwork = 0, // 1-10 scale
      initiative = 0, // 1-10 scale
      feedback = 0 // 1-10 scale
    } = metrics;

    // Weight different factors
    const weights = {
      hours: 0.3,
      quality: 0.25,
      punctuality: 0.15,
      teamwork: 0.15,
      initiative: 0.1,
      feedback: 0.05
    };

    // Normalize hours (assuming 100 hours = full score)
    const normalizedHours = Math.min(hoursCompleted / 100, 1) * 10;

    const score = (
      normalizedHours * weights.hours +
      taskQuality * weights.quality +
      punctuality * weights.punctuality +
      teamwork * weights.teamwork +
      initiative * weights.initiative +
      feedback * weights.feedback
    );

    return Math.round(score * 10); // Return as percentage (0-100)
  }

  // Issue a new certificate
  async issueCertificate(certificateData) {
    const {
      volunteerName,
      organizationName,
      activityType,
      hoursCompleted,
      performanceMetrics,
      recipientAddress
    } = certificateData;

    try {
      const timestamp = Date.now();
      const certificateId = this.generateCertificateId(volunteerName, activityType, timestamp);
      const performanceScore = this.calculatePerformanceScore(performanceMetrics);

      const certificate = {
        id: certificateId,
        volunteerName,
        organizationName,
        activityType,
        hoursCompleted,
        performanceScore,
        dateIssued: timestamp,
        isValid: true,
        blockchainHash: null
      };

      if (this.isMockMode) {
        // Mock blockchain transaction
        certificate.blockchainHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        this.mockCertificates.set(certificateId, certificate);
        
        // Simulate blockchain delay
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        // Real blockchain transaction
        const tx = await this.contract.issueCertificate(
          recipientAddress || await this.signer.getAddress(),
          certificateId,
          volunteerName,
          organizationName,
          activityType,
          hoursCompleted,
          performanceScore,
          Math.floor(timestamp / 1000)
        );
        
        const receipt = await tx.wait();
        certificate.blockchainHash = receipt.transactionHash;
      }

      return {
        success: true,
        certificate,
        message: 'Certificate issued successfully on blockchain!'
      };
    } catch (error) {
      console.error('Certificate issuance failed:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to issue certificate'
      };
    }
  }

  // Verify certificate authenticity
  async verifyCertificate(certificateId) {
    try {
      if (this.isMockMode) {
        const certificate = this.mockCertificates.get(certificateId);
        return {
          success: true,
          isValid: !!certificate,
          certificate: certificate || null
        };
      } else {
        const isValid = await this.contract.verifyCertificate(certificateId);
        const certificateData = await this.contract.getCertificate(certificateId);
        
        return {
          success: true,
          isValid,
          certificate: isValid ? {
            id: certificateId,
            volunteerName: certificateData.volunteerName,
            organizationName: certificateData.organizationName,
            activityType: certificateData.activityType,
            hoursCompleted: certificateData.hoursCompleted.toNumber(),
            performanceScore: certificateData.performanceScore.toNumber(),
            dateIssued: certificateData.dateIssued.toNumber() * 1000,
            isValid: certificateData.isValid
          } : null
        };
      }
    } catch (error) {
      console.error('Certificate verification failed:', error);
      return {
        success: false,
        error: error.message,
        isValid: false,
        certificate: null
      };
    }
  }

  // Get all certificates for a user
  async getUserCertificates(userAddress) {
    if (this.isMockMode) {
      const certificates = Array.from(this.mockCertificates.values());
      return {
        success: true,
        certificates
      };
    }
    
    // In a real implementation, you'd query blockchain events or maintain an index
    return {
      success: true,
      certificates: []
    };
  }

  // Generate certificate badge/NFT metadata
  generateCertificateMetadata(certificate) {
    return {
      name: `${certificate.activityType} Volunteer Certificate`,
      description: `Certificate awarded to ${certificate.volunteerName} for outstanding volunteer service with ${certificate.organizationName}`,
      image: this.generateCertificateImageURL(certificate),
      attributes: [
        {
          trait_type: "Volunteer Name",
          value: certificate.volunteerName
        },
        {
          trait_type: "Organization",
          value: certificate.organizationName
        },
        {
          trait_type: "Activity Type",
          value: certificate.activityType
        },
        {
          trait_type: "Hours Completed",
          value: certificate.hoursCompleted
        },
        {
          trait_type: "Performance Score",
          value: certificate.performanceScore
        },
        {
          trait_type: "Date Issued",
          value: new Date(certificate.dateIssued).toISOString()
        }
      ]
    };
  }

  // Generate certificate image URL (placeholder)
  generateCertificateImageURL(certificate) {
    // In a real implementation, you'd generate or compose certificate images
    return `https://api.civilsoul.org/certificates/${certificate.id}/image`;
  }
}

export default new BlockchainService();
