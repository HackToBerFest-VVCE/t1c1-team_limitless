import { describe, it, expect } from 'vitest';
import { TRANSLATIONS, SUPPORTED_LANGUAGES } from '../i18n/translations';

describe('Internationalization & Multilingual System', () => {
  it('registers all 9 required languages', () => {
    const languageCodes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expect(languageCodes).toEqual(['en', 'hi', 'kn', 'ta', 'te', 'bn', 'mr', 'es', 'fr']);
    expect(languageCodes.length).toBe(9);
  });

  it('contains essential translation keys across all 9 languages', () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      const dict = TRANSLATIONS[lang.code];
      expect(dict).toBeDefined();
      expect(dict.appName).toBe('ScamLens AI');
      expect(dict.tagline.length).toBeGreaterThan(0);
      expect(dict.subtitle.length).toBeGreaterThan(0);
      expect(dict.assistantTitle.length).toBeGreaterThan(0);
      expect(dict.psychologistTitle.length).toBeGreaterThan(0);
      expect(dict.qrTitle.length).toBeGreaterThan(0);
      expect(dict.verdictSafe.length).toBeGreaterThan(0);
      expect(dict.verdictScam.length).toBeGreaterThan(0);
    }
  });
});
