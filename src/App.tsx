import React from 'react';
import HeroSection from './components/HeroSection';
import Navigation from './components/Navigation';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import AchievementsSection from './components/AchievementsSection';
import BlogSection from './components/BlogSection';
import GameHub from './components/GameHub';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      <HeroSection />
      <SkillsSection />
      <ProjectsSection />
      <GameHub />
      <AchievementsSection />
      <BlogSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default App;