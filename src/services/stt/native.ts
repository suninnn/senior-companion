import type { SttProvider } from './types';

export const nativeSttProvider: SttProvider = {
  async start() {
    throw new Error(
      'Native speech recognition requires a dev build and expo-speech-recognition. See README.'
    );
  },
  async stop() {
    throw new Error('Native speech recognition is not available in Expo Go.');
  },
};
