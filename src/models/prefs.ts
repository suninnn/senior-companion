export type FontSizePreset = 'normal' | 'large' | 'extraLarge';
export type UserRole = 'senior' | 'family';
export type LanguageCode = 'zh-CN' | 'en-US';

export interface AccessibilityPrefs {
  fontSize: FontSizePreset;
  highContrast: boolean;
  ttsEnabled: boolean;
  speechRate: number;
  primaryLanguage: LanguageCode;
}

export const DEFAULT_PREFS: AccessibilityPrefs = {
  fontSize: 'normal',
  highContrast: false,
  ttsEnabled: true,
  speechRate: 0.9,
  primaryLanguage: 'zh-CN',
};
