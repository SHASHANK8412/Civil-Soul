// Payment Gateway Service
// Supports multiple payment providers: Stripe, PayPal, Razorpay, and Crypto

class PaymentGatewayService {
  constructor() {
    this.providers = {
      stripe: null,
      paypal: null,
      razorpay: null,
      crypto: null
    };
    this.initializeProviders();
  }

  // Initialize payment providers
  async initializeProviders() {
    try {
      // Initialize Stripe
      if (window.Stripe && process.env.REACT_APP_STRIPE_PUBLIC_KEY) {
        this.providers.stripe = window.Stripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
      }

      // Initialize Razorpay
      if (window.Razorpay && process.env.REACT_APP_RAZORPAY_KEY_ID) {
        this.providers.razorpay = window.Razorpay;
      }

      // Initialize PayPal SDK
      if (window.paypal && process.env.REACT_APP_PAYPAL_CLIENT_ID) {
        this.providers.paypal = window.paypal;
      }

      console.log('Payment providers initialized');
    } catch (error) {
      console.error('Error initializing payment providers:', error);
    }
  }

  // Process Stripe Payment
  async processStripePayment(paymentData) {
    try {
      if (!this.providers.stripe) {
        throw new Error('Stripe not initialized');
      }

      const response = await fetch('/api/payments/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: paymentData.amount * 100, // Convert to paise
          currency: paymentData.currency || 'inr',
          donationType: paymentData.donationType,
          projectId: paymentData.projectId,
          metadata: paymentData.metadata
        })
      });

      const { clientSecret, paymentIntentId } = await response.json();

      const { error, paymentIntent } = await this.providers.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: paymentData.cardElement,
          billing_details: {
            name: paymentData.billingDetails.name,
            email: paymentData.billingDetails.email,
            address: paymentData.billingDetails.address
          }
        }
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        paymentIntent,
        transactionId: paymentIntent.id,
        provider: 'stripe'
      };
    } catch (error) {
      console.error('Stripe payment error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Process Razorpay Payment
  async processRazorpayPayment(paymentData) {
    try {
      if (!this.providers.razorpay) {
        throw new Error('Razorpay not initialized');
      }

      // Create order on server
      const response = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: paymentData.amount * 100, // Convert to paise
          currency: paymentData.currency || 'INR',
          donationType: paymentData.donationType,
          projectId: paymentData.projectId
        })
      });

      const orderData = await response.json();

      return new Promise((resolve, reject) => {
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'CivilSoul',
          description: `Donation for ${paymentData.donationType}`,
          order_id: orderData.id,
          handler: async (response) => {
            try {
              // Verify payment on server
              const verifyResponse = await fetch('/api/payments/razorpay/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature
                })
              });

              const verifyResult = await verifyResponse.json();

              if (verifyResult.success) {
                resolve({
                  success: true,
                  transactionId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  provider: 'razorpay'
                });
              } else {
                reject(new Error('Payment verification failed'));
              }
            } catch (error) {
              reject(error);
            }
          },
          prefill: {
            name: paymentData.billingDetails.name,
            email: paymentData.billingDetails.email,
            contact: paymentData.billingDetails.phone
          },
          theme: {
            color: '#7c3aed'
          },
          modal: {
            ondismiss: () => {
              reject(new Error('Payment cancelled by user'));
            }
          }
        };

        const razorpay = new this.providers.razorpay(options);
        razorpay.open();
      });
    } catch (error) {
      console.error('Razorpay payment error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Process PayPal Payment
  async processPayPalPayment(paymentData) {
    try {
      if (!this.providers.paypal) {
        throw new Error('PayPal not initialized');
      }

      return new Promise((resolve, reject) => {
        this.providers.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: paymentData.amount.toString(),
                  currency_code: paymentData.currency || 'USD'
                },
                description: `Donation for ${paymentData.donationType}`,
                custom_id: paymentData.projectId
              }]
            });
          },
          onApprove: async (data, actions) => {
            try {
              const details = await actions.order.capture();
              
              // Record payment on server
              const response = await fetch('/api/payments/paypal/record', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                  orderId: data.orderID,
                  payerId: data.payerID,
                  details: details,
                  donationType: paymentData.donationType,
                  projectId: paymentData.projectId
                })
              });

              const result = await response.json();

              resolve({
                success: true,
                transactionId: details.id,
                orderId: data.orderID,
                provider: 'paypal',
                details
              });
            } catch (error) {
              reject(error);
            }
          },
          onError: (err) => {
            reject(err);
          },
          onCancel: () => {
            reject(new Error('Payment cancelled by user'));
          }
        }).render(paymentData.containerId);
      });
    } catch (error) {
      console.error('PayPal payment error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Process Cryptocurrency Payment
  async processCryptoPayment(paymentData) {
    try {
      // Create crypto payment request
      const response = await fetch('/api/payments/crypto/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: paymentData.amount,
          currency: paymentData.cryptoCurrency || 'BTC',
          donationType: paymentData.donationType,
          projectId: paymentData.projectId,
          walletAddress: paymentData.walletAddress
        })
      });

      const cryptoPayment = await response.json();

      return {
        success: true,
        paymentAddress: cryptoPayment.address,
        amount: cryptoPayment.amount,
        currency: cryptoPayment.currency,
        qrCode: cryptoPayment.qrCode,
        transactionId: cryptoPayment.id,
        provider: 'crypto'
      };
    } catch (error) {
      console.error('Crypto payment error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get available payment methods based on region/currency
  getAvailablePaymentMethods(country, currency) {
    const methods = [];

    // Stripe - Available globally
    if (this.providers.stripe) {
      methods.push({
        id: 'stripe',
        name: 'Credit/Debit Card',
        icon: '💳',
        provider: 'stripe',
        supported: true
      });
    }

    // Razorpay - Primarily India
    if (this.providers.razorpay && (country === 'IN' || currency === 'INR')) {
      methods.push({
        id: 'razorpay',
        name: 'Razorpay',
        icon: '🇮🇳',
        provider: 'razorpay',
        supported: true
      });
    }

    // PayPal - Global but not in all countries
    if (this.providers.paypal) {
      methods.push({
        id: 'paypal',
        name: 'PayPal',
        icon: '🅿️',
        provider: 'paypal',
        supported: true
      });
    }

    // Cryptocurrency - Global
    methods.push({
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: '₿',
      provider: 'crypto',
      supported: true,
      currencies: ['BTC', 'ETH', 'USDT', 'USDC']
    });

    return methods;
  }

  // Process payment with auto-detection of best method
  async processPayment(paymentData) {
    try {
      switch (paymentData.provider) {
        case 'stripe':
          return await this.processStripePayment(paymentData);
        case 'razorpay':
          return await this.processRazorpayPayment(paymentData);
        case 'paypal':
          return await this.processPayPalPayment(paymentData);
        case 'crypto':
          return await this.processCryptoPayment(paymentData);
        default:
          throw new Error('Unsupported payment provider');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Record donation after successful payment
  async recordDonation(donationData) {
    try {
      const response = await fetch('/api/donations/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: donationData.amount,
          currency: donationData.currency,
          donationType: donationData.donationType,
          projectId: donationData.projectId,
          transactionId: donationData.transactionId,
          provider: donationData.provider,
          donorInfo: donationData.donorInfo,
          isAnonymous: donationData.isAnonymous || false,
          message: donationData.message,
          metadata: donationData.metadata
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error recording donation:', error);
      throw error;
    }
  }

  // Get donation history
  async getDonationHistory(userId) {
    try {
      const response = await fetch(`/api/donations/history/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const donations = await response.json();
      return donations;
    } catch (error) {
      console.error('Error fetching donation history:', error);
      return [];
    }
  }

  // Get donation receipt
  async getDonationReceipt(donationId) {
    try {
      const response = await fetch(`/api/donations/receipt/${donationId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const receipt = await response.json();
      return receipt;
    } catch (error) {
      console.error('Error fetching donation receipt:', error);
      return null;
    }
  }

  // Generate tax receipt
  async generateTaxReceipt(donationId) {
    try {
      const response = await fetch(`/api/donations/tax-receipt/${donationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const taxReceipt = await response.json();
      return taxReceipt;
    } catch (error) {
      console.error('Error generating tax receipt:', error);
      return null;
    }
  }

  // Recurring donation setup
  async setupRecurringDonation(recurringData) {
    try {
      const response = await fetch('/api/donations/recurring/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: recurringData.amount,
          currency: recurringData.currency,
          frequency: recurringData.frequency, // monthly, quarterly, yearly
          donationType: recurringData.donationType,
          projectId: recurringData.projectId,
          provider: recurringData.provider,
          paymentMethodId: recurringData.paymentMethodId
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error setting up recurring donation:', error);
      throw error;
    }
  }

  // Cancel recurring donation
  async cancelRecurringDonation(subscriptionId) {
    try {
      const response = await fetch(`/api/donations/recurring/cancel/${subscriptionId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error canceling recurring donation:', error);
      throw error;
    }
  }
}

// Create singleton instance
const paymentGatewayService = new PaymentGatewayService();

export default paymentGatewayService;
