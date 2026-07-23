import React from 'react';
import CustomCursor from './components/CustomCursor';
import { VelksFooter } from './components/VelksFooter';
import BackgroundCanvas from './components/BackgroundCanvas';
import { SEOSchema } from './components/SEOSchema';

import PromoBanner from './components/PromoBanner';
import TopNav from './components/TopNav';
import VSLHeroScene from './components/VSLHeroScene';
import PainScene from './components/PainScene';
import MechanismScene from './components/MechanismScene';
import TestimonialsScene from './components/TestimonialsScene';
import CTAScene from './components/CTAScene';
import { OrionWidget } from './components/OrionWidget';

export default function App() {
  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-[#ff003c]/30">
      <SEOSchema />
      <CustomCursor />
      <BackgroundCanvas />
      <OrionWidget />
      
      <PromoBanner />
      <TopNav />
      
      <main id="main-scroll-container">
        <VSLHeroScene />
        <PainScene />
        <MechanismScene />
        <TestimonialsScene />
        <CTAScene />
      </main>
      
      <VelksFooter />
    </div>
  );
}
