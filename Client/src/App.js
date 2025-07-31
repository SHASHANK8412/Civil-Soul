import React, { useEffect, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AOS from 'aos';

// Redux actions
import { loadUser } from './store/slices/authSlice';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import { NotificationProvider } from './context/NotificationContext';

// Performance Components
import PerformanceOptimizer from './components/common/PerformanceOptimizer';

// Components
import NavbarEnhanced from './components/layout/NavbarEnhanced';
import Footer from './components/layout/Footer';

// Lazy-loaded pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const Volunteering = React.lazy(() => import('./pages/volunteering/Volunteering'));
const VolunteerDetails = React.lazy(() => import('./pages/volunteering/VolunteerDetails'));
const MentalHealth = React.lazy(() => import('./pages/mental-health/MentalHealth'));
const Chatbot = React.lazy(() => import('./pages/mental-health/Chatbot'));
const Counselling = React.lazy(() => import('./pages/mental-health/Counselling'));
const Surveys = React.lazy(() => import('./pages/mental-health/Surveys'));
const Blogs = React.lazy(() => import('./pages/blogs/Blogs'));
const BlogPost = React.lazy(() => import('./pages/blogs/BlogPost'));
const Environment = React.lazy(() => import('./pages/environment/Environment'));
const ElderlyCare = React.lazy(() => import('./pages/elderly-care/ElderlyCare'));
const BloodDonation = React.lazy(() => import('./pages/blood-donation/BloodDonation'));
const AnimalWelfare = React.lazy(() => import('./pages/animal-welfare/AnimalWelfare'));
const Certificates = React.lazy(() => import('./pages/certificates/Certificates'));
const DonationPage = React.lazy(() => import('./pages/donations/DonationPage'));
const DonationHistory = React.lazy(() => import('./pages/donations/DonationHistory'));
const Profile = React.lazy(() => import('./pages/profile/Profile'));
const Contact = React.lazy(() => import('./pages/Contact'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });

    // Load user from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  return (
    <ThemeProvider>
      <AnalyticsProvider>
        <NotificationProvider>
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <NavbarEnhanced />
            
            <main className="flex-grow">
              <PerformanceOptimizer>
                <Suspense fallback={
                  <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                    </div>
                  </div>
                }>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/contact" element={<Contact />} />
                    
                    {/* Volunteering Routes */}
                    <Route path="/volunteering" element={<Volunteering />} />
                    <Route path="/volunteering/:id" element={<VolunteerDetails />} />
                    
                    {/* Mental Health Routes */}
                    <Route path="/mental-health" element={<MentalHealth />} />
                    <Route path="/mental-health/chatbot" element={<Chatbot />} />
                    <Route path="/mental-health/counselling" element={<Counselling />} />
                    <Route path="/mental-health/surveys" element={<Surveys />} />
                    
                    {/* Blog Routes */}
                    <Route path="/blogs" element={<Blogs />} />
                    <Route path="/blogs/:slug" element={<BlogPost />} />
                    
                    {/* Service Routes */}
                    <Route path="/environment" element={<Environment />} />
                    <Route path="/elderly-care" element={<ElderlyCare />} />
                    <Route path="/blood-donation" element={<BloodDonation />} />
                    <Route path="/animal-welfare" element={<AnimalWelfare />} />
                    
                    {/* Donation Routes */}
                    <Route path="/donate" element={<DonationPage />} />
                    <Route path="/donate/:donationType" element={<DonationPage />} />
                    <Route path="/donations" element={<DonationHistory />} />
                    
                    {/* User Routes */}
                    <Route path="/certificates" element={<Certificates />} />
                    <Route path="/profile" element={<Profile />} />
                    
                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </PerformanceOptimizer>
            </main>
            
            <Footer />
          </div>
        </NotificationProvider>
      </AnalyticsProvider>
    </ThemeProvider>
  );
}

export default App;
