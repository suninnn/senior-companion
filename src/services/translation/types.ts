import type { LanguageCode } from '@/models';

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
}

export interface TranslationProvider {
  translate(text: string, options: { from: LanguageCode; to: LanguageCode }): Promise<TranslationResult>;
}
