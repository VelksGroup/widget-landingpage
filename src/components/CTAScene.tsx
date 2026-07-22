import React, { useEffect, useRef, useState } from 'react';
import { Play, ArrowUpRight, AlertTriangle, ChevronRight, Activity, Crosshair, Network, Mail, Globe, Lock, Linkedin, Instagram, Facebook } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TiltCard } from './TiltCard';

import { useTranslation } from 'react-i18next'; // Import useTranslation

const stripeCheckoutUrl = "https://book.stripe.com/dRmeVdbV4bCBc2Q7uF2cg00";

// The original MarqueeContent was not used within the CTAScene component.
// If it were used, its content would also be extracted for translation.

function CTAScene() {
  const { t } = useTranslation(); // Initialize useTranslation hook

  // Helper function to dynamically generate the WhatsApp URL with a translated message
  const getWhatsappUrl = () => {
    const message = t('whatsapp_message');
    return `https://wa.me/33761569686?text=${encodeURIComponent(message)}`;
  };

  const handleMainCtaClick = () => window.open(stripeCheckoutUrl, "_blank", "noopener,noreferrer");
  const handleSecondaryCtaClick = () => window.open(getWhatsappUrl(), "_blank", "noopener,noreferrer");

  return (
    <section id="scene-4" className="relative w-full min-h-screen flex items-center justify-center py-24 px-4 z-10 text-center box-border overflow-hidden">
       <div className="max-w-5xl mx-auto flex flex-col items-center z-10 relative">
         
         <h2 
           className="text-5xl sm:text-6xl md:text-8xl lg:text-[7.5rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/80 tracking-tighter leading-[0.9] mb-8"
           style={{ filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.9)) drop-shadow(0px 0px 40px rgba(255, 170, 0, 0.3))' }}
         >
           {t('cta_scene_title_part1')} <br/>
           <span className="text-[#ffaa00] inline-block mt-2" style={{ filter: 'drop-shadow(0px 5px 20px rgba(0, 0, 0, 1))' }}>{t('cta_scene_title_part2')}</span>
         </h2>
         
         <TiltCard className="mb-12 w-full max-w-4xl" glowColor="rgba(255,170,0,0.6)">
           <div className="bg-black/50 backdrop-blur-[40px] border border-white/20 rounded-2xl p-6 sm:p-8 md:p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)_inset,0_20px_40px_rgba(0,0,0,0.5)] h-full w-full">
             <p className="text-xl sm:text-2xl md:text-4xl font-light text-white mb-0 leading-relaxed" style={{ transform: 'translateZ(30px)', textShadow: '0 5px 15px rgba(0,0,0,1), 0 0 40px rgba(0,0,0,1)' }}>
               {t('cta_scene_description_part1')} <b className="text-[#ffcc00] font-black" style={{ textShadow: '0 4px 10px rgba(0,0,0,1)' }}>{t('cta_scene_description_ai_system')}</b> {t('cta_scene_description_part2')} <i className="text-[#ffaa00]" style={{ textShadow: '0 4px 10px rgba(0,0,0,1)' }}>{t('cta_scene_description_inject')}</i> {t('cta_scene_description_part3')}
             </p>
           </div>
         </TiltCard>

         <div className="bg-black/60 backdrop-blur-3xl border border-[#ffaa00]/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-lg px-4 sm:px-16 py-6 mb-16 transform -rotate-1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffaa00]/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-[2000ms] skew-x-12"></div>
            <p className="text-sm sm:text-2xl text-[#ffcc00] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] font-mono m-0 flex items-center justify-center gap-2 sm:gap-4" style={{ textShadow: '0 4px 15px rgba(0,0,0,1)' }}>
              <span className="w-4 h-4 bg-[#ffaa00] rounded-full animate-ping"></span>
               {t('cta_scene_alert_slots_left')}
            </p>
         </div>

         <div className="flex flex-col sm:flex-row gap-6 w-full justify-center max-w-3xl mb-16 px-4">
            <button onClick={handleMainCtaClick} className="relative w-full sm:w-auto px-6 sm:px-12 py-5 sm:py-6 bg-[#ffaa00] text-black font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-sm sm:text-lg hover:bg-white transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_40px_rgba(255,170,0,0.6)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.6),0_0_80px_rgba(255,170,0,1)] hover:-translate-y-2 hover:scale-105 flex items-center justify-center gap-4 group">
               {t('cta_scene_main_cta')} <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6 group-hover:translate-x-2 transition-transform" />
            </button>
            
            <button onClick={handleSecondaryCtaClick} className="w-full sm:w-auto px-6 sm:px-12 py-5 sm:py-6 bg-black/60 text-white font-mono text-sm sm:text-base font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] border border-white/30 hover:bg-black/80 hover:border-white transition-all duration-300 backdrop-blur-2xl flex items-center justify-center gap-4 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
               {t('cta_scene_secondary_cta')} <ArrowUpRight className="w-5 h-5 text-[#ffaa00]" />
            </button>
         </div>

         {/* Badges / Mentions */}
         <div className="flex flex-wrap justify-center gap-4 font-mono text-xs sm:text-sm font-bold tracking-widest uppercase mb-16 z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            <div className="flex items-center gap-2 px-5 py-3 border-2 border-white bg-white text-black rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)]">
              <span>🇪🇺</span> {t('cta_scene_badge_made_in_eu')}
            </div>
            <div className="flex items-center gap-2 px-5 py-3 border-2 border-brand-cyan bg-brand-cyan text-black rounded-full shadow-[0_0_20px_rgba(0,229,255,0.4)]">
              <Lock className="w-4 h-4" /> {t('cta_scene_badge_gdpr_compliance')}
            </div>
         </div>

         <div className="flex flex-col sm:flex-row divide-y justify-between sm:divide-y-0 sm:divide-x divide-white/20 border-y border-white/20 py-4 sm:py-8 opacity-100 w-full max-w-4xl text-center bg-black/50 backdrop-blur-xl rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
           <span className="font-mono text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-[#ffcc00] px-4 sm:px-8 py-3 sm:py-0" style={{ textShadow: '0 4px 15px rgba(0,0,0,1)' }}>{t('cta_scene_no_extra_team')}</span>
           <span className="font-mono text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-[#ffcc00] px-4 sm:px-8 py-3 sm:py-0" style={{ textShadow: '0 4px 15px rgba(0,0,0,1)' }}>{t('cta_scene_no_delayed_response')}</span>
           <span className="font-mono text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-[#ffcc00] px-4 sm:px-8 py-3 sm:py-0" style={{ textShadow: '0 4px 15px rgba(0,0,0,1)' }}>{t('cta_scene_no_lost_client')}</span>
         </div>
       </div>
    </section>
  );
}
export default CTAScene;