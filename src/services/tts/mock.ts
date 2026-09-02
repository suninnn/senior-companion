import type { TtsProvider } from './types';

export const mockTtsProvider: TtsProvider = {
  async speak(text) {
    // eslint-disable-next-line no-console
    console.log('[Mock TTS]', text);
  },
  async stop() {},
  async isSpeaking() {
    return false;
  },
};
