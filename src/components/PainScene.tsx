import React, { useEffect, useRef, useState } from 'react';
import { Play, ArrowUpRight, AlertTriangle, ChevronRight, Activity, Crosshair, Network, Mail, Globe, Lock, Linkedin, Instagram, Facebook } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TiltCard } from './TiltCard';

import { useTranslation } from 'react-i18next'; // Import useTranslation

const stripeCheckoutUrl = "https://book.stripe.com/dRmeVdbV4bCBc2Q7uF2cg00";
const whatsappUrl = "https://wa.me/33761569686?text=Ol%C3%A1%2C%20vi%20a%20demo%20da%20VELKS.SPACE%20e%20quero%20implementar%20este%20sistema%20no%20meu%20site.%20Pode%20me%20explicar%20o%20pr%C3%B3ximo%20passo%3F"; // This text is hardcoded in the URL, usually it would also be translated or configured. For this exercise, I'll leave the URL as is as it's not part of the visible UI.
const handleMainCtaClick = () => window.open(stripeCheckoutUrl, "_blank", "noopener,noreferrer");
const handleSecondaryCtaClick = () => window.open(whatsappUrl, "_blank", "noopener,noreferrer");

// MarqueeContent is now a functional component using useTranslation
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

function PainScene() {
  const { t } = useTranslation(); // Initialize useTranslation hook

  // Data for the TiltCards, now using translation keys
  const painCardsData = [
    { titleKey: "card_slow_response_title", resultKey: "card_slow_response_result" },
    { titleKey: "card_dead_website_title", resultKey: "card_dead_website_result" },
    { titleKey: "card_loose_message_title", resultKey: "card_loose_message_result" },
    { titleKey: "card_busy_team_title", resultKey: "card_busy_team_result" }
  ];

  return (
    <section id="scene-2" className="relative w-full min-h-screen py-24 flex items-center justify-center px-4 z-10 box-border">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        <div className="relative border-l-[4px] border-[#ff003c] pl-6 lg:pl-12 z-10 mb-8 lg:mb-0">
          <h2 className="text-4xl md:text-6xl lg:text-[5.5rem] font-bold text-white tracking-tighter leading-[1] mb-6 drop-shadow-xl">
            {t('pain_title')}
          </h2>
          
          <h3 className="text-2xl md:text-4xl text-[#ff003c] font-light tracking-tight mb-8">
            {t('pain_subtitle')}
          </h3>

            <div className="text-lg md:text-xl text-white/90 font-light mb-10 space-y-4 p-8 bg-white/5 border border-white/20 backdrop-blur-[30px] rounded-xl shadow-[0_0_30px_rgba(255,0,60,0.1)_inset]">
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#ff003c] shadow-[0_0_10px_#ff003c]"></span> {t('pain_bullet1')}</p>
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#ff003c] shadow-[0_0_10px_#ff003c]"></span> {t('pain_bullet2')}</p>
              <p className="flex items-center gap-3 opacity-60"><span className="w-2 h-2 rounded-full bg-white/50"></span> {t('pain_bullet3')}</p>
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#ff003c] shadow-[0_0_10px_#ff003c]"></span> {t('pain_bullet4')}</p>
            </div>

            <p className="font-mono text-sm sm:text-base font-bold uppercase tracking-[0.2em] text-[#ff3366] border border-white/10 p-5 inline-block bg-white/5 backdrop-blur-[40px] drop-shadow-[0_0_10px_rgba(255,51,102,0.8)] rounded-lg">
              {t('pain_loss_message')}
            </p>
          </div>

          <div className="pain-cards-container grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 z-10 lg:ml-8" style={{ perspective: '2000px' }}>
             {painCardsData.map((card, i) => (
               <TiltCard
                 key={i} 
                 className="pain-card pain-card-animate group cursor-pointer border border-[#ff3366]/30 bg-[#ff3366]/5 backdrop-blur-[40px] flex flex-col justify-center min-h-[120px] sm:min-h-[160px] shadow-[0_0_50px_rgba(255,0,60,0.15)_inset]"
                 glowColor="rgba(255,0,60,0.8)"
               >
                 <div className="p-5 sm:p-8 h-full w-full flex flex-col justify-center">
                   <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-[#ff3366] opacity-90 mb-3 sm:mb-4 group-hover:scale-125 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(255,51,102,1)]" style={{ transform: 'translateZ(30px)' }} />
                   <p className="text-white font-mono text-[10px] sm:text-sm font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-1 sm:mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ transform: 'translateZ(20px)' }}>{t(card.titleKey)}</p>
                   <p className="text-[#ff3366] font-black text-lg sm:text-2xl tracking-tighter leading-none drop-shadow-[0_0_15px_rgba(255,51,102,0.8)]" style={{ transform: 'translateZ(40px)' }}>{t(card.resultKey)}</p>
                 </div>
               </TiltCard>
             ))}
             
             <div className="col-span-1 sm:col-span-2 mt-4 sm:mt-6 flex justify-center sm:justify-end" style={{ transform: 'translateZ(20px)' }}>
               <button onClick={handleSecondaryCtaClick} className="px-8 py-4 sm:py-5 bg-[#ff003c] border border-[#ff003c] text-white font-mono font-black text-sm sm:text-base uppercase tracking-[0.1em] shadow-[0_0_20px_rgba(255,0,60,0.6)] hover:bg-white hover:text-[#ff003c] hover:border-white hover:shadow-[0_0_40px_rgba(255,0,60,0.9)] hover:scale-105 hover:-translate-y-1 animate-pulse transition-all duration-500 backdrop-blur-xl rounded-lg w-full sm:w-auto group">
                  <span className="flex items-center gap-2">
                    {t('pain_cta_button')} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
               </button>
             </div>
          </div>

      </div>
    </section>
  );
}
export default PainScene;