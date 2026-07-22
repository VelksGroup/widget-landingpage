import React, { useEffect, useRef, useState } from 'react';
import { Play, ArrowUpRight, AlertTriangle, ChevronRight, Activity, Crosshair, Network, Mail, Globe, Lock, Linkedin, Instagram, Facebook } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TiltCard } from './TiltCard';

import { useTranslation } from 'react-i18next'; // Import useTranslation

const stripeCheckoutUrl = "https://book.stripe.com/dRmeVdbV4bCBc2Q7uF2cg00";
const whatsappUrl = "https://wa.me/33761569686?text=Ol%C3%A1%2C%20vi%20a%20demo%20da%20VELKS.SPACE%20e%20quero%20implementar%20este%20sistema%20no%20meu%20site.%20Pode%20me%20explicar%20o%20pr%C3%B3ximo%20passo%3F";
const handleMainCtaClick = () => window.open(stripeCheckoutUrl, "_blank", "noopener,noreferrer");
const handleSecondaryCtaClick = () => window.open(whatsappUrl, "_blank", "noopener,noreferrer");

const MarqueeContent = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center shrink-0">
      <span className="text-[#ff003c] animate-pulse whitespace-nowrap">
        ⚡ {t('marquee_promo_text_part1')} <span className="line-through opacity-50 px-1 font-normal">{t('marquee_old_price')}</span> → {t('marquee_new_price')}
      </span>
      <span className="opacity-30 mx-3 sm:mx-5">/</span>
      <span className="text-[#ffaa00] whitespace-nowrap">{t('marquee_free_months')}</span>
      <span className="opacity-30 mx-3 sm:mx-5">/</span>
      <span className="whitespace-nowrap">{t('marquee_one_time_payment')}</span>
      <span className="opacity-30 mx-3 sm:mx-5">/</span>
    </div>
  );
};

function MechanismScene() {
  const { t } = useTranslation(); // Initialize useTranslation

  // Define mechanism steps using translation keys
  const mechanismSteps = [
    { title: t('mechanism_step1_title'), desc: t('mechanism_step1_desc'), icon: <Activity className="w-6 h-6 text-[#00e5ff]" /> },
    { title: t('mechanism_step2_title'), desc: t('mechanism_step2_desc'), icon: <Crosshair className="w-6 h-6 text-[#00e5ff]" /> },
    { title: t('mechanism_step3_title'), desc: t('mechanism_step3_desc'), icon: <Network className="w-6 h-6 text-[#00e5ff]" /> },
    { title: t('mechanism_step4_title'), desc: t('mechanism_step4_desc'), icon: <Mail className="w-6 h-6 text-[#00e5ff]" /> }
  ];

  return (
    <section id="scene-3" className="relative w-full min-h-screen py-24 flex items-center justify-center px-4 z-10 box-border">
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        <div className="lg:w-5/12 z-10 text-left">
           <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#00e5ff]/50 bg-[#00e5ff]/10 mb-8 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(0,229,255,0.2)_inset]">
              <span className="w-2 h-2 bg-[#00e5ff] rounded-full animate-pulse shadow-[0_0_8px_#00e5ff]"></span>
              <span className="text-xs font-mono font-bold text-[#00e5ff] uppercase tracking-widest drop-shadow-[0_0_5px_#00e5ff]">{t('mechanism_badge_simultaneous_action')}</span>
           </div>
           
           <h2 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 leading-[0.9] tracking-tighter mb-8" style={{ filter: 'drop-shadow(0 0 20px rgba(0,229,255,0.4))' }}>
             {t('mechanism_title_part1')}<br/> <span className="text-[#00e5ff]" style={{ filter: 'drop-shadow(0 0 30px rgba(0,229,255,0.8))' }}>{t('mechanism_title_part2')}</span>
           </h2>
           
           <p className="text-2xl md:text-3xl text-white/90 font-light mb-10 leading-snug drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
             {t('mechanism_description')}
           </p>
           
           <div className="p-6 bg-white/5 border border-white/20 border-l-[4px] border-l-[#00e5ff] backdrop-blur-[30px] rounded-r-xl shadow-[0_0_40px_rgba(0,229,255,0.1)_inset]">
             <p className="font-mono text-sm sm:text-base text-[#00e5ff] uppercase tracking-[0.2em] font-black leading-relaxed drop-shadow-[0_0_10px_rgba(0,229,255,0.6)]">
               {t('mechanism_cta_box_part1')}<br/>{t('mechanism_cta_box_part2')}
             </p>
           </div>
        </div>

        <div className="mechanism-container lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full z-10" style={{ perspective: '2000px' }}>
           {mechanismSteps.map((step, i) => (
             <TiltCard key={i} className="mechanism-step-animate group border border-[#00e5ff]/40 bg-[#00e5ff]/5 backdrop-blur-[40px] shadow-[0_0_40px_rgba(0,229,255,0.15)_inset] overflow-hidden" glowColor="rgba(0,229,255,0.6)">
               <div className="p-6 sm:p-8 h-full w-full relative">
                 <div className="absolute -top-10 -right-10 text-[140px] font-mono font-black text-white/10 group-hover:text-[#00e5ff]/10 transition-colors duration-500 z-0 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                   0{i+1}
                 </div>
                 <div className="w-14 h-14 border-2 border-[#00e5ff]/60 bg-[#00e5ff]/20 flex items-center justify-center mb-6 relative z-10 rounded-xl shadow-[0_0_30px_rgba(0,229,255,0.5)]" style={{ transform: 'translateZ(30px)' }}>
                   {step.icon}
                 </div>
                 <h4 className="text-white text-3xl font-black tracking-tight mb-3 relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]" style={{ transform: 'translateZ(40px)' }}>{step.title}</h4>
                 <p className="text-white font-bold text-base md:text-lg leading-relaxed relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ transform: 'translateZ(20px)' }}>{step.desc}</p>
               </div>
             </TiltCard>
           ))}
        </div>

      </div>
    </section>
  );
}
export default MechanismScene;