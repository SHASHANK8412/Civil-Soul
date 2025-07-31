import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  CreditCard, 
  Heart, 
  Shield, 
  Users, 
  Target, 
  Gift,
  TrendingUp,
  Award,
  Globe,
  Lock,
  DollarSign,
  Wallet,
  Smartphone,
  QrCode,
  Download,
  Share2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Star,
  Calendar,
  RefreshCw,
  FileText
} from 'lucide-react';
import paymentGatewayService from '../../services/paymentGatewayService';

const DonationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { donationType } = useParams();
  const { user } = useSelector(state => state.auth);

  // State management
  const [amount, setAmount] = useState(location.state?.amount || '');
  const [customAmount, setCustomAmount] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('stripe');
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [donorInfo, setDonorInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    isAnonymous: false
  });
  const [message, setMessage] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('monthly');
  const [availableMethods, setAvailableMethods] = useState([]);
  const [step, setStep] = useState(1); // 1: Amount, 2: Details, 3: Payment, 4: Confirmation
  const [paymentResult, setPaymentResult] = useState(null);

  // Preset amounts for different donation types
  const presetAmounts = {
    'animal-welfare': [100, 250, 500, 1000, 2500],
    'blood-donation': [150, 300, 750, 1500, 3000],
    'environment': [200, 500, 1000, 2500, 5000],
    'elderly-care': [250, 500, 1000, 2000, 4000],
    'mental-health': [300, 600, 1200, 2400, 4800],
    default: [100, 250, 500, 1000, 2500]
  };

  const donationTypeInfo = {
    'animal-welfare': {
      title: 'Animal Welfare',
      description: 'Help protect and care for animals in need',
      icon: '🐾',
      impacts: [
        { amount: 100, impact: 'Feeds 5 stray animals for a day' },
        { amount: 250, impact: 'Provides medical care for 1 injured animal' },
        { amount: 500, impact: 'Vaccinates 10 animals' },
        { amount: 1000, impact: 'Rescues and rehabilitates 1 animal' }
      ]
    },
    'blood-donation': {
      title: 'Blood Donation Drive',
      description: 'Support blood donation camps and save lives',
      icon: '❤️',
      impacts: [
        { amount: 150, impact: 'Organizes blood drive for 10 people' },
        { amount: 300, impact: 'Provides blood testing equipment' },
        { amount: 750, impact: 'Sponsors mobile blood collection unit' },
        { amount: 1500, impact: 'Funds complete blood drive event' }
      ]
    },
    'environment': {
      title: 'Environmental Conservation',
      description: 'Protect our planet and create a sustainable future',
      icon: '🌱',
      impacts: [
        { amount: 200, impact: 'Plants 20 trees' },
        { amount: 500, impact: 'Cleans 1 km of river/beach' },
        { amount: 1000, impact: 'Sponsors renewable energy project' },
        { amount: 2500, impact: 'Funds community garden initiative' }
      ]
    },
    'elderly-care': {
      title: 'Elderly Care',
      description: 'Support senior citizens with care and companionship',
      icon: '👴',
      impacts: [
        { amount: 250, impact: 'Provides meals for 1 elderly person for a week' },
        { amount: 500, impact: 'Sponsors health checkup for 5 seniors' },
        { amount: 1000, impact: 'Funds recreational activities for elderly home' },
        { amount: 2000, impact: 'Provides medical equipment for senior care' }
      ]
    },
    'mental-health': {
      title: 'Mental Health Support',
      description: 'Promote mental wellness and provide counseling services',
      icon: '🧠',
      impacts: [
        { amount: 300, impact: 'Funds 1 counseling session' },
        { amount: 600, impact: 'Provides mental health workshop' },
        { amount: 1200, impact: 'Sponsors therapy for 1 month' },
        { amount: 2400, impact: 'Funds mental health awareness campaign' }
      ]
    }
  };

  // Get donation info
  const getDonationInfo = useCallback(() => {
    return donationTypeInfo[donationType] || {
      title: 'General Donation',
      description: 'Support our cause and make a difference',
      icon: '❤️',
      impacts: presetAmounts.default.map(amt => ({
        amount: amt,
        impact: `Supports our mission with ₹${amt}`
      }))
    };
  }, [donationType]);

  // Initialize payment methods
  useEffect(() => {
    const initializePaymentMethods = async () => {
      setLoading(true);
      try {
        // Get user's location for payment method availability
        const methods = paymentGatewayService.getAvailablePaymentMethods('US', 'USD');
        setAvailableMethods(methods);
      } catch (error) {
        console.error('Error initializing payment methods:', error);
      } finally {
        setLoading(false);
      }
    };

    initializePaymentMethods();
  }, []);

  // Handle amount selection
  const handleAmountSelect = (selectedAmount) => {
    setAmount(selectedAmount);
    setCustomAmount('');
  };

  // Handle custom amount
  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    setAmount(value);
  };

  // Get final amount
  const getFinalAmount = () => {
    return customAmount || amount;
  };

  // Validate form
  const validateForm = () => {
    const finalAmount = getFinalAmount();
    if (!finalAmount || parseFloat(finalAmount) <= 0) {
      setPaymentError('Please enter a valid donation amount');
      return false;
    }
    if (!donorInfo.firstName || !donorInfo.lastName || !donorInfo.email) {
      setPaymentError('Please fill in all required fields');
      return false;
    }
    return true;
  };

  // Handle payment processing
  const handlePayment = async () => {
    if (!validateForm()) return;

    setProcessing(true);
    setPaymentError('');

    try {
      const finalAmount = parseFloat(getFinalAmount());
      const donationInfo = getDonationInfo();

      const paymentData = {
        amount: finalAmount,
        currency: 'INR',
        provider: selectedProvider,
        donationType: donationType,
        projectId: `${donationType}-${Date.now()}`,
        billingDetails: {
          name: `${donorInfo.firstName} ${donorInfo.lastName}`,
          email: donorInfo.email,
          phone: donorInfo.phone
        },
        metadata: {
          donationType: donationInfo.title,
          isRecurring,
          recurringFrequency: isRecurring ? recurringFrequency : null,
          message,
          isAnonymous: donorInfo.isAnonymous
        }
      };

      // Process payment
      const result = await paymentGatewayService.processPayment(paymentData);

      if (result.success) {
        // Record donation
        const donationRecord = await paymentGatewayService.recordDonation({
          ...paymentData,
          transactionId: result.transactionId,
          donorInfo,
          message
        });

        setPaymentResult(result);
        setPaymentSuccess(true);
        setStep(4);

        // Setup recurring donation if selected
        if (isRecurring && result.paymentMethodId) {
          await paymentGatewayService.setupRecurringDonation({
            ...paymentData,
            paymentMethodId: result.paymentMethodId,
            frequency: recurringFrequency
          });
        }
      } else {
        setPaymentError(result.error || 'Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(error.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Render amount selection step
  const renderAmountStep = () => {
    const donationInfo = getDonationInfo();
    const amounts = presetAmounts[donationType] || presetAmounts.default;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-4xl mb-4">{donationInfo.icon}</div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {donationInfo.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {donationInfo.description}
          </p>
        </div>

        {/* Preset amounts */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Choose Amount
          </label>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {amounts.map(preset => (
              <button
                key={preset}
                onClick={() => handleAmountSelect(preset)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  amount === preset
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                    : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400'
                }`}
              >
                <div className="font-semibold">₹{preset}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Or Enter Custom Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">₹</span>
            <input
              type="number"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder="Enter amount"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              min="1"
              step="0.01"
            />
          </div>
        </div>

        {/* Impact preview */}
        {getFinalAmount() && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
              Your Impact
            </h3>
            {donationInfo.impacts
              .filter(impact => impact.amount <= parseFloat(getFinalAmount()))
              .slice(-1)
              .map(impact => (
                <p key={impact.amount} className="text-green-700 dark:text-green-400">
                  ₹{getFinalAmount()} {impact.impact}
                </p>
              ))
            }
          </div>
        )}

        {/* Recurring donation option */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Make this a recurring donation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Maximize your impact with regular contributions
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                           peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer 
                           dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white 
                           after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                           after:bg-white after:border-gray-300 after:border after:rounded-full 
                           after:h-5 after:w-5 after:transition-all dark:border-gray-600 
                           peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          {isRecurring && (
            <div className="mt-3">
              <select
                value={recurringFrequency}
                onChange={(e) => setRecurringFrequency(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                         rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}
        </div>

        <button
          onClick={() => setStep(2)}
          disabled={!getFinalAmount() || parseFloat(getFinalAmount()) <= 0}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 
                   text-white font-semibold py-3 px-6 rounded-lg transition-colors
                   flex items-center justify-center space-x-2"
        >
          <span>Continue</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    );
  };

  // Render donor details step
  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <button onClick={() => setStep(1)} className="text-purple-600 hover:text-purple-700">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Information
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={donorInfo.firstName}
            onChange={(e) => setDonorInfo({...donorInfo, firstName: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={donorInfo.lastName}
            onChange={(e) => setDonorInfo({...donorInfo, lastName: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          value={donorInfo.email}
          onChange={(e) => setDonorInfo({...donorInfo, email: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={donorInfo.phone}
          onChange={(e) => setDonorInfo({...donorInfo, phone: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Leave a Message (Optional)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Share why this cause matters to you..."
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="anonymous"
          checked={donorInfo.isAnonymous}
          onChange={(e) => setDonorInfo({...donorInfo, isAnonymous: e.target.checked})}
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
        />
        <label htmlFor="anonymous" className="text-sm text-gray-700 dark:text-gray-300">
          Make this donation anonymous
        </label>
      </div>

      <button
        onClick={() => setStep(3)}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold 
                 py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
      >
        <span>Continue to Payment</span>
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );

  // Render payment step
  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <button onClick={() => setStep(2)} className="text-purple-600 hover:text-purple-700">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Payment Method
        </h2>
      </div>

      {/* Donation summary */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          Donation Summary
        </h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Amount:</span>
            <span className="font-semibold">₹{getFinalAmount()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Cause:</span>
            <span className="font-semibold">{getDonationInfo().title}</span>
          </div>
          {isRecurring && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Frequency:</span>
              <span className="font-semibold capitalize">{recurringFrequency}</span>
            </div>
          )}
        </div>
      </div>

      {/* Payment methods */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Choose Payment Method
        </label>
        <div className="space-y-3">
          {availableMethods.map(method => (
            <button
              key={method.id}
              onClick={() => setSelectedProvider(method.id)}
              className={`w-full p-4 border-2 rounded-lg transition-all flex items-center space-x-3 ${
                selectedProvider === method.id
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
              }`}
            >
              <span className="text-2xl">{method.icon}</span>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {method.name}
                </div>
                {method.id === 'crypto' && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Bitcoin, Ethereum, USDT, USDC
                  </div>
                )}
              </div>
              {selectedProvider === method.id && (
                <CheckCircle className="h-5 w-5 text-purple-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Security notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300">
              Secure Payment
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Your payment information is encrypted and secure. We never store your payment details.
            </p>
          </div>
        </div>
      </div>

      {paymentError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
            <p className="text-red-700 dark:text-red-400">{paymentError}</p>
          </div>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={processing}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 
                 text-white font-semibold py-3 px-6 rounded-lg transition-colors
                 flex items-center justify-center space-x-2"
      >
        {processing ? (
          <>
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Heart className="h-5 w-5" />
            <span>Complete Donation</span>
          </>
        )}
      </button>
    </div>
  );

  // Render confirmation step
  const renderConfirmationStep = () => (
    <div className="text-center space-y-6">
      <div className="text-green-600 dark:text-green-400">
        <CheckCircle className="h-16 w-16 mx-auto mb-4" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Thank You!
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Your donation has been processed successfully
        </p>
      </div>

      {paymentResult && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Amount:</span>
              <span className="font-semibold">₹{getFinalAmount()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
              <span className="font-mono text-xs">{paymentResult.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
              <span className="font-semibold capitalize">{paymentResult.provider}</span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={() => navigate('/profile')}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold 
                   py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <FileText className="h-5 w-5" />
          <span>View Receipt</span>
        </button>
        
        <button
          onClick={() => navigate('/donations')}
          className="w-full border border-purple-600 text-purple-600 hover:bg-purple-50 
                   dark:hover:bg-purple-900/20 font-semibold py-3 px-6 rounded-lg transition-colors
                   flex items-center justify-center space-x-2"
        >
          <Share2 className="h-5 w-5" />
          <span>Share Your Impact</span>
        </button>
        
        <button
          onClick={() => navigate('/')}
          className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 
                   dark:hover:text-gray-200 font-medium py-2"
        >
          Return to Home
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading payment options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map(stepNumber => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-12 h-0.5 ${
                    step > stepNumber
                      ? 'bg-purple-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {step === 1 && 'Choose Amount'}
              {step === 2 && 'Your Details'}
              {step === 3 && 'Payment'}
              {step === 4 && 'Confirmation'}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {step === 1 && renderAmountStep()}
          {step === 2 && renderDetailsStep()}
          {step === 3 && renderPaymentStep()}
          {step === 4 && renderConfirmationStep()}
        </div>
      </div>
    </div>
  );
};

export default DonationPage;
