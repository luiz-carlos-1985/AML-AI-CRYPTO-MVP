import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import pt from './locales/pt.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import it from './locales/it.json';
import ru from './locales/ru.json';
import ko from './locales/ko.json';
import ar from './locales/ar.json';

// Language configuration
const languages = {
  en: { translation: en },
  pt: { translation: pt },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  zh: { translation: zh },
  ja: { translation: ja },
  it: { translation: it },
  ru: { translation: ru },
  ko: { translation: ko },
  ar: { translation: ar }
};

// Supported languages list
export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' }
];

// Language detection options
const detectionOptions = {
  order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
  lookupLocalStorage: 'preferred-language',
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,
  caches: ['localStorage'],
  excludeCacheFor: ['cimode'],
  checkWhitelist: true
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: languages,
    
    // Language detection
    detection: detectionOptions,
    
    // Fallback language
    fallbackLng: 'en',
    
    // Supported languages
    supportedLngs: Object.keys(languages),
    
    // Namespace configuration
    defaultNS: 'translation',
    ns: ['translation'],
    
    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
      formatSeparator: ',',
      format: (value, format, lng) => {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        if (format === 'capitalize') return value.charAt(0).toUpperCase() + value.slice(1);
        
        // Number formatting
        if (format === 'number') {
          return new Intl.NumberFormat(lng).format(value);
        }
        
        // Currency formatting
        if (format === 'currency') {
          const currencyMap: Record<string, string> = {
            'en': 'USD',
            'pt': 'BRL',
            'es': 'EUR',
            'fr': 'EUR',
            'de': 'EUR',
            'zh': 'CNY',
            'ja': 'JPY'
          };
          return new Intl.NumberFormat(lng, {
            style: 'currency',
            currency: currencyMap[lng] || 'USD'
          }).format(value);
        }
        
        // Date formatting
        if (format === 'date') {
          return new Intl.DateTimeFormat(lng).format(new Date(value));
        }
        
        // Relative time formatting
        if (format === 'relative') {
          const rtf = new Intl.RelativeTimeFormat(lng, { numeric: 'auto' });
          const diff = (new Date(value).getTime() - Date.now()) / 1000;
          
          if (Math.abs(diff) < 60) return rtf.format(Math.round(diff), 'second');
          if (Math.abs(diff) < 3600) return rtf.format(Math.round(diff / 60), 'minute');
          if (Math.abs(diff) < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
          return rtf.format(Math.round(diff / 86400), 'day');
        }
        
        return value;
      }
    },
    
    // React options
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'span']
    },
    
    // Debug mode (disable in production)
    debug: process.env.NODE_ENV === 'development',
    
    // Key separator
    keySeparator: '.',
    
    // Nesting separator
    nsSeparator: ':',
    
    // Pluralization
    pluralSeparator: '_',
    
    // Context separator
    contextSeparator: '_',
    
    // Missing key handling
    saveMissing: process.env.NODE_ENV === 'development',
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${key} for language: ${lng}`);
      }
    },
    
    // Post-processing
    postProcess: ['interval', 'plural'],
    
    // Clean code on production
    cleanCode: true
  });

// Language change handler
i18n.on('languageChanged', (lng) => {
  // Update document direction for RTL languages
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  document.dir = rtlLanguages.includes(lng) ? 'rtl' : 'ltr';
  
  // Update document language
  document.documentElement.lang = lng;
  
  // Update meta tags
  const metaLang = document.querySelector('meta[name="language"]');
  if (metaLang) {
    metaLang.setAttribute('content', lng);
  }
  
  // Store preference
  localStorage.setItem('preferred-language', lng);
  
  // Dispatch custom event
  window.dispatchEvent(new CustomEvent('languageChanged', { 
    detail: { language: lng } 
  }));
});

// Utility functions
export const getCurrentLanguage = () => i18n.language;

export const changeLanguage = async (lng: string) => {
  try {
    await i18n.changeLanguage(lng);
    return true;
  } catch (error) {
    console.error('Failed to change language:', error);
    return false;
  }
};

export const getLanguageInfo = (code: string) => {
  return supportedLanguages.find(lang => lang.code === code);
};

export const isRTL = (lng?: string) => {
  const language = lng || i18n.language;
  return ['ar', 'he', 'fa', 'ur'].includes(language);
};

export const formatTranslation = (key: string, options?: any) => {
  return i18n.t(key, options);
};

// Export configured i18n instance
export default i18n;