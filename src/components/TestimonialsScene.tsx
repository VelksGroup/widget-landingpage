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
  const { t } = useTranslation(); // Initialize useTranslation
  return (
    <div className="flex items-center shrink-0">
      <span className="text-[#ff003c] animate-pulse whitespace-nowrap">
        {t('marquee_promo_limited_offer_prefix')} <span className="line-through opacity-50 px-1 font-normal">{t('marquee_promo_old_price')}</span> → {t('marquee_promo_new_price')}
      </span>
      <span className="opacity-30 mx-3 sm:mx-5">/</span>
      <span className="text-[#ffaa00] whitespace-nowrap">{t('marquee_promo_free_months')}</span>
      <span className="opacity-30 mx-3 sm:mx-5">/</span>
      <span className="whitespace-nowrap">{t('marquee_promo_one_time_payment')}</span>
      <span className="opacity-30 mx-3 sm:mx-5">/</span>
    </div>
  );
};

function TestimonialsScene() {
  const { t } = useTranslation(); // Initialize useTranslation

  // Case studies data using translation keys for names and results
  const caseStudies = [
    {
      nameKey: "case_ecommerce_health_name",
      resultKey: "case_ecommerce_health_result",
      src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=711&q=80",
    },
    {
      nameKey: "case_tech_software_name",
      resultKey: "case_tech_software_result",
      src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=711&q=80",
    },
    {
      nameKey: "case_digital_consulting_name",
      resultKey: "case_digital_consulting_result",
      src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=711&q=80",
    }
  ];

  return (
    <section id="scene-testimonials" className="relative w-full min-h-screen flex flex-col justify-center py-24 px-4 z-10 box-border overflow-hidden">
      <div className="max-w-7xl mx-auto w-full z-10 flex flex-col pt-12">
        <div className="text-center mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-32 bg-[#cc00ff]/20 blur-[100px] pointer-events-none rounded-full"></div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
            {t('testimonials_title_part1')}<br/> 
            <span className="text-[#00ffcc] relative inline-block drop-shadow-[0_0_30px_rgba(0,255,204,0.6)] animate-pulse mt-2 md:text-7xl">
              {t('testimonials_title_part2')}
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#00ffcc] shadow-[0_0_15px_#00ffcc]"></span>
            </span>
          </h2>
          <p 
            className="font-mono text-[#00ffcc] bg-[#00ffcc]/10 border border-[#00ffcc]/30 p-4 sm:p-6 rounded-xl max-w-3xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed backdrop-blur-sm shadow-[0_0_30px_rgba(0,255,204,0.15)_inset]"
            dangerouslySetInnerHTML={{ __html: t('testimonials_description') }} // Use dangerouslySetInnerHTML for HTML in description
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-items-center w-full">
          {caseStudies.map((caseData, i) => (
            <article key={i} className={`group relative w-full max-w-[320px] aspect-[9/16] rounded-2xl overflow-hidden bg-[#11001a] border-2 cursor-pointer transition-all duration-500 cyber-card-${i % 3}`}>
               <img loading="lazy" 
                 src={caseData.src} 
                 alt={t(caseData.nameKey)} // Translate alt text
                 className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 relative z-10 mix-blend-screen"
               />
               
               {/* Cyber grid overlay */}
               <div className="absolute inset-0 z-10 opacity-30 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 204, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 204, 0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
               <div className="absolute top-4 right-4 z-20 bg-black/80 backdrop-blur-md rounded-full px-4 py-1.5 font-mono text-xs text-[#00ffcc] border border-[#00ffcc]/50 flex gap-2 items-center shadow-[0_0_15px_rgba(0,255,204,0.5)]">
                 <span className="flex items-end gap-[2px] h-3">
                    <span className="w-[3px] rounded-full bg-[#00ffcc] h-full animate-[pulse_0.8s_ease-in-out_infinite]"></span>
                    <span className="w-[3px] rounded-full bg-[#00ffcc] h-2/3 animate-[pulse_1.2s_ease-in-out_infinite]"></span>
                    <span className="w-[3px] rounded-full bg-[#00ffcc] h-full animate-[pulse_1s_ease-in-out_infinite]"></span>
                    <span className="w-[3px] rounded-full bg-[#00ffcc] h-1/2 animate-[pulse_0.9s_ease-in-out_infinite]"></span>
                 </span>
                 <span className="text-[10px] uppercase font-bold text-[#00ffcc]">{t('voice_status_active')}</span>
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-10 transition-opacity duration-500 group-hover:opacity-80"></div>
               <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex flex-col gap-3 pointer-events-none transform group-hover:-translate-y-2 transition-transform duration-500">
                 <div className="flex items-center gap-2 bg-black/50 w-max px-3 py-1.5 rounded-full border border-[#00ffcc]/30 backdrop-blur-sm">
                   <div className="w-2 h-2 rounded-full bg-[#00ffcc] animate-pulse shadow-[0_0_10px_#00ffcc]"></div>
                   <p className="font-mono text-[10px] uppercase tracking-widest text-[#00ffcc] font-bold drop-shadow-md m-0">{t(caseData.nameKey)}</p>
                 </div>
                 <h3 className="text-2xl sm:text-3xl font-black text-white drop-shadow-[0_5px_15px_rgba(0,255,204,0.6)] leading-tight uppercase tracking-tight group-hover:text-[#00ffcc] transition-colors duration-300">{t(caseData.resultKey)}</h3>
               </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export default TestimonialsScene;