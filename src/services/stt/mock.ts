import type { SttProvider } from './types';

const MOCK_PHRASES: Record<string, string[]> = {
  'zh-CN': [
    '我想问这个多少钱？',
    '今天天气怎么样？',
    '帮我给女儿发个消息',
    '最近的药店在哪里？',
    '我想看看家庭相册',
  ],
  'en-US': [
    'How much does this cost?',
    "What's the weather like today?",
    'Can you help me call my daughter?',
    'Tell me something interesting',
    'How do I send a photo to my family?',
    'Good morning, how are you?',
    'What time is my next appointment?',
  ],
};

const counters: Record<string, number> = {};

export const mockSttProvider: SttProvider = {
  async start(locale, onResult) {
    const phrases = MOCK_PHRASES[locale] ?? MOCK_PHRASES['en-US'];
    if (!counters[locale]) counters[locale] = 0;
    const phrase = phrases[counters[locale] % phrases.length];
    counters[locale]++;

    const words = phrase.split(' ');
    for (let i = 1; i <= words.length; i++) {
      await delay(400);
      onResult({ text: words.slice(0, i).join(' '), isFinal: false });
    }

    await delay(400);
    onResult({ text: phrase, isFinal: true });
  },

  async stop() {
    return undefined;
  },
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
