import React, { useEffect, useRef, useState } from 'react';
import { Play, ArrowUpRight, AlertTriangle, ChevronRight, Activity, Crosshair, Network, Mail, Globe, Lock, Linkedin, Instagram, Facebook } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TiltCard } from './TiltCard'; // Assuming TiltCard is used elsewhere or will be removed if not
 // Assuming BackgroundCanvas is used elsewhere or will be removed if not
import { useTranslation } from 'react-i18next'; // Import useTranslation

// Placeholder for SealsRow - assuming it's an external component or defined elsewhere.
// If it contains text, it would need its own useTranslation implementation.
const SealsRow = () => {
  const { t } = useTranslation();
  // Simplified placeholder; real component would render actual seals/logos
  return (
    <div className="text-white/70 text-xs mt-8">
      {t('seals_row_placeholder')}
    </div>
  );
};

// URL constants - the text within the whatsappUrl query parameter is external to the UI,
// so it is not extracted here. If it were visible text, it would be extracted.
const stripeCheckoutUrl = "https://book.stripe.com/dRmeVdbV4bCBc2Q7uF2cg00";
const whatsappUrl = "https://wa.me/33761569686?text=Ol%C3%A1%2C%20vi%20a%20demo%20da%20VELKS.SPACE%20e%20quero%20implementar%20este%20sistema%20no%20meu%20site.%20Pode%20me%20explicar%20o%20pr%C3%B3ximo%20passo%3F";
const handleMainCtaClick = () => window.open(stripeCheckoutUrl, "_blank", "noopener,noreferrer");
const handleSecondaryCtaClick = () => window.open(whatsappUrl, "_blank", "noopener,noreferrer");

// Extracted MarqueeContent to be a functional component to use useTranslation
const MarqueeContent = () => {
    const { t } = useTranslation();
    return (
        <div className="flex items-center shrink-0">
            <span className="text-[#ff003c] animate-pulse whitespace-nowrap">
                ⚡ {t('marquee_promo', { oldPrice: '497€', newPrice: '297€' })}
            </span>
            <span className="opacity-30 mx-3 sm:mx-5">/</span>
            <span className="text-[#ffaa00] whitespace-nowrap">{t('marquee_free_months')}</span>
            <span className="opacity-30 mx-3 sm:mx-5">/</span>
            <span className="whitespace-nowrap">{t('marquee_one_time_payment')}</span>
            <span className="opacity-30 mx-3 sm:mx-5">/</span> {/* Added missing separator */}
        </div>
    );
};

function VSLHeroScene() {
  // Initialize useTranslation hook
  const { t } = useTranslation();

  return (
    <section id="scene-1" className="relative w-full min-h-screen pt-24 pb-16 flex flex-col justify-center px-4 lg:px-12 z-10 box-border">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        
        {/* Mobile-first: Text content above video on small screens, beside it on desktop */}
        <div className="flex flex-col space-y-6 z-10 w-full order-1 lg:order-1 pt-6 lg:pt-0">
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-[#00ff88]/30 bg-[#00ff88]/10 w-max backdrop-blur-md rounded-none">
            <div className="w-1.5 h-1.5 bg-[#00ff88] animate-pulse"></div>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#00ff88]">{t('hero_tagline')}</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-black tracking-tighter text-white leading-[1.1] drop-shadow-2xl uppercase">
            {t('hero_title_line1')} <br className="hidden lg:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00ffa6] drop-shadow-[0_0_15px_rgba(0,255,136,0.5)]">{t('hero_title_line2')}</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light max-w-2xl leading-snug lg:leading-relaxed">
            {t('hero_description_part1')} <span className="text-[#00ff88] font-bold">{t('hero_description_highlight')}</span> {t('hero_description_part2')}
          </p>

          <div className="border-l-[3px] border-[#00ff88] pl-4 py-1 my-2">
             <p className="font-mono text-sm sm:text-base uppercase tracking-widest text-[#00ff88] font-bold drop-shadow-[0_0_5px_rgba(0,255,136,0.3)]">
               {t('hero_warning_line1')}<br className="hidden sm:block" />
               {t('hero_warning_line2')}
             </p>
          </div>
          
          {/* Assiste message */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 w-full max-w-md hidden lg:block mt-4">
             <p className="text-white text-sm font-light leading-relaxed">
               {t('hero_demo_cta_line1')}<br/> {t('hero_demo_cta_line2')}
             </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-2">
            <div className="relative w-full sm:w-auto group/btn">
              <div className="absolute inset-0 bg-[#00ff88]/40 blur-[20px] rounded opacity-50 group-hover/btn:opacity-100 transition-opacity duration-500 animate-[pulse_3s_ease-in-out_infinite]"></div>
              <button onClick={handleSecondaryCtaClick} className="relative w-full sm:w-auto px-10 py-5 bg-[#00ff88] text-black font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all duration-500 hover:-translate-y-1 shadow-[0_0_20px_rgba(0,255,136,0.4)] group-hover/btn:shadow-[0_0_40px_rgba(0,255,136,0.8)] flex items-center justify-center gap-3">
                {t('hero_cta_implement')} <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </button>
            </div>
            <button onClick={() => {
              const el = document.getElementById('demo-video-container');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }} className="w-full sm:w-auto px-8 py-5 bg-transparent border-2 border-[#00ff88]/50 text-[#00ff88] hover:text-black font-mono text-sm font-bold uppercase tracking-widest hover:bg-[#00ff88] transition-all duration-300 shadow-[0_0_15px_rgba(0,255,136,0.1)]">
               {t('hero_cta_watch_demo')}
            </button>
          </div>
          
          <SealsRow />
        </div>

        {/* Vertical Video Demo Hero - Centered and highlighted */}
        <div id="demo-video-container" className="relative w-full aspect-[9/16] max-w-[350px] sm:max-w-[400px] mx-auto lg:ml-auto lg:mr-0 z-20 order-2 lg:order-2 perspective-1000">
           <div className="absolute inset-0 bg-gradient-to-br from-[#cc00ff]/30 via-transparent to-[#ff00a2]/30 blur-2xl -z-10 rounded-3xl"></div>
           
           <div className="w-full h-full glass-panel-light p-1 lg:p-2 rounded-2xl border border-white/20 shadow-2xl relative overflow-hidden group">
              {/* Vertical Video background */}
              <video 
                className="absolute inset-0 w-full h-full object-cover rounded-xl"
                src="/demo-video.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
              />
              
              {/* Premium Glow Edge */}
              <div className="absolute inset-0 border border-brand-cyan/40 rounded-xl pointer-events-none mix-blend-overlay"></div>
           </div>
           
           {/* Mobile-only assist message under video */}
           <div className="mt-4 text-center lg:hidden bg-black/60 backdrop-blur-md border border-white/10 p-3">
             <p className="text-white/80 text-xs font-light">
               {t('hero_demo_cta_line1')}. {t('hero_demo_cta_line2')}
             </p>
           </div>
        </div>
      </div>
    </section>
  );
}

export default VSLHeroScene;