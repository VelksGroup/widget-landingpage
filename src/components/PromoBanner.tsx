import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

// The original component code snippet included many other imports and variables
// (e.g., Play, ArrowUpRight, AlertTriangle, ChevronRight, Activity, Crosshair,
// Network, Mail, Globe, Lock, Linkedin, Instagram, Facebook, gsap, ScrollTrigger,
// TiltCard, BackgroundCanvas, stripeCheckoutUrl, whatsappUrl, handleMainCtaClick,
// handleSecondaryCtaClick).
// These are not directly used by the PromoBanner or MarqueeContent components
// and have been omitted from the rewritten component code for brevity and focus
// on the requested component rewrite.

const MarqueeContent = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center shrink-0">
      <span className="text-[#ff003c] animate-pulse whitespace-nowrap">
        {/*
          Using Trans component for complex text that includes embedded HTML elements.
          The prices '497€' and '297€' are passed as values to be interpolated.
          The <span> tag for line-through styling is passed as a component.
        */}
        <Trans
          i18nKey="promo_limited_offer"
          components={{ 0: <span className="line-through opacity-50 px-1 font-normal" /> }}
          values={{ oldPrice: '497€', newPrice: '297€' }}
        />
      </span>
      <span className="opacity-30 mx-3 sm:mx-5">/</span>
      <span className="text-[#ffaa00] whitespace-nowrap">
        {t('promo_free_months')}
      </span>
      <span className="opacity-30 mx-3 sm:mx-5">/</span>
      <span className="whitespace-nowrap">
        {t('promo_one_time_payment')}
      </span>
    </div>
  );
};

function PromoBanner() {
  // The PromoBanner component itself does not contain any translatable text.
  // It primarily structures the layout and renders the MarqueeContent.
  // Therefore, `useTranslation` is not directly needed in this component,
  // but it is used within its child, MarqueeContent.
  return (
    <aside className="relative w-full bg-black/80 backdrop-blur-md border-b flex overflow-hidden border-[#ff003c]/40 text-white text-[10px] sm:text-xs font-black tracking-widest uppercase py-2.5 sm:py-3 z-[200]">
      <div className="flex animate-[marquee_22s_linear_infinite] w-max items-center">
        <div className="flex items-center shrink-0">
          <MarqueeContent />
          <MarqueeContent />
          <MarqueeContent />
          <MarqueeContent />
        </div>
        <div className="flex items-center shrink-0">
          <MarqueeContent />
          <MarqueeContent />
          <MarqueeContent />
          <MarqueeContent />
        </div>
      </div>
    </aside>
  );
}

export default PromoBanner;