import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Brain, 
  Heart, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Calendar, 
  FileText, 
  Download, 
  Share2, 
  BarChart3,
  Clock,
  User,
  Shield,
  Lightbulb,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Surveys = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // PHQ-9 Depression Assessment
  const phq9Questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
    "Trouble concentrating on things, such as reading the newspaper or watching television",
    "Moving or speaking so slowly that other people could have noticed, or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
    "Thoughts that you would be better off dead, or of hurting yourself"
  ];

  // GAD-7 Anxiety Assessment
  const gad7Questions = [
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it is hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid, as if something awful might happen"
  ];

  const responseOptions = [
    { value: 0, label: "Not at all" },
    { value: 1, label: "Several days" },
    { value: 2, label: "More than half the days" },
    { value: 3, label: "Nearly every day" }
  ];

  const assessments = [
    {
      id: 'phq9',
      title: 'PHQ-9 Depression Screening',
      description: 'A 9-question assessment to screen for depression symptoms over the past 2 weeks.',
      icon: Brain,
      color: 'blue',
      duration: '5-7 minutes',
      questions: phq9Questions,
      type: 'depression'
    },
    {
      id: 'gad7',
      title: 'GAD-7 Anxiety Assessment',
      description: 'A 7-question assessment to screen for generalized anxiety disorder symptoms.',
      icon: Heart,
      color: 'purple',
      duration: '3-5 minutes',
      questions: gad7Questions,
      type: 'anxiety'
    }
  ];

  const interpretPHQ9Score = (score) => {
    if (score <= 4) {
      return {
        level: 'Minimal',
        severity: 'low',
        description: 'Minimal or no depression symptoms',
        recommendations: [
          'Continue with healthy lifestyle habits',
          'Regular exercise and good sleep hygiene',
          'Stay connected with supportive friends and family',
          'Practice stress management techniques'
        ],
        color: 'green'
      };
    } else if (score <= 9) {
      return {
        level: 'Mild',
        severity: 'low',
        description: 'Mild depression symptoms',
        recommendations: [
          'Monitor symptoms regularly',
          'Consider lifestyle modifications',
          'Practice mindfulness and relaxation techniques',
          'Consider counseling if symptoms persist'
        ],
        color: 'yellow'
      };
    } else if (score <= 14) {
      return {
        level: 'Moderate',
        severity: 'medium',
        description: 'Moderate depression symptoms',
        recommendations: [
          'Consider professional counseling or therapy',
          'Monitor symptoms closely',
          'Maintain social connections',
          'Consider lifestyle changes and stress reduction'
        ],
        color: 'orange'
      };
    } else if (score <= 19) {
      return {
        level: 'Moderately Severe',
        severity: 'high',
        description: 'Moderately severe depression symptoms',
        recommendations: [
          'Strongly recommend professional treatment',
          'Consider both therapy and medication evaluation',
          'Increase social support',
          'Monitor for safety concerns'
        ],
        color: 'red'
      };
    } else {
      return {
        level: 'Severe',
        severity: 'high',
        description: 'Severe depression symptoms',
        recommendations: [
          'Immediate professional treatment recommended',
          'Consider psychiatric evaluation',
          'Safety assessment needed',
          'Strong support system important'
        ],
        color: 'red'
      };
    }
  };

  const interpretGAD7Score = (score) => {
    if (score <= 4) {
      return {
        level: 'Minimal',
        severity: 'low',
        description: 'Minimal anxiety symptoms',
        recommendations: [
          'Continue with current coping strategies',
          'Maintain regular exercise and sleep schedule',
          'Practice relaxation techniques',
          'Stay socially connected'
        ],
        color: 'green'
      };
    } else if (score <= 9) {
      return {
        level: 'Mild',
        severity: 'low',
        description: 'Mild anxiety symptoms',
        recommendations: [
          'Practice deep breathing and mindfulness',
          'Regular exercise and stress management',
          'Consider anxiety management techniques',
          'Monitor symptoms'
        ],
        color: 'yellow'
      };
    } else if (score <= 14) {
      return {
        level: 'Moderate',
        severity: 'medium',
        description: 'Moderate anxiety symptoms',
        recommendations: [
          'Consider professional counseling',
          'Learn anxiety management techniques',
          'Practice stress reduction strategies',
          'Consider therapy if symptoms interfere with daily life'
        ],
        color: 'orange'
      };
    } else {
      return {
        level: 'Severe',
        severity: 'high',
        description: 'Severe anxiety symptoms',
        recommendations: [
          'Professional treatment strongly recommended',
          'Consider therapy and/or medication evaluation',
          'Learn coping strategies',
          'Build strong support network'
        ],
        color: 'red'
      };
    }
  };

  const startAssessment = (assessmentId) => {
    setActiveAssessment(assessmentId);
    setCurrentQuestion(0);
    setAnswers({});
    setResults(null);
  };

  const handleAnswer = (questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const nextQuestion = () => {
    const assessment = assessments.find(a => a.id === activeAssessment);
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitAssessment();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitAssessment = async () => {
    setIsSubmitting(true);
    
    // Calculate score
    const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
    const assessment = assessments.find(a => a.id === activeAssessment);
    
    let interpretation;
    if (activeAssessment === 'phq9') {
      interpretation = interpretPHQ9Score(totalScore);
    } else if (activeAssessment === 'gad7') {
      interpretation = interpretGAD7Score(totalScore);
    }

    const result = {
      id: Date.now(),
      assessmentId: activeAssessment,
      assessmentTitle: assessment.title,
      score: totalScore,
      maxScore: assessment.questions.length * 3,
      interpretation,
      date: new Date(),
      answers: { ...answers }
    };

    // Simulate API call
    setTimeout(() => {
      setResults(result);
      setAssessmentHistory(prev => [result, ...prev]);
      setIsSubmitting(false);
      toast.success('Assessment completed successfully!');
    }, 1500);
  };

  const resetAssessment = () => {
    setActiveAssessment(null);
    setCurrentQuestion(0);
    setAnswers({});
    setResults(null);
  };

  const downloadResults = (result) => {
    const content = `
Mental Health Assessment Results
===============================

Assessment: ${result.assessmentTitle}
Date: ${result.date.toLocaleDateString()}
Score: ${result.score}/${result.maxScore}
Level: ${result.interpretation.level}
Severity: ${result.interpretation.severity}

Description:
${result.interpretation.description}

Recommendations:
${result.interpretation.recommendations.map(rec => `• ${rec}`).join('\n')}

Disclaimer:
This assessment is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${result.assessmentId}-results-${result.date.toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Load assessment history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('mentalHealthAssessments');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setAssessmentHistory(parsed.map(item => ({
        ...item,
        date: new Date(item.date)
      })));
    }
  }, []);

  // Save assessment history to localStorage
  useEffect(() => {
    if (assessmentHistory.length > 0) {
      localStorage.setItem('mentalHealthAssessments', JSON.stringify(assessmentHistory));
    }
  }, [assessmentHistory]);

  if (results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className={`bg-gradient-to-r ${
                results.interpretation.color === 'green' ? 'from-green-500 to-emerald-600' :
                results.interpretation.color === 'yellow' ? 'from-yellow-500 to-amber-600' :
                results.interpretation.color === 'orange' ? 'from-orange-500 to-red-500' :
                'from-red-500 to-pink-600'
              } p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Assessment Results</h2>
                    <p className="opacity-90">{results.assessmentTitle}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{results.score}/{results.maxScore}</div>
                    <div className="opacity-90">Score</div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {results.interpretation.level} Level
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      results.interpretation.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      results.interpretation.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      results.interpretation.color === 'orange' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {results.interpretation.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {results.interpretation.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                    Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {results.interpretation.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {results.interpretation.severity === 'high' && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                          Important Notice
                        </h4>
                        <p className="text-red-700 dark:text-red-300 text-sm mb-3">
                          Your results suggest you may benefit from professional support. Consider reaching out to a mental health professional.
                        </p>
                        <div className="space-y-1 text-sm">
                          <p className="text-red-800 dark:text-red-200">
                            <Phone className="w-4 h-4 inline mr-1" />
                            Crisis Text Line: Text HOME to 741741
                          </p>
                          <p className="text-red-800 dark:text-red-200">
                            <Phone className="w-4 h-4 inline mr-1" />
                            National Suicide Prevention Lifeline: 988
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => downloadResults(results)}
                    className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Results
                  </button>
                  <button
                    onClick={() => setActiveAssessment('counseling')}
                    className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Counseling
                  </button>
                  <button
                    onClick={resetAssessment}
                    className="flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Take Another Assessment
                  </button>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-semibold mb-1">Disclaimer:</p>
                  <p>
                    This assessment is for informational purposes only and is not a substitute for professional medical advice, 
                    diagnosis, or treatment. Always seek the advice of qualified health providers with questions about your mental health.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (activeAssessment) {
    const assessment = assessments.find(a => a.id === activeAssessment);
    const currentQ = assessment.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              {/* Progress Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{assessment.title}</h2>
                  <span className="text-sm opacity-90">
                    {currentQuestion + 1} of {assessment.questions.length}
                  </span>
                </div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-8">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Over the last 2 weeks, how often have you been bothered by:
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentQ}
                  </h3>
                </div>

                <div className="space-y-3 mb-8">
                  {responseOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(currentQuestion, option.value)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        answers[currentQuestion] === option.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          answers[currentQuestion] === option.value
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {answers[currentQuestion] === option.value && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                          )}
                        </div>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {option.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={previousQuestion}
                    disabled={currentQuestion === 0}
                    className="px-6 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Previous
                  </button>
                  
                  <button
                    onClick={nextQuestion}
                    disabled={answers[currentQuestion] === undefined}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {currentQuestion === assessment.questions.length - 1 ? (
                      isSubmitting ? 'Processing...' : 'Complete Assessment'
                    ) : (
                      'Next'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Mental Health Assessments
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Take validated psychological assessments to better understand your mental health. 
            Get personalized insights and recommendations based on your responses.
          </p>
        </div>

        {/* Assessment Cards */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            {assessments.map((assessment) => (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${
                  assessment.color === 'blue' 
                    ? 'from-blue-500 to-indigo-600' 
                    : 'from-purple-500 to-pink-600'
                } p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <assessment.icon className="w-8 h-8" />
                    <span className="text-sm opacity-90 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {assessment.duration}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{assessment.title}</h3>
                  <p className="opacity-90">{assessment.description}</p>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {assessment.questions.length} questions
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Clinically validated
                    </span>
                  </div>
                  
                  <button
                    onClick={() => startAssessment(assessment.id)}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      assessment.color === 'blue'
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }`}
                  >
                    Start Assessment
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Assessment History */}
        {assessmentHistory.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2" />
              Your Assessment History
            </h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {assessmentHistory.slice(0, 5).map((result) => (
                  <div key={result.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mr-3">
                            {result.assessmentTitle}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            result.interpretation.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            result.interpretation.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            result.interpretation.color === 'orange' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {result.interpretation.level}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-1" />
                          {result.date.toLocaleDateString()}
                          <span className="mx-2">•</span>
                          Score: {result.score}/{result.maxScore}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => downloadResults(result)}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="Download results"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  About These Assessments
                </h3>
                <div className="text-blue-800 dark:text-blue-300 text-sm space-y-2">
                  <p>
                    <strong>PHQ-9:</strong> The Patient Health Questionnaire-9 is a validated tool for screening, 
                    diagnosing, monitoring and measuring the severity of depression.
                  </p>
                  <p>
                    <strong>GAD-7:</strong> The Generalized Anxiety Disorder 7-item scale is a validated tool 
                    for screening for and measuring the severity of generalized anxiety disorder.
                  </p>
                  <p className="font-medium">
                    These assessments are for informational purposes only and should not replace professional medical advice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Surveys;
