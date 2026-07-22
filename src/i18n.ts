import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import pt from './locales/pt.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';

const getInitialLanguage = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const lang = urlParams.get('lang');
  if (lang && ['pt', 'en', 'es', 'fr', 'de'].includes(lang)) {
    return lang;
  }
  return 'pt';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: pt },
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de }
    },
    lng: getInitialLanguage(),
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
