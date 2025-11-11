import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import ja from './locales/ja.json';
import zh from './locales/zh.json';
import it from './locales/it.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';
import ko from './locales/ko.json';
import ar from './locales/ar.json';

// Force English as default if no language is set
const storedLang = localStorage.getItem('i18nextLng');
if (!storedLang || storedLang.startsWith('pt')) {
  localStorage.setItem('i18nextLng', 'en');
}

const detectionOptions = {
  order: ['localStorage', 'navigator'],
  lookupLocalStorage: 'i18nextLng',
  caches: ['localStorage'],
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de },
      ja: { translation: ja },
      zh: { translation: zh },
      it: { translation: it },
      pt: { translation: pt },
      ru: { translation: ru },
      ko: { translation: ko },
      ar: { translation: ar }
    },
    detection: detectionOptions,
    fallbackLng: 'en',
    lng: 'en',
    supportedLngs: ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh', 'ko', 'ru', 'ar'],
    load: 'languageOnly',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

i18n.on('languageChanged', (lng) => {
  const rtlLanguages = ['ar'];
  document.dir = rtlLanguages.includes(lng) ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

export default i18n;
