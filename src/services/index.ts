import { ENV } from '@/config/env';
import { mockAiProvider } from './ai/mock';
import { openAiProvider } from './ai/openai';
import type { AiProvider } from './ai/types';
import { asyncStorageRepository, supabaseRepository } from './data';
import type { DataRepository } from './data/types';
import { mockScamProvider } from './scam/mock';
import type { ScamProvider } from './scam/types';
import { mockSttProvider, nativeSttProvider } from './stt';
import type { SttProvider } from './stt/types';
import { expoSpeechTtsProvider, mockTtsProvider } from './tts';
import type { TtsProvider } from './tts/types';
import { mockTranslationProvider } from './translation/mock';
import type { TranslationProvider } from './translation/types';

export function getAiProvider(): AiProvider {
  return ENV.AI_PROVIDER === 'openai' ? openAiProvider : mockAiProvider;
}

export function getSttProvider(): SttProvider {
  return ENV.STT_PROVIDER === 'native' ? nativeSttProvider : mockSttProvider;
}

export function getTtsProvider(): TtsProvider {
  return ENV.TTS_PROVIDER === 'expo-speech' ? expoSpeechTtsProvider : mockTtsProvider;
}

export function getTranslationProvider(): TranslationProvider {
  return mockTranslationProvider;
}

export function getScamProvider(): ScamProvider {
  return mockScamProvider;
}

export function getDataRepository(): DataRepository {
  return ENV.DATA_REPOSITORY === 'supabase' ? supabaseRepository : asyncStorageRepository;
}
