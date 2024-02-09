import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './en/translation.json';
import translationLT from './lt/translation.json';

const resources = {
  en: { translation: translationEN },
  lt: { translation: translationLT }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'en', // use en if detected lng is not available
    lng: 'en', // default language
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;
