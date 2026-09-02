import type { AiProvider } from './types';

export const openAiProvider: AiProvider = {
  async ask() {
    throw new Error('OpenAI provider not configured. Set OPENAI_API_KEY in env.ts.');
  },
  async summarize() {
    throw new Error('OpenAI provider not configured. Set OPENAI_API_KEY in env.ts.');
  },
};
