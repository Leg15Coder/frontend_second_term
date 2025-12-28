import { useEffect } from 'react';
import Header from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import ProblemSection from '@/components/ProblemSection';
import FeaturesSection from '@/components/FeaturesSection';
import ScenariosSection from '@/components/ScenariosSection';
import ScreensSection from '@/components/ScreensSection';
import APISection from '@/components/APISection';
import TechStackSection from '@/components/TechStackSection';
import FinalCTASection from '@/components/FinalCTASection';
import Footer from '@/components/Footer';
import ParticlesBackground from '@/components/ParticlesBackground';

const Index = () => {
  useEffect(() => {
    // Update page title and meta
    document.title = 'Motify — Магический трекер привычек и целей';
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Background particles */}
      <ParticlesBackground />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section id="hero">
          <HeroSection />
        </section>
        
        {/* Problem Section */}
        <section id="problem">
          <ProblemSection />
        </section>
        
        {/* Features Section */}
        <section id="features">
          <FeaturesSection />
        </section>
        
        {/* Scenarios Section */}
        <section id="scenarios">
          <ScenariosSection />
        </section>
        
        {/* Screens Section */}
        <section id="screens">
          <ScreensSection />
        </section>
        
        {/* API Section */}
        <section id="api">
          <APISection />
        </section>
        
        {/* Tech Stack Section */}
        <section id="tech">
          <TechStackSection />
        </section>
        
        {/* Final CTA */}
        <FinalCTASection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
