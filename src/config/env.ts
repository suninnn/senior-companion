export const ENV = {
  // Swap these flags to plug in real providers later.
  AI_PROVIDER: 'mock' as 'mock' | 'openai',
  STT_PROVIDER: 'mock' as 'mock' | 'native',
  TTS_PROVIDER: 'expo-speech' as 'expo-speech' | 'mock',
  TRANSLATION_PROVIDER: 'mock' as 'mock',
  DATA_REPOSITORY: 'async-storage' as 'async-storage' | 'supabase',
};
