import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS, TranslationDictionary, SUPPORTED_LANGUAGES } from '../i18n/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationDictionary;
  availableLanguages: typeof SUPPORTED_LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'scamlens_user_lang';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage;
      if (saved && TRANSLATIONS[saved]) {
        return saved;
      }
    } catch {
      // ignore storage access error
    }
    return 'en';
  });

  const setLanguage = (newLang: SupportedLanguage) => {
    if (TRANSLATIONS[newLang]) {
      setLanguageState(newLang);
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      } catch (err) {
        console.warn('Failed to persist language choice to localStorage:', err);
      }
    }
  };

  // Safe fallback to English for any missing keys
  const t = {
    ...TRANSLATIONS.en,
    ...(TRANSLATIONS[language] || {}),
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        availableLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
