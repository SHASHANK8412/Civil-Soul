import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  Globe, 
  Award,
  ArrowRight,
  Star,
  MessageCircle,
  Shield,
  Zap
} from 'lucide-react';

// Components
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import StatsSection from '../components/home/StatsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CallToActionSection from '../components/home/CallToActionSection';

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <CallToActionSection />
    </div>
  );
};

export default Home;
