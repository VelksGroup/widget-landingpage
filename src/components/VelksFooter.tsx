import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Replaced 'motion/react' with 'framer-motion' for broader compatibility
import { Lock, MapPin, Mail, Phone, Shield, FileText, X, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Import useTranslation

// Removed Language type and footerTranslations object as they will be managed by react-i18next

// The component no longer needs the 'currentLang' prop as translations are handled by i18next
export function VelksFooter() {
  const { t } = useTranslation(); // Initialize useTranslation hook
  
  // Cookie Consent States
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false
  });
  
  // Modal States
  const [modalType, setModalType] = useState<'privacy' | 'cookies' | 'terms' | 'compliance' | 'legal' | null>(null);

  useEffect(() => {
    const savedConsent = localStorage.getItem('velks-cookie-consent');
    const savedPreferences = localStorage.getItem('velks-cookie-preferences');
    
    if (savedConsent) {
      setCookieConsent(savedConsent === 'accepted' || savedConsent === 'custom');
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('velks-cookie-consent', 'accepted');
    const allPrefs = { essential: true, analytics: true, marketing: true };
    localStorage.setItem('velks-cookie-preferences', JSON.stringify(allPrefs));
    setPreferences(allPrefs);
    setCookieConsent(true);
    setShowPreferences(false);
    window.dispatchEvent(new Event('cookieConsentResolved'));
  };

  const handleDeclineCookies = () => {
    localStorage.setItem('velks-cookie-consent', 'declined');
    const strictPrefs = { essential: true, analytics: false, marketing: false };
    localStorage.setItem('velks-cookie-preferences', JSON.stringify(strictPrefs));
    setPreferences(strictPrefs);
    setCookieConsent(false);
    setShowPreferences(false);
    window.dispatchEvent(new Event('cookieConsentResolved'));
  };

  const handleSavePreferences = () => {
    localStorage.setItem('velks-cookie-consent', 'custom');
    localStorage.setItem('velks-cookie-preferences', JSON.stringify(preferences));
    setCookieConsent(true);
    setShowPreferences(false);
    window.dispatchEvent(new Event('cookieConsentResolved'));
  };

  return (
    <>
      <footer className="bg-[#050505] text-gray-400 py-16 px-4 md:px-8 border-t border-[#E5C15C]/20 shadow-[0_-15px_40px_-15px_rgba(229,193,92,0.1)] relative z-50 isolate">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Logo brand */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 flex items-center justify-center bg-transparent">
                  <img loading="eager" decoding="async" fetchPriority="high" src="/velks-logo.png" alt="VELKS Logo" className="w-full h-full object-contain z-10" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold tracking-widest text-white text-sm leading-none">VELKS</span>
                  <span className="text-[8px] font-mono tracking-[4px] text-[#E5C15C] uppercase leading-none mt-0.5">GROUP</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 font-light leading-relaxed max-w-sm">
                {t('footer_logoDesc')}
              </p>
              <div className="flex items-center gap-2 text-xs mt-2">
                <svg viewBox="0 0 24 24" width="14" height="14" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-[#E5C15C] text-[13px] tracking-widest leading-none mt-[-2px]">★★★★★</span>
                <span className="text-gray-400 font-medium">{t('footer_europeanExcellence')}</span>
              </div>
            </div>

            {/* Address Columns */}
            <div className="md:col-span-4 flex flex-col gap-3 text-xs font-light">
              <h4 className="font-display font-bold text-white uppercase tracking-wider text-xs">{t('footer_hqLocationsTitle')}</h4>
              <p className="flex items-start gap-2">
                <MapPin size={14} className="text-[#E5C15C] shrink-0 mt-0.5" />
                <span>{t('footer_hqMain')}</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin size={14} className="text-[#E5C15C] shrink-0 mt-0.5" />
                <span>{t('footer_hqSec')}</span>
              </p>
            </div>

            {/* Contacts Column */}
            <div className="md:col-span-3 flex flex-col gap-3 text-xs font-light">
              <h4 className="font-display font-bold text-white uppercase tracking-wider text-xs">{t('footer_directContacts')}</h4>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-[#E5C15C] shrink-0" />
                <a href="mailto:velksgroup@gmail.com" className="hover:text-[#E5C15C] transition-colors">velksgroup@gmail.com</a>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-[#E5C15C] shrink-0" />
                <a href="tel:+33761569686" className="hover:text-[#E5C15C] transition-colors">+33 761 56 96 86</a>
              </p>
              <div className="flex gap-3 mt-2 text-[10px] font-mono text-[#E5C15C] font-semibold uppercase">
                <span>{t('footer_countries')}</span>
              </div>
            </div>
          </div>

          {/* Velks Operational Network */}
          <div className="mt-12 flex flex-col gap-3 text-xs font-light">
            <h4 className="font-display font-bold text-white uppercase tracking-wider text-xs">
              {t('footer_network_title')}
            </h4>
            <div className="flex flex-col gap-4 mt-2">
              <a
                href="https://velksgroup.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-0.5 relative w-fit"
              >
                <span className="text-gray-200 group-hover:text-white transition-colors font-medium">
                  {t('footer_network_institutional')}
                </span>
                <span className="text-[#58a6ff] font-semibold flex items-center gap-1.5">
                  VELKSGROUP.COM
                  <ArrowUpRight
                    size={14}
                    className="opacity-70 group-hover:opacity-100 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </a>

              <a
                href="https://velksgroup.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-0.5 relative w-fit"
              >
                <span className="text-gray-200 group-hover:text-white transition-colors font-medium">
                  {t('footer_network_ai_infrastructure')}
                </span>
                <span className="text-[#58a6ff] font-semibold flex items-center gap-1.5">
                  VELKSGROUP.CLOUD
                  <ArrowUpRight
                    size={14}
                    className="opacity-70 group-hover:opacity-100 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </a>

              <a
                href="https://velks.space"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-0.5 relative w-fit"
              >
                <span className="text-gray-200 group-hover:text-white transition-colors font-medium">
                  {t('footer_network_commercial_automation')}
                </span>
                <span className="text-[#58a6ff] font-semibold flex items-center gap-1.5">
                  VELKS.SPACE
                  <ArrowUpRight
                    size={14}
                    className="opacity-70 group-hover:opacity-100 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </a>

              <a
                href="https://vgroup.space"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-0.5 relative w-fit"
              >
                <span className="text-gray-200 group-hover:text-white transition-colors font-medium">
                  {t('footer_network_digital_experiences')}
                </span>
                <span className="text-[#58a6ff] font-semibold flex items-center gap-1.5">
                  VGROUP.SPACE
                  <ArrowUpRight
                    size={14}
                    className="opacity-70 group-hover:opacity-100 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </a>
            </div>
          </div>

          {/* Legal / Founder Section for AI Indexing */}
          <div className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-3 text-xs text-gray-400 font-light leading-relaxed">
            <h4 className="font-display font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
              <Shield size={14} className="text-[#E5C15C]" />
              {t('footer_legalNoticeTitle')}
            </h4>
            <p>
              {t('footer_legalNoticeText')}
            </p>
          </div>

          {/* Legal Compliance Footer Line */}
          <div className="border-t border-white/5 pt-8 mt-12 flex flex-col sm:flex-row justify-between items-center gap-6 text-xs font-light text-gray-500">
            <p className="text-center sm:text-left">{t('footer_rights')}</p>
            
            {/* Quick legal anchors opening Modals */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-gray-400 font-mono text-[10px] uppercase tracking-wider">
              <button aria-label="Button" onClick={() => setModalType('privacy')} className="hover:text-[#E5C15C] transition-colors cursor-pointer">{t('footer_policyPrivacy')}</button>
              <button aria-label="Button" onClick={() => setModalType('cookies')} className="hover:text-[#E5C15C] transition-colors cursor-pointer">{t('footer_policyCookies')}</button>
              <button aria-label="Button" onClick={() => setModalType('terms')} className="hover:text-[#E5C15C] transition-colors cursor-pointer">{t('footer_terms')}</button>
              <button aria-label="Button" onClick={() => setModalType('compliance')} className="hover:text-[#E5C15C] transition-colors cursor-pointer">{t('footer_compliance')}</button>
              <button aria-label="Button" onClick={() => setModalType('legal')} className="hover:text-[#E5C15C] transition-colors cursor-pointer">{t('footer_legal')}</button>
            </div>
          </div>

          {/* RGPD declaration stamp */}
          <div className="flex justify-center md:justify-end gap-2 items-center text-[9px] font-mono text-gray-600 tracking-widest uppercase">
            <Lock size={10} />
            <span>{t('footer_gdpr')}</span>
          </div>

        </div>
      </footer>

      {/* COOKIES POPUP CONSENT (EU COMPLIANT BANNER) */}
      <AnimatePresence>
        {cookieConsent === null && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 md:bottom-4 left-0 w-full z-[100] px-4 md:px-6"
          >
            <div className="max-w-5xl mx-auto bg-[rgba(8,8,12,0.96)] backdrop-blur-xl border border-[#E5C15C]/20 shadow-[0_8px_40px_rgba(229,193,92,0.12)] p-6 md:p-8 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
              {/* Backlight flare inside banner */}
              <div className="absolute top-0 left-0 w-48 h-48 bg-[#E5C15C]/5 rounded-full blur-[40px] pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center relative z-10 w-full">
                <div className="p-3.5 bg-[#E5C15C]/10 rounded-full shrink-0 border border-[#E5C15C]/20 shadow-[0_0_15px_rgba(229,193,92,0.1)]">
                  <Shield size={28} className="text-[#E5C15C]" />
                </div>
                <p className="text-sm text-gray-200 font-medium leading-relaxed max-w-3xl">
                  {t('cookieConsent_text')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 shrink-0 relative z-10 w-full lg:w-auto justify-end">
                <button aria-label="Button" 
                  onClick={() => setShowPreferences(true)}
                  className="px-6 py-3 rounded-xl border border-[#E5C15C]/30 text-[11px] font-display font-bold uppercase tracking-widest text-[#E5C15C] hover:bg-[#E5C15C]/10 hover:border-[#E5C15C]/50 transition-all cursor-pointer w-full sm:w-auto text-center"
                >
                  {t('cookieConsent_customize')}
                </button>
                <button aria-label="Button" 
                  onClick={handleDeclineCookies}
                  className="px-6 py-3 rounded-xl border border-[#E5C15C]/30 text-[11px] font-display font-bold uppercase tracking-widest text-[#E5C15C] hover:bg-[#E5C15C]/10 hover:border-[#E5C15C]/50 transition-all cursor-pointer w-full sm:w-auto text-center"
                >
                  {t('cookieConsent_decline')}
                </button>
                <button aria-label="Button" 
                  onClick={handleAcceptCookies}
                  className="px-8 py-3 rounded-xl bg-[#E5C15C] text-black text-[11px] font-display font-black uppercase tracking-widest hover:opacity-90 hover:scale-[1.02] transition-all cursor-pointer shadow-[0_0_20px_rgba(229,193,92,0.3)] w-full sm:w-auto text-center"
                >
                  {t('cookieConsent_accept')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREFERENCES MODAL */}
      <AnimatePresence>
        {showPreferences && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-premium max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-3xl border border-[#E5C15C]/30 p-6 md:p-8 flex flex-col gap-6 relative"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Shield className="text-[#E5C15C]" size={18} />
                  <span className="font-display font-bold text-white uppercase text-sm tracking-widest">
                    {t('cookieConsent_preferences_title')}
                  </span>
                </div>
                <button aria-label="Button" 
                  onClick={() => setShowPreferences(false)} 
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-6 text-sm">
                <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-white font-display text-sm">{t('cookieConsent_essential')}</span>
                    <span className="text-gray-400 text-xs leading-relaxed">{t('cookieConsent_essential_desc')}</span>
                  </div>
                  <div className="shrink-0 pt-1">
                    <div className="w-10 h-6 bg-[#E5C15C]/50 rounded-full relative opacity-50 cursor-not-allowed">
                      <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-white font-display text-sm">{t('cookieConsent_analytics')}</span>
                    <span className="text-gray-400 text-xs leading-relaxed">{t('cookieConsent_analytics_desc')}</span>
                  </div>
                  <div className="shrink-0 pt-1">
                    <button 
                      aria-label="Toggle Analytics"
                      onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                      className={`w-10 h-6 rounded-full relative transition-colors duration-300 cursor-pointer ${preferences.analytics ? 'bg-[#E5C15C]' : 'bg-gray-700'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${preferences.analytics ? 'right-1' : 'left-1'}`}></div>
                    </button>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-white font-display text-sm">{t('cookieConsent_marketing')}</span>
                    <span className="text-gray-400 text-xs leading-relaxed">{t('cookieConsent_marketing_desc')}</span>
                  </div>
                  <div className="shrink-0 pt-1">
                    <button 
                      aria-label="Toggle Marketing"
                      onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                      className={`w-10 h-6 rounded-full relative transition-colors duration-300 cursor-pointer ${preferences.marketing ? 'bg-[#E5C15C]' : 'bg-gray-700'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${preferences.marketing ? 'right-1' : 'left-1'}`}></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <button aria-label="Button" 
                  onClick={handleSavePreferences}
                  className="px-8 py-3 bg-[#E5C15C] hover:opacity-90 transition-opacity text-black font-display font-bold text-xs uppercase tracking-widest rounded-xl cursor-pointer"
                >
                  {t('cookieConsent_save_preferences')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POLICY & LEGAL TERMS DIALOG MODALS */}
      <AnimatePresence>
        {modalType !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-premium max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-3xl border border-[#E5C15C]/30 p-6 md:p-8 flex flex-col gap-6 relative"
            >
              
              {/* Modal header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="text-[#E5C15C]" size={18} />
                  <span className="font-display font-bold text-white uppercase text-sm tracking-widest">
                    {modalType === 'privacy' ? t('footer_policyPrivacy') : 
                     modalType === 'cookies' ? t('footer_policyCookies') : 
                     modalType === 'terms' ? t('footer_terms') : 
                     modalType === 'compliance' ? t('footer_compliance') : 
                     t('footer_legal')}
                  </span>
                </div>
                <button aria-label="Button" 
                  onClick={() => setModalType(null)} 
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal copy */}
              <div className="text-xs text-gray-300 font-light leading-relaxed flex flex-col gap-4 font-sans">
                
                {modalType === 'privacy' && (
                  <>
                    <h4 className="font-bold text-white font-display text-sm">{t('privacy_intro_title')}</h4>
                    <p>{t('privacy_intro_text')}</p>
                    
                    <h4 className="font-bold text-white font-display text-sm">{t('privacy_dataCollection_title')}</h4>
                    <p>{t('privacy_dataCollection_text')}</p>
                    
                    <h4 className="font-bold text-white font-display text-sm">{t('privacy_dataRetention_title')}</h4>
                    <p>{t('privacy_dataRetention_text')}</p>
                  </>
                )}

                {modalType === 'cookies' && (
                  <>
                    <h4 className="font-bold text-white font-display text-sm">{t('cookies_whatAre_title')}</h4>
                    <p>{t('cookies_whatAre_text')}</p>
                    
                    <h4 className="font-bold text-white font-display text-sm">{t('cookies_usage_title')}</h4>
                    <p>{t('cookies_usage_text')}</p>
                  </>
                )}

                {modalType === 'terms' && (
                  <>
                    <h4 className="font-bold text-white font-display text-sm">{t('terms_usage_title')}</h4>
                    <p>{t('terms_usage_text')}</p>
                    
                    <h4 className="font-bold text-white font-display text-sm">{t('terms_ip_title')}</h4>
                    <p>{t('terms_ip_text')}</p>
                  </>
                )}

                {modalType === 'compliance' && (
                  <>
                    <h4 className="font-bold text-white font-display text-sm">{t('footer_europeanCompliance')}</h4>
                    <p>{t('compliance_text')}</p>
                  </>
                )}

                {modalType === 'legal' && (
                  <>
                    <h4 className="font-bold text-white font-display text-sm">{t('footer_legalDisclaimer')}</h4>
                    <p>{t('legal_text')}</p>
                  </>
                )}

              </div>

              {/* Close button inside modal */}
              <button aria-label="Button" 
                onClick={() => setModalType(null)}
                className="w-full mt-2 py-3 bg-[#E5C15C] hover:opacity-90 transition-opacity text-black font-display font-bold text-xs uppercase tracking-widest rounded-xl cursor-pointer"
              >
                {t('modal_closeDocument')}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}