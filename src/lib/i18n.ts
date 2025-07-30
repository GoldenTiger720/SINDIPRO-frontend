import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import JSON translation files
import enTranslations from '../locales/en.json';
import ptTranslations from '../locales/pt.json';

const resources = {
  en: {
    translation: enTranslations
  },
  pt: {
    translation: ptTranslations
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;