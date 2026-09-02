import type { LanguageCode } from '@/models';
import type { TranslationProvider, TranslationResult } from './types';

const PAIRS: Record<string, Record<string, string>> = {
  'zh-CN': {
    '我想问这个多少钱？': 'How much does this cost?',
    '这个是二十美元。': 'This is twenty dollars.',
    '你好': 'Hello',
    '谢谢': 'Thank you',
  },
  'en-US': {
    'How much does this cost?': '这个多少钱？',
    'It is twenty dollars.': '这个是二十美元。',
    'Hello': '你好',
    'Thank you': '谢谢',
  },
};

export const mockTranslationProvider: TranslationProvider = {
  async translate(text, options) {
    await delay(600);
    const dictionary = PAIRS[options.from];
    const translated = dictionary?.[text.trim()] ?? `[${options.to}] ${text}`;

    return {
      originalText: text,
      translatedText: translated,
      sourceLanguage: options.from,
      targetLanguage: options.to,
    };
  },
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
