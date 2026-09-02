import * as Speech from 'expo-speech';
import type { TtsProvider } from './types';

export const expoSpeechTtsProvider: TtsProvider = {
  async speak(text, options = {}) {
    await Speech.stop();
    return new Promise<void>((resolve) => {
      Speech.speak(text, {
        language: options.language ?? 'en-US',
        rate: options.rate ?? 0.9,
        pitch: 1,
        onDone: () => resolve(),
        onError: () => resolve(),
        onStopped: () => resolve(),
      });
    });
  },

  async stop() {
    await Speech.stop();
  },

  async isSpeaking() {
    return Speech.isSpeakingAsync();
  },
};
