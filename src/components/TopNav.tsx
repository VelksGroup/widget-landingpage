import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation

// Removed unused imports from the original component that were not used within MarqueeContent or TopNav:
// Play, ArrowUpRight, AlertTriangle, ChevronRight, Activity, Crosshair, Network, Mail, Globe, Lock, Linkedin, Instagram, Facebook, gsap, ScrollTrigger, TiltCard, BackgroundCanvas, useRef, useState

// These constants and functions are outside the scope of the `TopNav` and `MarqueeContent` components.
// While `whatsappUrl` contains translatable text, directly injecting `t()` here would require changing
// its definition (e.g., to a function that accepts `t` or by moving it inside a component).
// For this rewrite, the text is extracted to the JSON translations, but the URL itself remains as-is
// in the component code, assuming its usage would handle translation or it's provided by a higher scope.
const stripeCheckoutUrl = "https://book.stripe.com/dRmeVdbV4bCBc2Q7uF2cg00";
const whatsappUrl = "https://wa.me/33761569686?text=Ol%C3%A1%2C%20vi%20a%20demo%20da%20VELKS.SPACE%20e%20quero%20implementar%20este%20sistema%20no%20meu%20site.%20Pode%20me%20explicar%20o%20pr%C3%B3ximo%20passo%3F";
const handleMainCtaClick = () => window.open(stripeCheckoutUrl, "_blank", "noopener,noreferrer");
const handleSecondaryCtaClick = () => window.open(whatsappUrl, "_blank", "noopener,noreferrer");

// Define LANGUAGES with labelKeys that will be used for translation
const LANGUAGES = [
  { code: 'pt', flag: '🇧🇷', labelKey: 'language_pt' },
  { code: 'en', flag: '🇬🇧', labelKey: 'language_en' },
  { code: 'es', flag: '🇪🇸', labelKey: 'language_es' },
  { code: 'fr', flag: '🇫🇷', labelKey: 'language_fr' },
  { code: 'de', flag: '🇩🇪', labelKey: 'language_de' },
];

const MarqueeContent = () => {
  const { t } = useTranslation(); // Initialize useTranslation for MarqueeContent
  return (
    <div className="flex items-center shrink-0">
      <span className="text-[#ff003c] animate-pulse whitespace-nowrap">{t('marquee_promo_text', { oldPrice: '497€', newPrice: '297€' })}</span>
      <span className="opacity-30 mx-3 sm:mx-5">/</span>
      <span className="text-[#ffaa00] whitespace-nowrap">{t('marquee_free_months')}</span>
      <span className="opacity-30 mx-3 sm:mx-5">/</span>
      <span className="whitespace-nowrap">{t('marquee_one_time_payment')}</span>
      <span className="opacity-30 mx-3 sm:mx-5">/</span>
    </div>
  );
};

function TopNav() {
  const { t, i18n } = useTranslation(); // Initialize useTranslation for TopNav

  // The original useEffect for Google Translate is removed.
  // react-i18next handles language initialization and persistence internally.
  useEffect(() => {
    // Optional: You could set a default language or load from local storage here if i18next isn't configured for it.
    // For example, if i18n.language is not set, set it to 'pt'
    if (!i18n.language) {
      i18n.changeLanguage('pt');
    }
  }, [i18n]);

  const handleTranslate = (langCode: string) => {
    i18n.changeLanguage(langCode);
    // No need to manipulate cookies or reload the page as react-i18next handles state and re-renders automatically.
  };

  return (
    <div className="absolute top-[50px] right-4 sm:right-6 z-[90] flex justify-end pointer-events-none">
      {/* The Google Translate specific div is removed as it's no longer needed */}
      
      <div className="pointer-events-auto flex items-center gap-1.5 bg-black/80 backdrop-blur-xl border border-white/20 p-2 transition-all shadow-[0_0_30px_rgba(0,0,0,0.8)] rounded-full">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleTranslate(lang.code)}
            className={`flex items-center justify-center w-8 h-8 rounded-full text-lg transition-all duration-300 ${
              i18n.language === lang.code // Use i18n.language to determine the active language
                ? 'bg-[#cc00ff]/30 border border-[#cc00ff]/60 scale-110 shadow-[0_0_10px_rgba(204,0,255,0.4)] z-10'
                : 'hover:bg-white/10 border border-transparent grayscale-[0.6] hover:grayscale-0'
            }`}
            title={t(lang.labelKey)} // Translate the title attribute using the key
          >
            <span role="img" aria-label={t(lang.labelKey)} className="pointer-events-none -mt-0.5">{lang.flag}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TopNav;